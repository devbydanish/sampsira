import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const { credits, price, userId, paymentMethodId, customerId } = await request.json();

        if (!paymentMethodId) {
            return NextResponse.json(
                { error: 'Payment method ID is required' },
                { status: 400 }
            );
        }

        // Create or retrieve customer if not provided
        let customerIdToUse = customerId;
        if (!customerIdToUse) {
            const customer = await stripe.customers.create({
                payment_method: paymentMethodId,
            });
            customerIdToUse = customer.id;
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, // Convert to cents
            currency: 'usd',
            customer: customerIdToUse,
            payment_method: paymentMethodId,
            metadata: {
                credits,
                userId
            },
            confirm: true, // Confirm the payment immediately
            off_session: true, // The payment is happening without the customer present
            payment_method_types: ['card'],
            setup_future_usage: 'off_session', // Allow future off-session payments
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            customerId: customerIdToUse,
        });
    } catch (err) {
        console.error('Error creating payment intent:', err);
        if (err instanceof Stripe.errors.StripeError) {
            return NextResponse.json(
                { error: err.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Error creating payment intent' },
            { status: 500 }
        );
    }
}