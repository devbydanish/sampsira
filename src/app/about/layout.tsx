import React from 'react'
import { metadata } from './metadata'

export { metadata }

export default function AboutLayout({
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