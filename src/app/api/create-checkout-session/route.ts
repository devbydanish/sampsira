import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
  try {
    const { priceId, isSubscription, mode } = await request.json();
    const jwt = cookies().get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user info from the JWT
    const userData = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then(res => res.json());

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userData.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode || 'payment',
      subscription_data: isSubscription ? {
        trial_period_days: 7 // Optional: Add a trial period
      } : undefined,
      metadata: {
        userId: userData.id,
      },
      success_url: isSubscription 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/plan?success=true&session_id={CHECKOUT_SESSION_ID}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/credits?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: isSubscription
        ? `${process.env.NEXT_PUBLIC_APP_URL}/plan?canceled=true`
        : `${process.env.NEXT_PUBLIC_APP_URL}/credits?canceled=true`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}