
// Modules
import { NextRequest } from 'next/server'

// Utilities
import { INVALIDATE, SUCCESSFUL } from '@/core/constants/codes'
 

export async function POST(req: NextRequest) {

    // Get passed data
    const body = await req.json()

    try {
        // Do register stuff here.
        
        return new Response('Registration successfully', {status: SUCCESSFUL})
        
    } catch (e) {
        console.error(e)
        return new Response('Registration failed', {status: INVALIDATE})
    }
}