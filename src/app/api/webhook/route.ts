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

  // Handle different Stripe events
  switch (event!.type) {
    // Handle successful subscription creation
    case 'checkout.session.completed': {
      try {
        console.log('event', event);
        const session = event!.data.object as Stripe.Checkout.Session;
        console.log('session', session);
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId;
          const isSubscription = session.metadata?.isSubscription === 'true';
          console.log('userId', userId);
          console.log('isSubscription', isSubscription);
          if (!userId) {
            console.error('No userId found in session metadata');
            return NextResponse.json({ error: 'No userId found' }, { status: 400 });
          }
          
          // Update user based on purchase type
          if (isSubscription) {
            // Update user subscription status
            await updateUserSubscription(userId, session);
          } else {
            // Add credits to user account
            console.log('Adding credits to user account');
            await addCreditsToUser(userId, session);
          }
        
        }
      } catch (error) {
        console.error('Error handling checkout.session.completed:', error);
        return NextResponse.json({ error: 'Error handling checkout.session.completed' }, { status: 500 });
      }
      break;
    }
    
    // Handle subscription status changes
    case 'customer.subscription.updated': {
      const subscription = event!.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event!.data.object as Stripe.Subscription;
      await handleSubscriptionCancellation(subscription);
      break;
    }
    
    // Handle invoice payment success/failure
    case 'invoice.payment_succeeded': {
      const invoice = event!.data.object as Stripe.Invoice;
      await handleInvoicePaymentSuccess(invoice);
      break;
    }
    
    case 'invoice.payment_failed': {
      const invoice = event!.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailure(invoice);
      break;
    }
    
    default:
      console.log(`Unhandled event type: ${event!.type}`);
  }
  
  return NextResponse.json({ received: true });
}

// Helper functions for handling different webhook events

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
        subscriptionPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
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

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
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
    
    if (!userData.data || userData.data.length === 0) {
      throw new Error('User not found for subscription');
    }
    
    const userId = userData.data[0].id;
    
    // Update subscription status
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        subscriptionStatus: subscription.status,
        subscriptionPeriodEnd: new Date((subscription as any).current_period_end * 1000).toISOString(),
      }),
    });
  } catch (error) {
    console.error('Error handling subscription update:', error);
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
    
    if (!userData.data || userData.data.length === 0) {
      throw new Error('User not found for subscription');
    }
    
    const userId = userData.data[0].id;
    
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
      }),
    });
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}

async function handleInvoicePaymentSuccess(invoice: Stripe.Invoice) {
  // If you need to handle successful invoice payments differently
  // For example, sending confirmation emails or updating usage records
  console.log('Invoice payment succeeded:', invoice.id);
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
    
    if (!userData.data || userData.data.length === 0) {
      throw new Error('User not found for subscription');
    }
    
    const userId = userData.data[0].id;
    
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