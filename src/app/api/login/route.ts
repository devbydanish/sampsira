
// Utilities
import { SUCCESSFUL, UNAUTHORIZED } from '@/core/constants/codes'


export async function POST(req: Request) {

    // Get passed data
    const body = await req.json()

    try {
        // Compare user credentials here.
        
        let userData;

        // Mock user data based on email - in production this would come from your database and authentication logic
        // if (body.email === 'admin@app.com') {
        //     userData = {
        //         id: 1,
        //         name: 'LA 4TA, INC.',
        //         role: 'Admin',
        //         cover: '/images/users/thumb.jpg',
        //         email: body.email,
        //         username: 'la4tainc'
        //     };
        // } 

        
        
        return new Response(JSON.stringify(userData), {
            status: SUCCESSFUL,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
    } catch (e) {
        console.error(e)
        return new Response('Login failed', {status: UNAUTHORIZED})
    }
}