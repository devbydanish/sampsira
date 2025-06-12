import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { calculateCreditUsage } from '@/utils/credit-helpers';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const jwt = cookies().get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user data including credits and sub_credits
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    // Calculate credit usage using our helper function
    const creditUsage = calculateCreditUsage(userData, amount);
    
    if (!creditUsage || !creditUsage.sufficient) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    // Get current credit amounts
    const credits = userData.credits || 0;
    const subCredits = userData.sub_credits || 0;

    // Calculate new credit balances
    const newRegularCredits = credits - creditUsage.regularCreditsToUse;
    const newSubCredits = subCredits - creditUsage.subCreditsToUse;

    // Create credit transaction entry
    const transactionResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/credit-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          users_permissions_user: userId,
          amount: -amount, // Negative amount for credits used
          type: 'usage',
          status: 'completed',
          sub_credits_used: creditUsage.subCreditsToUse,
          regular_credits_used: creditUsage.regularCreditsToUse,
          date: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }
      }),
    });

    if (!transactionResponse.ok) {
      throw new Error('Failed to create credit usage transaction');
    }

    // Update user credits in Strapi
    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        credits: newRegularCredits,
        sub_credits: newSubCredits,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update credits');
    }

    return NextResponse.json({
      success: true,
      credits: newRegularCredits,
      sub_credits: newSubCredits,
      total_credits: newRegularCredits + (userData.isSubscribed ? newSubCredits : 0),
      credits_used: amount
    });
  } catch (error) {
    console.error('Error using credits:', error);
    return NextResponse.json(
      { error: 'Error using credits' },
      { status: 500 }
    );
  }
} 