import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCreditsForProductId } from '@/utils/stripe-helpers';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15' as any,
});

// This function verifies the Stripe webhook signature
async function verifyStripeSignature(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    return { event, error: null };
  } catch (err: any) {
    return { event: null, error: `Webhook Error: ${err.message}` };
  }
}

export async function POST(request: NextRequest) {
  // Verify the webhook signature
  const { event, error } = await verifyStripeSignature(request);
  
  if (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 400 });
  }

  console.log('Webhook event received:', event!.type);

  // Handle different Stripe events
  try {
    switch (event!.type) {
      // Handle successful subscription creation
      case 'checkout.session.completed': {
        console.log('checkout.session.completed');
        const session = event!.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId;
          const isSubscription = session.metadata?.isSubscription === 'true';
          console.log('userId', userId);
          console.log('isSubscription', isSubscription);
          if (!userId) {
            throw new Error('No userId found in session metadata');
          }
          
          if (isSubscription) {
            await updateUserSubscription(userId, session);
          } else {
            console.log('Adding credits to user account');
            await addCreditsToUser(userId, session);
          }
        }
        break;
      }
      
      case 'customer.subscription.created': {
        console.log('customer.subscription.created');
        const subscription = event!.data.object as Stripe.Subscription;
        // Only handle active subscriptions
        if (subscription.status === 'active') {
          await handleSubscriptionCreated(subscription);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        console.log('customer.subscription.updated');
        const subscription = event!.data.object as Stripe.Subscription;
        // Find user by customer ID instead of subscription ID for more reliability
        await handleSubscriptionUpdate(subscription);
        break;
      }
      
      case 'customer.subscription.deleted': {
        console.log('customer.subscription.deleted');
        const subscription = event!.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        console.log('invoice.payment_succeeded');
        const invoice = event!.data.object as Stripe.Invoice;
        if ((invoice as any).subscription) {
          await handleSubscriptionRenewal(invoice);
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        console.log('invoice.payment_failed');
        const invoice = event!.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailure(invoice);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event!.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Helper function to find user by customer ID
async function findUserByCustomerId(customerId: string) {
  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[stripeCustomerId][$eq]=${customerId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    }
  );
  
  if (!userResponse.ok) {
    throw new Error('Failed to fetch user data');
  }
  
  const userData = await userResponse.json();
  
  if (!userData || userData.length === 0) {
    throw new Error('User not found');
  }
  
  return userData[0];
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log("Subscription in creation: ", subscription);
    const user = await findUserByCustomerId(subscription.customer as string);
    console.log("User data in creation: ", user);
    
    // Update user subscription details only - credits are handled by checkout.session.completed
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        isSubscribed: true,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscribedUntil: new Date((subscription as any).current_period_end * 1000).toISOString(),
        firstSubscriptionDate: user.firstSubscriptionDate || new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user subscription status');
    }
  } catch (error) {
    console.error('Error handling subscription creation:', error);
    throw error;
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    const user = await findUserByCustomerId(subscription.customer as string);
    
    // Update subscription status
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        subscriptionStatus: subscription.status,
        subscribedUntil: new Date((subscription as any).current_period_end * 1000).toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

async function handleSubscriptionRenewal(invoice: Stripe.Invoice) {
  try {
    if (!(invoice as any).subscription) return;
    
    const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
    const user = await findUserByCustomerId(invoice.customer as string);

    // Only handle renewals, not the initial subscription payment
    // Check if this is a renewal by looking at the billing_reason
    if (invoice.billing_reason === 'subscription_cycle') {
      // Create credit transaction for renewal
      const transactionResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/credit-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            users_permissions_user: user.id,
            amount: 100,
            type: 'subscription',
            stripeInvoiceId: invoice.id,
            status: 'completed',
            date: new Date().toISOString(),
            publishedAt: new Date().toISOString()
          }
        }),
      });
      
      if (!transactionResponse.ok) {
        throw new Error('Failed to create renewal credit transaction');
      }
      
      // Update user subscription details
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          subscriptionStatus: subscription.status,
          subscribedUntil: new Date((subscription as any).current_period_end * 1000).toISOString(),
          sub_credits: (user.sub_credits || 0) + 100, // Add new subscription credits only for renewals
        }),
      });
    } else {
      // For initial subscription, just update the subscription status
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          subscriptionStatus: subscription.status,
          subscribedUntil: new Date((subscription as any).current_period_end * 1000).toISOString(),
        }),
      });
    }
  } catch (error) {
    console.error('Error handling subscription renewal:', error);
    throw error;
  }
}

