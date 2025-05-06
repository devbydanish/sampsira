"use client"

import React from 'react'
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

    console.log('Sidebar rendering:', {
        currentUser,
        isProducer: currentUser?.isProducer,
        isLoading
    });

    const shouldShowAddMusicButton = currentUser?.isProducer === true;

    const filteredNavbar = NAVBAR.filter(nav => {
        if (!nav.producerOnly) {
            return true;
        }
        return currentUser?.isProducer === true;
    });

    const isActiveRoute = (href: string) => {
        if (href === "/") {
            return pathname === href;
        }
        return pathname.startsWith(href) && pathname !== "/";
    };

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
            >
                <nav.icon size={20} />
                <span className={replaceClassName('ms-3')}>{navbar(nav.name)}</span>
            </Link>
        );
    };

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
        );
    }

    return (
        <aside id='sidebar' data-sidebar={sidebarSkin}>
            <div className='sidebar-head d-flex align-items-center justify-content-between'>
                <Brand />
                <a
                    role='button'
                    className='sidebar-toggler'
                    aria-label='Sidebar toggler'
                    onClick={toggleSidebar}
                >
                    <div className='d-none d-lg-block'>
                        <RiMenuLine className='sidebar-menu-2' />
                    </div>
                    <RiMenuFoldLine className='d-lg-none' />
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
                    <Link href='/add' className='btn btn-primary d-flex'>
                        <div className='btn__wrap'>
                            <RiMusicFill />
                            <span>{navbar('add_music')}</span>
                        </div>
                    </Link>
                )}
            </div>
        </aside>
    );
};

Sidebar.displayName = 'Sidebar';
export default Sidebar;