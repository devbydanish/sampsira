import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const jwt = cookies().get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    const userData = await response.json();
    return NextResponse.json(userData);
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json(
      { error: 'Error fetching user' },
      { status: 500 }
    );
  }
}