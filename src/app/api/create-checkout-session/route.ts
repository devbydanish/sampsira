import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function POST(request: NextRequest) {
  try {
    // Get the JWT token from cookies
    const jwt = request.headers.get('Authorization')?.split(' ')[1];
    if (!jwt) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user information from Strapi
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 401 }
      );
    }

    const userData = await userResponse.json();
    console.log('userData', userData);
    // Get request body
    const { priceId: productId, isSubscription, mode } = await request.json();

    // Get the price for this product
    let priceId: string;
    
    try {
      // Retrieve all prices for this product
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
      });
      
      if (prices.data.length === 0) {
        throw new Error('No active prices found for this product');
      }
      
      // For subscriptions, find recurring price; for one-time, find one-time price
      const targetPrice = prices.data.find(price => 
        isSubscription ? price.recurring !== null : price.recurring === null
      );
      
      if (!targetPrice) {
        throw new Error(`No ${isSubscription ? 'recurring' : 'one-time'} price found for this product`);
      }
      
      priceId = targetPrice.id;
      
    } catch (priceError) {
      console.error('Error retrieving price for product:', productId, priceError);
      return NextResponse.json(
        { error: 'Invalid product configuration' },
        { status: 400 }
      );
    }

    // Create a Stripe customer if one doesn't exist
    let customerId = userData.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        metadata: {
          userId: userData.id.toString(),
        },
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          stripeCustomerId: customerId,
        }),
      });
    }

    console.log('customerId', customerId);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode as 'subscription' | 'payment',
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/plan`,
      metadata: {
        userId: userData.id.toString(),
        productId: productId,
        priceId: priceId,
        isSubscription: isSubscription.toString(),
      },
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error('Stripe session creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}