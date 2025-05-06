import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const { customerId } = await request.json();

        // TEST IMPLEMENTATION: Using pm_card_visa for testing
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                token: 'pm_card_visa', // Test token for Stripe
            },
        });

        /*
        // LIVE IMPLEMENTATION: Collect paymentMethodId from the frontend
        const { paymentMethodId } = await request.json();

        if (!paymentMethodId) {
            return NextResponse.json(
                { error: 'Payment Method ID is required' },
                { status: 400 }
            );
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        */

        // Attach the PaymentMethod to the customer
        if (customerId) {
            await stripe.paymentMethods.attach(paymentMethod.id, {
                customer: customerId,
            });

            // Set it as the default payment method
            await stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethod.id,
                },
            });
        }

        return NextResponse.json({ paymentMethodId: paymentMethod.id });
    } catch (error) {
        console.error('Error creating payment method:', error);
        return NextResponse.json(
            { error: 'Error creating payment method' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');

        if (!customerId) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });

        return NextResponse.json(paymentMethods.data);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        return NextResponse.json(
            { error: 'Error fetching payment methods' },
            { status: 500 }
        );
    }
}