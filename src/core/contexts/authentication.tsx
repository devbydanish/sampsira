"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { USER_KEY, SONG_KEY } from '../constants/constant'
import { CurrentUserTypes } from '../types'
import { useDispatch } from 'react-redux'
import { getUser, LogoutUs } from '@/redux/features/userSlice'

type ExtendedUserType = CurrentUserTypes & {
    role: string;
    isProducer: boolean;
    firstName?: string;
    lastName?: string;
    tracks?: any[];
    soundKits?: any[];
    img?: string;
}

interface AuthContextProps {
    logout: () => void
    signInWithGoogle: () => Promise<void>
    currentUser: any | null
    isLoading: boolean
}

const AuthContext = createContext({} as AuthContextProps)

interface AuthenticationProps {
    children: React.ReactNode
}

const Authentication: React.FC<AuthenticationProps> = (props) => {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const [user, setUser] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const verifyUserStatus = async (token: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate[tracks][fields][0]=title&populate[tracks][fields][1]=bpm&populate[tracks][fields][2]=moods&populate[tracks][fields][3]=keys&populate[tracks][fields][4]=isSoundKit&populate[tracks][populate][audio][fields][0]=url&populate[tracks][populate][cover][fields][0]=url&populate[soundKits][fields][0]=title&populate[soundKits][populate][cover][fields][0]=url&populate[soundKits][populate][tracks][populate][audio][fields][0]=url&populate[img][fields][0]=url`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                throw new Error('Failed to verify user status');
            }

            const userData = await response.json();
            console.log('User verification response:', {
                originalData: userData,
                isProducer: userData.isProducer,
                type: typeof userData.isProducer
            });
            
            return {
                ...userData,
                isProducer: userData.isProducer === true
            };
        } catch (error) {
            console.error('Error verifying user status:', error);
            return null;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const storedData = localStorage.getItem(USER_KEY) as string;
                const data = storedData ? JSON.parse(storedData) : null;
                const token = localStorage.getItem('jwt');

                // Define protected routes
                const authRoutes = ['/settings'];
                const producerRoutes = ['/add', '/analytics', '/profile'];

                const requiresAuth = authRoutes.some(route => pathname.startsWith(route));
                const requiresProducer = producerRoutes.some(route => pathname.startsWith(route));

                // Handle unauthenticated access to protected routes
                if (!data || !token) {
                    console.log('No auth data found:', { data, token });
                    setUser(null);
                    if (requiresAuth || requiresProducer) {
                        router.push('/auth');
                    }
                    return;
                }

                // Verify user status with server
                const verifiedUser = await verifyUserStatus(token);
                console.log('Verified user:', verifiedUser);

                if (!verifiedUser) {
                    console.log('User verification failed');
                    setUser(null);
                    localStorage.removeItem(USER_KEY);
                    localStorage.removeItem('jwt');
                    if (requiresAuth || requiresProducer) {
                        router.push('/auth');
                    }
                    return;
                }

                // Update user state with verified data
                const updatedUser = {
                    ...verifiedUser,
                    isProducer: verifiedUser.isProducer === true
                };

                console.log('Setting user state:', {
                    user: updatedUser,
                    isProducer: updatedUser.isProducer,
                    requiresProducer
                });

                // Handle producer-only route access
                if (requiresProducer && !updatedUser.isProducer) {
                    console.log('Non-producer accessing producer route');
                    router.push('/');
                    return;
                }

                localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                setUser(updatedUser);
                dispatch(getUser()); // Sync with Redux store

            } catch (error) {
                console.error('Auth check error:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router, dispatch]);

    const logout = () => {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('jwt');
        localStorage.removeItem(SONG_KEY);
        setUser(null);
        dispatch(LogoutUs());

        router.push('/');
    };

    const signInWithGoogle = async () => {
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
        const state = Math.random().toString(36).substring(2);
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20profile%20email&state=${state}`;
        window.location.href = googleAuthUrl;
    };

    const contextValue = useMemo(() => ({
        logout,
        signInWithGoogle,
        currentUser: user,
        isLoading
    }), [user, isLoading]);

    return <AuthContext.Provider value={contextValue} {...props} />;
};

Authentication.displayName = 'Authentication';
export default Authentication;

export const useAuthentication = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthentication must be used within an Authentication provider');
    }
    return context;
};
