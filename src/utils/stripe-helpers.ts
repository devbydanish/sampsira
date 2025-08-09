/**
 * Stripe helper utilities for payment processing
 */

export interface CreditPlan {
  productId: string;
  credits: number;
  name: string;
}

/**
 * Configuration for different credit plans
 * You can modify this to match your Stripe product IDs and credit amounts
 */
export const CREDIT_PLANS: CreditPlan[] = [
  {
    productId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_MONTHLY_SUBSCRIPTION || '',
    credits: 50,
    name: 'Monthly Subscription'
  },
  {
    productId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_YEARLY_SUBSCRIPTION || '',
    credits: 600,
    name: 'Yearly Subscription'
  }
  // Add more plans as needed
];

/**
 * Get the number of credits for a given product ID
 */
export function getCreditsForProductId(productId: string): number {
  const plan = CREDIT_PLANS.find(p => p.productId === productId);
  return plan?.credits || 0;
}

/**
 * Validate if a product ID is for a subscription
 */
export function isSubscriptionProductId(productId: string): boolean {
  return productId === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_MONTHLY_SUBSCRIPTION ||
    productId === process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_YEARLY_SUBSCRIPTION;
}

/**
 * Validate if a product ID is for credits
 */
export function isCreditsProductId(productId: string): boolean {
  return CREDIT_PLANS.some(plan => plan.productId === productId);
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toLowerCase(),
  }).format(amount);
}

/**
 * Stripe error types for better error handling
 */
export const STRIPE_ERROR_TYPES = {
  CARD_DECLINED: 'card_declined',
  INSUFFICIENT_FUNDS: 'insufficient_funds',
  EXPIRED_CARD: 'expired_card',
  INVALID_CARD: 'incorrect_cvc',
  PROCESSING_ERROR: 'processing_error',
  AUTHENTICATION_REQUIRED: 'authentication_required'
} as const;

/**
 * Get user-friendly error message for Stripe errors
 */
export function getStripeErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    [STRIPE_ERROR_TYPES.CARD_DECLINED]: 'Your card was declined. Please try a different payment method.',
    [STRIPE_ERROR_TYPES.INSUFFICIENT_FUNDS]: 'Insufficient funds. Please check your account balance.',
    [STRIPE_ERROR_TYPES.EXPIRED_CARD]: 'Your card has expired. Please use a different card.',
    [STRIPE_ERROR_TYPES.INVALID_CARD]: 'Invalid card details. Please check and try again.',
    [STRIPE_ERROR_TYPES.PROCESSING_ERROR]: 'Payment processing error. Please try again.',
    [STRIPE_ERROR_TYPES.AUTHENTICATION_REQUIRED]: 'Additional authentication required. Please complete the verification.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
}
