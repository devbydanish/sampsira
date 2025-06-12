/**
 * Credit management helper utilities
 */

/**
 * Calculate the total credits for a user (regular credits + subscription credits)
 * @param user User data object with credits and sub_credits
 * @returns Total usable credits
 */
export function getTotalCredits(user: any): number {
  // Regular credits (permanent)
  const regularCredits = user.credits || 0;
  
  // Subscription credits (only usable if subscription is active)
  const subCredits = user.sub_credits || 0;
  
  // Check if subscription is active to determine if sub_credits should be counted
  const isSubscriptionActive = 
    user.isSubscribed === true &&
    user.subscriptionStatus === 'active';
  
  // If subscription is active, count sub_credits, otherwise only count regular credits
  return regularCredits + (isSubscriptionActive ? subCredits : 0);
}

/**
 * Calculate how credits will be consumed for a given amount
 * @param user User data object
 * @param amount Amount of credits to use
 * @returns Object containing the calculation of credits to use from each type, or null if insufficient credits
 */
export function calculateCreditUsage(user: any, amount: number): { 
  subCreditsToUse: number; 
  regularCreditsToUse: number;
  sufficient: boolean;
} | null {
  const regularCredits = user.credits || 0;
  const subCredits = user.sub_credits || 0;
  
  // Check if subscription is active to determine if sub_credits should be counted
  const isSubscriptionActive = 
    user.isSubscribed === true &&
    user.subscriptionStatus === 'active';
  
  // Total available credits
  const availableSubCredits = isSubscriptionActive ? subCredits : 0;
  const totalCredits = regularCredits + availableSubCredits;
  
  // Check if there are enough credits total
  if (totalCredits < amount) {
    return {
      subCreditsToUse: 0,
      regularCreditsToUse: 0,
      sufficient: false
    };
  }
  
  // Determine how many credits to use from each type
  // Use subscription credits first, then regular credits
  const subCreditsToUse = Math.min(availableSubCredits, amount);
  const regularCreditsToUse = amount - subCreditsToUse;
  
  return {
    subCreditsToUse,
    regularCreditsToUse,
    sufficient: true
  };
}

/**
 * Check if a user has enough credits for a given amount
 * @param user User data object
 * @param amount Amount of credits needed
 * @returns True if user has enough credits, false otherwise
 */
export function hasEnoughCredits(user: any, amount: number): boolean {
  return getTotalCredits(user) >= amount;
} 