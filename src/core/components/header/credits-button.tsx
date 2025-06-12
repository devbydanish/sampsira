"use client"

import React from 'react'
import Link from 'next/link'
import { useTheme } from '@/core/contexts/theme'
import { useAuthentication } from '@/core/contexts/authentication'
import { getTotalCredits } from '@/utils/credit-helpers'

const CreditsButton: React.FC = () => {
    const { replaceClassName } = useTheme()
    const { currentUser } = useAuthentication()

    if (!currentUser) {
        return null
    }

    // Calculate total credits using the helper function
    const totalCredits = getTotalCredits(currentUser)

    return (
        <Link 
            href="/plan" 
            className={replaceClassName('header-text btn btn-sm btn-secondary')}
            style={{ backgroundColor: 'transparent' }}
        >
            <span className={replaceClassName('')}>
                {totalCredits} Credits
            </span>
        </Link>
    )
}

CreditsButton.displayName = 'CreditsButton'
export default CreditsButton