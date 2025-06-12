import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function GET(request: NextRequest) {
  try {
    // Get the session ID from the query parameters
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get the checkout session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Extract payment details
    const isSubscription = session.mode === 'subscription';
    let productName = 'Unknown Product';
    let amount = '$0.00';

    if (session.line_items && session.line_items.data.length > 0) {
      const lineItem = session.line_items.data[0];
      
      // Get product name
      if (lineItem.price && lineItem.price.product && typeof lineItem.price.product !== 'string') {
        const product = lineItem.price.product;
        if ('name' in product) {
          productName = product.name || 'Unknown Product';
        }
      }
      
      // Format amount
      if (lineItem.amount_total) {
        amount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: session.currency || 'usd',
        }).format(lineItem.amount_total / 100);
      }
    }

    return NextResponse.json({
      isSubscription,
      productName,
      amount,
      customerEmail: session.customer_details?.email,
    });
  } catch (error: any) {
    console.error('Error fetching payment details:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
} 