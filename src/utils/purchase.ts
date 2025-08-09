import { loadStripe } from '@stripe/stripe-js';

export async function initiatePurchase(
  stripeProductId: string, 
  isSubscription: boolean,
  jwt?: string
) {
  if (!jwt) {
    window.location.href = '/auth/login';
    return;
  }

  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  if (!stripe) {
    console.error('Failed to load Stripe');
    alert('Payment system is currently unavailable. Please try again later.');
    return;
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        priceId: stripeProductId,
        isSubscription,
        mode: isSubscription ? 'subscription' : 'payment'
      }),
    });

    const session = await response.json();
    if (session.error) {
      console.error('Session Error:', session.error);
      const userMessage = session.error.includes('Authentication') 
        ? 'Please log in to continue with your purchase.'
        : 'Unable to create payment session. Please try again.';
      alert(userMessage);
      return;
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error('Stripe Error:', result.error);
      alert('Payment failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An unexpected error occurred. Please try again.');
  }
}