import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import dataReducer from './features/dataSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    data: dataReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to avoid serialization warning
        ignoredActions: ['verifyOtp/fulfilled', 'verifyOtp/rejected', 'generateOtp/fulfilled', 'generateOtp/rejected'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;