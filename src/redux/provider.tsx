"use client"

import { Provider } from 'react-redux'
import { store } from './store'
import { useEffect } from 'react'
import { getUser } from './features/userSlice'
import { useAppDispatch } from './hooks'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Initialize user data and token from localStorage
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser());
    }
  }, [dispatch]);

  return <Provider store={store}>{children}</Provider>
}