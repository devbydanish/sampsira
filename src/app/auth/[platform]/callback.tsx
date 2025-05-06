import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthentication } from '@/core/contexts/authentication';

export default function OAuthCallback() {
    const router = useRouter();
    const { code, state, platform } = router.query;
    const { currentUser } = useAuthentication();
    const [status, setStatus] = useState('Processing your request...');

    useEffect(() => {
        const handleOAuthCallback = async () => {
            // Get the stored state and platform from localStorage
            const savedState = localStorage.getItem('oauth_state');
            const savedPlatform = localStorage.getItem('oauth_platform');
            
            // Validate state and ensure we have all required data
            if (!code || !savedState || state !== savedState || !savedPlatform || !platform) {
                setStatus('Authentication failed. Redirecting back to profile...');
                setTimeout(() => router.push('/settings'), 2000);
                return;
            }

            try {
                setStatus(`Connecting your ${savedPlatform} account...`);
                
                // Exchange code for user data
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/${savedPlatform}/callback`, 
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.jwt}`,
                        },
                        body: JSON.stringify({ code }),
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to connect ${savedPlatform}`);
                }

                const data = await response.json();
                
                // Connect social account with user profile
                const connectResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/connect-social`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${currentUser?.jwt}`,
                        },
                        body: JSON.stringify({
                            platform: savedPlatform,
                            username: data.username,
                            profileUrl: data.profileUrl
                        }),
                    }
                );

                if (!connectResponse.ok) {
                    throw new Error(`Failed to save ${savedPlatform} connection`);
                }

                const connectData = await connectResponse.json();
                
                // Update user in localStorage to reflect the changes
                if (currentUser && connectData.success) {
                    const updatedUser = {
                        ...currentUser,
                        socialAccounts: connectData.socialAccounts
                    };
                    
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setStatus(`Successfully connected ${savedPlatform}! Redirecting...`);
                }
            } catch (error) {
                console.error('OAuth callback error:', error);
                setStatus(`Error connecting your ${savedPlatform} account. Redirecting...`);
            } finally {
                // Clean up localStorage and redirect
                localStorage.removeItem('oauth_state');
                localStorage.removeItem('oauth_platform');
                setTimeout(() => router.push('/settings'), 2000);
            }
        };

        if (code && state && platform && typeof window !== 'undefined') {
            handleOAuthCallback();
        }
    }, [code, state, platform, router, currentUser]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="text-center">
                <div className="spinner-border mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>{status}</p>
            </div>
        </div>
    );
}