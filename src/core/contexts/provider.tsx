"use client"

import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { Provider as ReduxProvider } from 'react-redux'
import { SnackbarProvider } from 'notistack'

// Providers
import Authentication from './authentication'
import PlayerProvider from './player'

// Store
import { store } from '@/redux/store'

interface Props {
    children: ReactNode
}

export default function Provider({ children }: Props) {
    return (
        <ReduxProvider store={store}>
            <SnackbarProvider>
                <Authentication>
                    <PlayerProvider>
                        <Toaster />
                        {children}
                    </PlayerProvider>
                </Authentication>
            </SnackbarProvider>
        </ReduxProvider>
    )
}