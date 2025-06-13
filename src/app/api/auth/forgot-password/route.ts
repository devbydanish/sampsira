import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email } = body

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Call Strapi API to send password reset email
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/forgot-password`,
            { email }
        )

        return NextResponse.json(
            { message: 'Password reset link sent to your email' },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error sending password reset email:', error)
        return NextResponse.json(
            { error: 'Error sending password reset email' },
            { status: 500 }
        )
    }
} 