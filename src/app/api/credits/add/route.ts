import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { paymentIntentId } = await request.json();
    const jwt = cookies().get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Call Strapi API to update user credits
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    const currentCredits = userData.credits || 0;

    // Update user credits in Strapi
    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        credits: currentCredits + 100, // Add 100 credits
      }),
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update credits');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json(
      { error: 'Error adding credits' },
      { status: 500 }
    );
  }
}