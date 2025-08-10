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

    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ amount, trackId })
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error using credits:', error);
    return NextResponse.json(
      { error: 'Error using credits' },
      { status: 500 }
    );
  }
}
