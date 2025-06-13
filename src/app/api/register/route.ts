// Modules
import { NextRequest } from 'next/server'
import axios from 'axios'

// Utilities
import { INVALIDATE, SUCCESSFUL } from '@/core/constants/codes'
 

export async function POST(req: NextRequest) {
    // Get passed data
    const body = await req.json()

    try {
        const { username, email, password, firstName, lastName, city, state, role } = body
        
        // Register the user with Strapi
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
            {
                username,
                email,
                password,
                firstName,
                lastName,
                city,
                state,
                isProducer: role === 'producer',
                producerName: body.producerName || '',
            }
        )

        if (!response.data || !response.data.jwt) {
            throw new Error('Registration failed')
        }

        return new Response(JSON.stringify({
            message: 'Registration successful',
            user: response.data.user,
            jwt: response.data.jwt
        }), {
            status: SUCCESSFUL,
            headers: { 'Content-Type': 'application/json' }
        })
        
    } catch (error: any) {
        console.error('Registration error:', error?.response?.data || error)
        
        const errorMessage = error?.response?.data?.error?.message || 'Registration failed'
        
        return new Response(JSON.stringify({
            error: errorMessage
        }), {
            status: INVALIDATE,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}