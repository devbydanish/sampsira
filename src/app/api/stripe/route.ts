import axios from 'axios';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const baseUrl = process.env.BASE_URL;

export const POST = async (req: Request) => {
    console.log('Received Stripe webhook');


    if (req.method === 'POST') {
        console.log('Processing POST request for Stripe webhook');

        const sig = req.headers.get('stripe-signature')!;
        const rawBody = await req.text();

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                rawBody,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            console.error(`Webhook Error: ${err.message}`);
            return new Response('Webhook Error', { status: 400, statusText: err.message });
        }

        console.log(`Received Stripe event: ${event.type}`);
        let session: any;
        let invoice: any;
        let invoice2: any;
        switch (event.type) {
            case 'checkout.session.completed':
                console.log('Checkout session completed');
                session = event.data.object as Stripe.Checkout.Session;

                // get all line items from stripe session
                // const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                // const period = lineItems.data[0].description.split(' ')[1] === 'Mensual' ? 'month' : 'year';
                // const subscribedTill = period === 'month' ? new Date(new Date().setMonth(new Date().getMonth() + 1)) : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

                // // Update subscription status in your backend
                // await axios.put(`${baseUrl}/api/user`, {
                //     id: session.client_reference_id,
                //     subscribedTill
                // });

                invoice = await stripe.invoices.retrieve(session.invoice!);
                break;

            case 'invoice.payment_succeeded':
                console.log('Invoice payment succeeded');
                invoice2 = event.data.object as Stripe.Invoice;
                console.log(invoice2.billing_reason)
                if (invoice2.billing_reason === 'subscription_cycle' || invoice2.billing_reason === 'subscription_create') {
                    const subscription = await stripe.subscriptions.retrieve(invoice2.subscription as string);
                    console.log(subscription.current_period_end)
                    // Update subscription status in your backend
                    await axios.put(`${baseUrl}/api/user/recurring`, {
                        email: invoice2.customer_email,
                        subscribedTill: new Date(subscription.current_period_end * 1000)
                    });
                }
                break;

            case 'invoice.payment_failed':
                console.log('Invoice payment failed');
                invoice = event.data.object as Stripe.Invoice;

                // Handle the failed payment, such as notifying the customer
                await axios.put(`${baseUrl}/api/user`, {
                    id: invoice.metadata.client_reference_id,
                    subscribedTill: new Date(new Date().setDate(new Date().getDate() - 1))
                });
                break;

            case 'invoice.created':
                console.log('Invoice created');
                invoice = event.data.object as Stripe.Invoice;

                if (invoice.status === 'draft') {
                    // Finalize the invoice to move it from draft to open
                    await stripe.invoices.finalizeInvoice(invoice.id);
                    console.log('Invoice finalized');

                    // Pay the finalized invoice
                    await stripe.invoices.pay(invoice.id);
                    console.log('Invoice paid');
                }
                break;

            default:
                console.log('Unhandled event type:', event.type);
                break;
        }

        return new Response('Webhook received', { status: 200 });
    } else {
        return new Response('Method not allowed', { status: 405 });
    }
};