async function updateUserSubscription(userId: string, session: Stripe.Checkout.Session) {
  try {
    // Get subscription ID from the session
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    // Create credit transaction entry for subscription
    const transactionResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/credit-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          users_permissions_user: userId,
          amount: 100, // Monthly subscription credits
          type: 'subscription',
          stripePaymentIntentId: session.payment_intent as string,
          status: 'completed',
          date: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }
      }),
    });
    
    if (!transactionResponse.ok) {
      console.error('Failed to create subscription credit transaction:', await transactionResponse.text());
      throw new Error('Failed to create subscription credit transaction');
    }
    
    // Get current user data
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await userResponse.json();
    
    // For first-time subscribers, we need to ensure we handle any existing sub_credits
    const existingSubCredits = userData.sub_credits || 0;
    
    // Update user in Strapi
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        isSubscribed: true,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscribedUntil: new Date((subscription as any).current_period_end * 1000).toISOString(),
        // For first-time subscribers, add 100 new credits to any existing sub_credits
        // This handles cases where they had leftover sub_credits from a previous subscription
        sub_credits: existingSubCredits + 100,
        firstSubscriptionDate: userData.firstSubscriptionDate || new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user subscription status');
    }
    
    console.log('Successfully updated subscription and created transaction record');
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
}

async function addCreditsToUser(userId: string, session: Stripe.Checkout.Session) {
  try {
    // Get the line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    
    // Determine the number of credits to add based on the product
    let creditsToAdd = 0;
    let productId = session.metadata?.productId;
    
    // Get credits using our helper function
    if (productId) {
      creditsToAdd = getCreditsForProductId(productId);
    }
    
    if (creditsToAdd <= 0) {
      console.error('Could not determine credits to add for product ID:', productId);
      throw new Error('Could not determine credits to add');
    }
    
    console.log(`Adding ${creditsToAdd} credits for product ID: ${productId}`);
    
    // Get current user credits
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await userResponse.json();
    const currentCredits = userData.credits || 0;
    
    // Create credit transaction entry
    const transactionResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/credit-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          users_permissions_user: userId,
          amount: creditsToAdd,
          type: 'purchase',
          stripePaymentIntentId: session.payment_intent as string,
          status: 'completed',
          date: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }
      }),
    });
    
    if (!transactionResponse.ok) {
      console.error('Failed to create credit transaction:', await transactionResponse.text());
      throw new Error('Failed to create credit transaction');
    }
    
    // Update user in Strapi with new credits
    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        credits: currentCredits + creditsToAdd,
      }),
    });
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update user credits');
    }
    
    console.log('Successfully added credits and created transaction record');
  } catch (error) {
    console.error('Error adding credits to user:', error);
    throw error;
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    // Find the user with this subscription
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[subscriptionId][$eq]=${subscription.id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await userResponse.json();
    
    if (!userData || userData.length === 0) {
      throw new Error('User not found for subscription');
    }
    
    const userId = userData[0].id;
    
    // Update subscription status
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        isSubscribed: false,
        subscriptionStatus: 'canceled',
        // Do not reset sub_credits to zero here
        // They will remain but won't be usable until subscription is renewed
      }),
    });
    
    console.log('Subscription cancelled for user:', userId);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}

async function handleInvoicePaymentFailure(invoice: Stripe.Invoice) {
  try {
    // Find the user with this subscription
    if (!(invoice as any).subscription) return;
    
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?filters[subscriptionId][$eq]=${(invoice as any).subscription}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );
    
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const userData = await userResponse.json();
    
    if (!userData || userData.length === 0) {
      throw new Error('User not found for subscription');
    }
    
    const userId = userData[0].id;
    
    // Update subscription status to reflect payment failure
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        subscriptionStatus: 'past_due',
      }),
    });
    
    // You might also want to send a notification email to the user
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
    throw error;
  }
} 