/**
 * @name MainHeader
 * @file main.tsx
 * @description music main pages header component
 */
"use client"


// Modules
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { RiMenu3Fill } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Components
import Brand from '../brand'

// Utilities
import { addClass, removeClass } from '@/core/utils'
import { NAVBAR_LINK, USER_KEY } from '@/core/constants/constant'
import { NavLinkTypes } from '@/core/types'


const MainHeader: React.FC = () => {

    const pathname = usePathname()
    const locale = useTranslations()
    const header = useTranslations('header')
    const {replaceClassName} = useTheme()
    const navRef = useRef<HTMLDivElement | null>(null)
    const btnRef = useRef<HTMLButtonElement | null>(null)

    // Change `music` link to `login` is user not exist
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem(USER_KEY) as string)
        
        if (navRef.current) {
            const links = document.querySelectorAll('.nav-link')
            links.forEach(link => {
                const href = link.getAttribute('href')
                if (href === '/music' || href === '/auth/login') {
                    link.setAttribute('href', !user 
                        ? '/auth/login' : href as string)
                }
            })
        }
        
    }, [navRef.current])

    // Collapse menu in mobile
    useEffect(() => {
        const btn = btnRef.current
        const nav = navRef.current
        if (btn && nav) {
            addClass(btn, 'collapsed')
            btn.setAttribute('aria-expanded', 'false')
            removeClass(nav, 'show')
        }
    }, [pathname])


    /**
     * 
     * Navbar link view
     * @param nav 
     * @returns 
     */
    const navLink = (nav: NavLinkTypes) => {
        return (
            <li key={nav.name} className='nav-item'>
                <Link 
                    className='nav-link' 
                    href={nav.href + (
                        nav.fragment 
                        ? `#${nav.fragment}` 
                        : ''
                    )}
                >
                    {header(nav.name)}
                </Link>
            </li>
        )
    }
    

    return (
        // header [[ Find at scss/framework/header.scss ]]
        <header id='main_header'>
            <div className='container'>
                <nav className='navbar navbar-expand-lg'>
                    <Brand />
                    <div className='d-flex align-items-center navbar-ex'>
                        <Link className='btn btn-primary' href='/auth'>{locale('try_it_free')}</Link>
                        <button 
                            ref={btnRef}
                            className={replaceClassName('navbar-toggler ms-3 ms-sm-4')} 
                            type='button' 
                            data-bs-toggle='collapse' 
                            data-bs-target='#top_navbar' 
                            aria-controls='top_navbar' 
                            aria-expanded='false' 
                            aria-label='Toggle navigation'
                        >
                            <RiMenu3Fill />
                        </button>
                    </div>
                    <div 
                        ref={navRef} 
                        className='collapse navbar-collapse' 
                        id='top_navbar'
                    >
                        <ul className='navbar-nav mt-4 mt-lg-0 mx-auto fw-semibold'>
                            {NAVBAR_LINK.map(nav => navLink(nav))}
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    )
}


MainHeader.displayName = 'MainHeader'
export default MainHeader