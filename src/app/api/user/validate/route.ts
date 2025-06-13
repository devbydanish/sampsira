import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const username = searchParams.get('username')
        const email = searchParams.get('email')

        if (!username && !email) {
            return NextResponse.json(
                { error: 'Username or email is required' },
                { status: 400 }
            )
        }

        // Check if the user exists in Strapi
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
                },
                params: {
                    filters: {
                        $or: [
                            { username: { $eq: username } },
                            { email: { $eq: email } }
                        ]
                    }
                }
            }
        )

        // If any users were found, the username or email is already in use
        if (response.data && response.data.length > 0) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 200 }
            )
        }

        return NextResponse.json(
            { message: 'Username and email are available' },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error validating user:', error)
        return NextResponse.json(
            { error: 'Error validating user' },
            { status: 500 }
        )
    }
} 