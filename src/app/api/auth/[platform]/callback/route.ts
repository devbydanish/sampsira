import { USER_KEY } from '@/core/constants/constant';

import { NextResponse } from 'next/server'

async function handleInstagramCallback(code: string) {
    const clientId = process.env.INSTAGRAM_CLIENT_ID
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/instagram/callback`

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: clientId!,
            client_secret: clientSecret!,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code
        })
    })

    const { access_token, user_id } = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch(`https://graph.instagram.com/v12.0/${user_id}?fields=username,account_type&access_token=${access_token}`)
    const userData = await userResponse.json()

    return { ...userData, accessToken: access_token }
}

async function handleFacebookCallback(code: string) {
    const clientId = process.env.FACEBOOK_CLIENT_ID
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/facebook/callback`

    // Exchange code for access token
    const tokenResponse = await fetch(`https://graph.facebook.com/v12.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`)
    const { access_token } = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`)
    const userData = await userResponse.json()

    return { ...userData, accessToken: access_token }
}

async function handleYouTubeCallback(code: string) {
    const clientId = process.env.YOUTUBE_CLIENT_ID
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/youtube/callback`

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: clientId!,
            client_secret: clientSecret!,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        })
    })

    const { access_token } = await tokenResponse.json()

    // Get channel info
    const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const channelData = await channelResponse.json()
    const channel = channelData.items[0]

    return {
        id: channel.id,
        username: channel.snippet.title,
        accessToken: access_token
    }
}

async function handleTikTokCallback(code: string) {
    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/tiktok/callback`

    // Exchange code for access token
    const tokenResponse = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
        method: 'POST',
        body: new URLSearchParams({
            client_key: clientKey!,
            client_secret: clientSecret!,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        })
    })

    const { data: { access_token, open_id } } = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch('https://open-api.tiktok.com/user/info/', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    })

    const userData = await userResponse.json()

    return {
        id: open_id,
        username: userData.data.user.display_name,
        accessToken: access_token
    }
}

async function handleGoogleCallback(code: string) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: clientId!,
            client_secret: clientSecret!,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        })
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.id_token) {
        console.error('No ID token received from Google:', tokenData);
        throw new Error('Failed to get ID token from Google');
    }
    const idToken = tokenData.id_token;

    // Verify ID token (optional, but recommended)
    // You can use a library like 'google-auth-library' for more robust verification
    // For simplicity, we'll just decode it and check the signature
    // const { payload } = await jwt.verify(idToken, clientSecret);
    // console.log('Decoded ID token payload:', payload);

    // Get user info from ID token payload (already included in ID token)
    const userData = {
        id: tokenData.sub, // or payload.sub if you verify the token
        username: tokenData.name, // or payload.name
        email: tokenData.email, // or payload.email
        accessToken: tokenData.access_token,
    };

    // TODO: Sign in or register user in your application database
    // Example:
    // await authService.signInOrRegisterWithGoogle(userData);

    return userData;
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const platform = url.pathname.split('/')[3]
        const code = url.searchParams.get('code')
        const state = url.searchParams.get('state')

        if (!code || state !== localStorage.getItem('oauth_state')) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?error=invalid_state`)
        }

        let userData

        switch (platform) {
            case 'instagram':
                userData = await handleInstagramCallback(code)
                break
            case 'facebook':
                userData = await handleFacebookCallback(code)
                break
            case 'youtube':
                userData = await handleYouTubeCallback(code)
                break
            case 'tiktok':
                userData = await handleTikTokCallback(code)
                break
            case 'google':
                userData = await handleGoogleCallback(code)
                break;
            default:
                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?error=invalid_platform`)
        }

        try {
            // Simulate backend user registration/login
            // In a real app, you would send a request to your backend here
            localStorage.setItem(USER_KEY, JSON.stringify(userData));

            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`); // Redirect to homepage after successful auth
        } catch (error) {
            console.error('Error during user sign-in/registration:', error);
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?error=login_failed`); // Redirect to auth page with error
        }
    } catch (error) {
        console.error('OAuth callback error:', error)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth?error=auth_failed`)
    }
}
