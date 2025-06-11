/**
 * @file auth.ts
 * @description Authentication utility functions
 */

let cachedToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    cachedToken = token;
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem('jwt', token);
        } else {
            localStorage.removeItem('jwt');
        }
    }
};

export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') {
        return cachedToken;
    }
    console.log("1")
    
    if (!cachedToken) {
        cachedToken = localStorage.getItem('jwt');
    }
    
    return cachedToken;
};

export const clearAuthToken = () => {
    cachedToken = null;
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
    }
}; 