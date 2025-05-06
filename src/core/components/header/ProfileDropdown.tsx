/**
 * @name ProfileDropdown
 * @file ProfileDropdown.tsx
 * @description profile dropdown component for header when user is logged in
 */
"use client"


// Modules
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { RiLogoutCircleLine } from '@remixicon/react'

// Contexts
import { useAuthentication } from '@/core/contexts/authentication'
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { OPTIONS } from '@/core/constants/constant'
import { capitalize } from '@/core/utils'
import type { CurrentUserTypes } from '../../types'

const ProfileDropdown: React.FC = () => {
    const { currentUser, logout } = useAuthentication()
    const { replaceClassName } = useTheme()
    const locale = useTranslations()
    const user = useTranslations('user')
    const sidebarLocale = useTranslations('sidebar')

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Strict boolean check for producer status
    const shouldShowProducerLinks = currentUser?.isProducer === true;

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={replaceClassName('ms-3 ms-sm-4')} ref={dropdownRef}>
            {currentUser ? (
                <button
                    onClick={toggleDropdown}
                    id='user_menu'
                    className='avatar header-text'
                >
                    <div className='avatar__image'>
                        <Image
                            src={currentUser.cover || "/images/users/default.png"}
                            width={128}
                            height={128}
                            alt={currentUser.username || 'User'}
                        />
                    </div>
                </button>
            ) : (
                <Link href="/auth/login" className="btn header-text">
                    {locale('login')}
                </Link>
            )}

            <ul className={replaceClassName(`dropdown-menu dropdown-menu-end ${isOpen ? 'show' : ''}`)} aria-labelledby="user_menu">
    {shouldShowProducerLinks && (
        <>
            <li>
                <Link href="/music/profile" className={replaceClassName("dropdown-item")}>
                    {user('profile')}
                </Link>
            </li>
            <li>
                <Link href="/music/analytics" className={replaceClassName("dropdown-item")}>
                    {sidebarLocale('analytics')}
                </Link>
            </li>
            <li><hr className={replaceClassName("dropdown-divider")} /></li>
        </>
    )}
    <li>
        <Link href="/music/settings" className={replaceClassName("dropdown-item")}>
            {user('settings')}
        </Link>
    </li>
    <li>
        <Link href="/music/plan" className={replaceClassName("dropdown-item")}>
            {user('plan')}
        </Link>
    </li>
    <li><hr className={replaceClassName("dropdown-divider")} /></li>
    <li>
        <button className={replaceClassName("dropdown-item")} onClick={logout}>
            <RiLogoutCircleLine className={replaceClassName('me-1 align-middle')} />
            {locale('logout')}
        </button>
    </li>
</ul>
        </div>
    )
}

ProfileDropdown.displayName = 'ProfileDropdown'
export default ProfileDropdown
