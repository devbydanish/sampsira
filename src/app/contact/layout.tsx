import React from 'react'
import { metadata } from './metadata'

export { metadata }

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="main">
            {children}
        </main>
    )
}