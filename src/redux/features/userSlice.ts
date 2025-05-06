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
            });
    },
});

export const { getUser, resetError, LoginUs, LogoutUs } = userSlice.actions;

// Helper function for logout that dispatches both actions
export const logout = () => (dispatch: any) => {
    dispatch(LogoutUs());
    dispatch(clearData());
};

export default userSlice.reducer;