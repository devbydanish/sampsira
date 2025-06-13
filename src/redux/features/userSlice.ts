import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { clearData } from './dataSlice';

interface User {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    subscribedTill: string;
    loginAttempts?: number;
    lockUntil?: string;
    isProducer: boolean;
    producerName?: string;
    cover?: string;
    bio?: string;
    role?: {
        type: 'Producer' | 'Admin' | 'User';
    };
    socialAccounts?: {
        instagram?: { username: string; connected: boolean };
        youtube?: { username: string; connected: boolean };
        tiktok?: { username: string; connected: boolean };
    };
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    subscriptionActive: boolean;
    loading: boolean;
    error: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    regStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    registerError: string | null;
    message: string;
    token: string;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    subscriptionActive: false,
    loading: false,
    error: null,
    status: 'idle',
    regStatus: 'idle',
    registerError: null,
    message: '',
    token: ''
};

// Register User
export const registerUser = createAsyncThunk(
    "registerUser",
    async (userData: any, thunkAPI) => {
        try {
            console.log('Registering user with data:', userData);
            
            // Register the user with Strapi
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
                {
                    username: userData.username,
                    displayName: userData.firstName + ' ' + userData.lastName,
                    email: userData.email,
                    password: userData.password,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    city: userData.city || '',
                    state: userData.state || '',
                    isProducer: false,
                }
            );

            return { message: "Registration successful. Please check your email to verify your account." };
        } catch (error: any) {
            console.error('Registration error:', error?.response?.data || error);
            return thunkAPI.rejectWithValue(error?.response?.data || { error: 'Registration failed' });
        }
    }
);

// Register Producer
export const registerProducer = createAsyncThunk(
    "registerProducer",
    async (userData: any, thunkAPI) => {
        try {
            console.log('Registering producer with data:', userData);
            
            // Register the producer with Strapi
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
                {
                    username: userData.username,
                    email: userData.email,
                    password: userData.password,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    city: userData.city || '',
                    state: userData.state || '',
                    isProducer: true,
                    displayName: userData.producerName || '',
                }
            );

            return { message: "Registration successful. Please check your email to verify your account." };
        } catch (error: any) {
            console.error('Producer registration error:', error?.response?.data || error);
            return thunkAPI.rejectWithValue(error?.response?.data || { error: 'Producer registration failed' });
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    "forgotPassword",
    async ({ email }: { email: string }, thunkAPI) => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/forgot-password`,
                { email }
            );
            
            return { message: "Password reset link sent to your email" };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data || { error: 'Failed to send password reset email' });
        }
    }
);

export const loginUser = createAsyncThunk(
    "loginUser",
    async (params: { email: string; password: string }, thunkAPI) => {
        try {
            console.log('Attempting login for:', params.email);
            
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
                {
                    identifier: params.email,
                    password: params.password,
                }
            );

            const { data: { user: initialUser, jwt } } = response;
            console.log('Initial user data:', initialUser);

            const userResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );

            const userData = userResponse.data;
            console.log('Full user data:', userData);

            const user = {
                ...userData,
                isProducer: userData.isProducer,
                id: userData.id,
                email: userData.email,
                username: userData.username,
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                subscribedTill: userData.subscribedTill,
                cover: userData.cover || null,
                role: userData.role
            };

            console.log('Processed user data:', {
                user,
                isProducer: user.isProducer,
                role: user.role
            });

            return { user, jwt };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "logoutUser",
    async (_, { dispatch }) => {
        localStorage.removeItem("user");
        localStorage.removeItem("jwt");
        dispatch(clearData());
        return true;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        getUser: (state: AuthState) => {
            const userDataString = localStorage.getItem("user");
            const token = localStorage.getItem("jwt");
            
            if (userDataString && token) {
                try {
                    const userData = JSON.parse(userDataString);
                    console.log('Retrieved user data:', userData);
                    
                    state.isAuthenticated = true;
                    state.user = userData;
                    state.token = token;
                    state.subscriptionActive = new Date(userData.subscribedTill) > new Date();
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    state.user = null;
                    state.isAuthenticated = false;
                    state.token = '';
                }
            } else {
                // Clear state if either user data or token is missing
                state.user = null;
                state.isAuthenticated = false;
                state.token = '';
                state.subscriptionActive = false;
            }
        },
        resetError: (state: AuthState) => {
            state.error = null;
            state.message = "";
            state.registerError = null;
        },
        setEmailVerified: (state: AuthState) => {
            state.message = "Your email has been verified. You can now log in.";
        },
        LoginUs: (state: AuthState) => {
            state.isAuthenticated = true;
        },
        LogoutUs: (state: AuthState) => {
            localStorage.removeItem("user");
            localStorage.removeItem("jwt");
            state.isAuthenticated = false;
            state.user = null;
            state.token = "";
            state.subscriptionActive = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.token = action.payload.jwt;
                state.isAuthenticated = true;
                state.subscriptionActive = new Date(action.payload.user.subscribedTill) > new Date();
                state.error = null;
                
                // Store complete user data and token
                localStorage.setItem("user", JSON.stringify(action.payload.user));
                localStorage.setItem("jwt", action.payload.jwt);
                
                state.status = "idle";
            })
            .addCase(loginUser.rejected, (state, action: any) => {
                state.status = "failed";
                state.error = action.payload?.error?.message || 
                            action.payload?.message || 
                            'Login failed';
                state.isAuthenticated = false;
                state.user = null;
                state.token = "";
            })
            
            // Register user cases
            .addCase(registerUser.pending, (state) => {
                state.regStatus = "loading";
                state.registerError = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.regStatus = "succeeded";
                state.message = action.payload.message;
                state.registerError = null;
                state.regStatus = "idle";
            })
            .addCase(registerUser.rejected, (state, action: any) => {
                state.regStatus = "failed";
                state.registerError = action.payload?.error?.message || 
                                  action.payload?.message || 
                                  'Registration failed';
            })
            
            // Register producer cases
            .addCase(registerProducer.pending, (state) => {
                state.regStatus = "loading";
                state.registerError = null;
            })
            .addCase(registerProducer.fulfilled, (state, action) => {
                state.regStatus = "succeeded";
                state.message = action.payload.message;
                state.registerError = null;
            })
            .addCase(registerProducer.rejected, (state, action: any) => {
                state.regStatus = "failed";
                state.registerError = action.payload?.error?.message || 
                                  action.payload?.message || 
                                  'Producer registration failed';
            })
            
            // Forgot password cases
            .addCase(forgotPassword.pending, (state) => {
                state.status = "loading";
                state.error = null;
                state.message = "";
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action: any) => {
                state.status = "failed";
                state.error = action.payload?.error?.message || 
                          action.payload?.message || 
                          'Failed to send password reset email';
            });
    },
});

export const { getUser, resetError, setEmailVerified, LoginUs, LogoutUs } = userSlice.actions;

// Helper function for logout that dispatches both actions
export const logout = () => (dispatch: any) => {
    dispatch(LogoutUs());
    dispatch(clearData());
};

export default userSlice.reducer;