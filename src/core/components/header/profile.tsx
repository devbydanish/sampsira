/**
 * @name Profile
 * @file profile.tsx
 * @description profile dropdown component for header
 */
"use client"


// Modules
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { RiLogoutCircleLine } from '@remixicon/react'

// Contexts
import { useAuthentication } from '@/core/contexts/authentication'
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { OPTIONS } from '@/core/constants/constant'
import { OPTIONS_USER } from '@/core/constants/constant'


import ProfileDropdown from './ProfileDropdown';

const Profile: React.FC = () => {

    const {currentUser, logout} = useAuthentication()
    const {replaceClassName} = useTheme()
    const locale = useTranslations()
    const user = useTranslations('user')


    return (
        <div className={replaceClassName('ms-3 ms-sm-4')}>
            {currentUser ? (
                <div className={replaceClassName('dropdown')}>
                    <a 
                        role='button' 
                        id='user_menu' 
                        className='avatar header-text' 
                        data-bs-toggle='dropdown' 
                        data-bs-offset='0,8'
                        aria-expanded='false'
                    >
                        <div className='avatar__image'>
                            <Image 
                                src={currentUser?.img ? process.env.NEXT_PUBLIC_STRAPI_URL + currentUser?.img?.url : '/images/users/default.png'}
                                width={128}
                                height={128}
                                alt='User'
                            />
                        </div>
                        <span className={replaceClassName('ps-2 d-none d-sm-block')}>{currentUser.name}</span>
                    </a>
                    <div 
                        className={replaceClassName('dropdown-menu dropdown-menu-md dropdown-menu-end profile-dropdown')} 
                        aria-labelledby='user_menu'
                    >
                        <div className='py-2 px-3 avatar avatar--lg'>
                            <div className='avatar__image'>
                                <Image 
                                    src={currentUser?.img ? process.env.NEXT_PUBLIC_STRAPI_URL + currentUser?.img?.url : '/images/users/default.png'}
                                    width={128}
                                    height={128}
                                    alt={currentUser.name}
                                />
                            </div>
                            <div className='avatar__content'>
                                <span className='avatar__title'>{currentUser.displayName}</span>
                                <span className='avatar__subtitle'>{currentUser.username}</span>
                            </div>
                        </div>
                        <div className='dropdown-divider'></div>
                        {(currentUser.isProducer ? OPTIONS : OPTIONS_USER).map((option, index) => (
                            <Link 
                                href={option.href}
                                key={index}
                                className='dropdown-item d-flex align-items-center'
                            >
                                {<option.icon size={20} />}
                                <span className={replaceClassName('ms-2')}>{option.name}</span>
                            </Link>
                        ))}
                        <a 
                            role='button'
                            className='dropdown-item d-flex align-items-center text-danger'
                            onClick={logout}
                        >
                            <RiLogoutCircleLine size={20} />
                            <span className={replaceClassName('ps-2')}>{locale('logout')}</span>
                        </a>
                    </div>
                </div>
            ) : (
                <Link
                    href="/auth/login"
                    id='user_menu'
                    className='header-text btn btn-sm btn-secondary'
                >
                    <span className={replaceClassName('')} style={{ textTransform: 'capitalize' }}>
                        {locale('login')}
                    </span>
                </Link>
            )}
        </div>

    )
}


Profile.displayName = 'Profile'
export default Profile