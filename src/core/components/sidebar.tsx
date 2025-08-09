"use client"

import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
    RiMenuLine,
    RiMenuFoldLine,
    RiMusicFill
} from '@remixicon/react'

import { useTheme } from '../contexts/theme'
import { useAuthentication } from '../contexts/authentication'
import Brand from './brand'
import Scrollbar from './scrollbar'
import { toggleSidebar } from '../utils'
import { NAVBAR } from '../constants/constant'

const Sidebar: React.FC = () => {
    const pathname = usePathname()
    const { replaceClassName, sidebarSkin } = useTheme()
    const { currentUser, isLoading } = useAuthentication()
    const navbar = useTranslations('sidebar')
    const sidebarRef = useRef<HTMLDivElement>(null)

    const shouldShowAddMusicButton = currentUser?.isProducer === true

    const filteredNavbar = NAVBAR.filter(nav => {
        if (!nav.producerOnly) {
            return true
        }
        return currentUser?.isProducer === true
    })

    const isActiveRoute = (href: string) => {
        if (href === "/") {
            return pathname === href
        }
        return pathname.startsWith(href) && pathname !== "/"
    }

    // Close sidebar on mobile
    const closeSidebar = () => {
        if (typeof window !== "undefined" && window.innerWidth < 992) {
            document.body.classList.remove('sidebar-open')
        }
    }

    // Handle clicks outside the sidebar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                closeSidebar()
            }
        }

        // Only add listener for mobile view
        if (typeof window !== "undefined" && window.innerWidth < 992) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const navLink = (nav: any) => {
        return nav.title ? (
            <span className='nav-item--head__dots'>...</span>
        ) : (
            <Link
                href={nav.href}
                className={classNames(
                    'nav-link d-flex align-items-center',
                    isActiveRoute(nav.href) && 'active'
                )}
                onClick={closeSidebar} // Close sidebar when link is clicked
            >
                <nav.icon size={20} />
                <span className={replaceClassName('ms-3')}>{navbar(nav.name)}</span>
            </Link>
        )
    }

    if (isLoading) {
        return (
            <aside id='sidebar' data-sidebar={sidebarSkin}>
                <div className='sidebar-head'>
                    <Brand />
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </aside>
        )
    }

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className="sidebar-overlay d-lg-none" 
                style={{
                    display: document.body.classList.contains('sidebar-open') ? 'block' : 'none'
                }}
            />
            
            {/* Sidebar */}
            <div ref={sidebarRef}>
                <aside id='sidebar' data-sidebar={sidebarSkin}>
                    <div className='sidebar-head d-flex align-items-center justify-content-between' style={{ position: 'relative' }}>
                        <Brand />
                        <a
                            role='button'
                            className='sidebar-toggler d-lg-none'
                            aria-label='Sidebar close'
                            onClick={toggleSidebar}
                            style={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                zIndex: 2,
                                background: 'transparent',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer'
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </a>
                    </div>

                    <Scrollbar className='sidebar-body'>
                        <nav className='navbar d-block p-0'>
                            <ul className='navbar-nav'>
                                {filteredNavbar.map((nav: any, index) => (
                                    <li
                                        key={index}
                                        className={classNames(
                                            'nav-item',
                                            nav.title && 'nav-item--head'
                                        )}
                                    >
                                        {navLink(nav)}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Scrollbar>

                    <div className='sidebar-foot'>
                        {shouldShowAddMusicButton && (
                            <Link 
                                href='/add' 
                                className='btn btn-primary d-flex'
                                onClick={closeSidebar} // Close sidebar when button is clicked
                            >
                                <div className='btn__wrap'>
                                    <RiMusicFill />
                                    <span>{navbar('add_music')}</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </aside>
            </div>
        </>
    )
}

Sidebar.displayName = 'Sidebar'
export default Sidebar