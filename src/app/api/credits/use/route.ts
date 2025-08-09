import { calculateCreditUsage } from '@/utils/credit-helpers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, trackId, jwt } = await request.json();

    if (!jwt) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user data including credits and sub_credits
    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=*`, {
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
    console.log("userData", userData);

    // Calculate credit usage using our helper function
    const creditUsage = calculateCreditUsage(userData, amount);

    if (!creditUsage || !creditUsage.sufficient) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    console.log("creditUsage", creditUsage);

    // Get current credit amounts
    const credits = userData.credits || 0;
    const subCredits = userData.sub_credits || 0;

    // Calculate new credit balances
    const newRegularCredits = credits - creditUsage.regularCreditsToUse;
    const newSubCredits = subCredits - creditUsage.subCreditsToUse;

    console.log("newRegularCredits", newRegularCredits);
    console.log("newSubCredits", newSubCredits);

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
          track: trackId,
          amount: -amount, // Negative amount for credits used
          type: 'purchase',
          status: 'completed',
          date: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }
      }),
    });

    console.log("transactionResponse", transactionResponse);

    if (!transactionResponse.ok) {
      throw new Error('Failed to create credit usage transaction', {
        cause: transactionResponse.json(),
      });
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
        track_purchased: [...(userData.track_purchased || []), trackId],
      }),
    });

    console.log("updateResponse", updateResponse);

    if (!updateResponse.ok) {
      throw new Error('Failed to update credits');
    }

    // Update track credits_earned by adding the amount of credits received from user
    // Get track data
    const trackResponse1 = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks/${trackId}?populate=*`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    console.log("trackResponse1", trackResponse1);

    const trackData = await trackResponse1.json();
    const creditsEarned = trackData?.data?.attributes?.credits_earned;

    console.log("creditsEarned", trackData.producer);

    // create track owner transactions
    const trackOwnerTransactionResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/credit-transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          users_permissions_user: trackData.data.attributes.producer.data.id,
          track: trackId,
          amount: amount,
          type: 'sale',
          status: 'completed',
          date: new Date().toISOString(),
          publishedAt: new Date().toISOString()
        }
      }),
    });

    console.log("trackOwnerTransactionResponse", trackOwnerTransactionResponse);

    if (!trackOwnerTransactionResponse.ok) {
      throw new Error('Failed to create track owner transaction');
    }

    const trackResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks/${trackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          credits_earned: creditsEarned + amount
        }
      }),
    });

    const trackData2 = await trackResponse.json();
    console.log("trackData2", trackData2);

    if (!trackResponse.ok) {
      throw new Error('Failed to update track credits used');
    }

    // Get the track url
    const trackUrl = trackData?.data?.attributes?.audio?.data?.attributes?.url;

    return NextResponse.json({
      success: true,
      credits: newRegularCredits,
      sub_credits: newSubCredits,
      total_credits: newRegularCredits + (userData.isSubscribed ? newSubCredits : 0),
      credits_used: amount,
      track_url: trackUrl
    });
  } catch (error) {
    console.error('Error using credits:', error);
    return NextResponse.json(
      { error: 'Error using credits' },
      { status: 500 }
    );
  }
}
