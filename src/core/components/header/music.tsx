/**
 * @name MusicHeader
 * @file music.tsx
 * @description music pages header component
 */
"use client"


// Modules
import React from 'react'
import { RiMenu3Line } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Components
import Search from './search'
import Language from './language'
import Profile from './profile'
import CreditsButton from './credits-button'

// Utilities
import { toggleSidebar } from '@/core/utils'


const MusicHeader: React.FC = () => {

    const {replaceClassName, headerSkin} = useTheme()

    
    return (
        // Header [[ Find at scss/framework/header.scss ]]
        <header id='header'>
            <div className='container'>
                <div className='header-container'>
                    <div className='d-flex align-items-center'>
                        <a 
                            role='button' 
                            className={replaceClassName(
                                'header-text sidebar-toggler d-lg-none me-3'
                            )} 
                            aria-label='Sidebar toggler'
                            onClick={toggleSidebar}
                        >
                            <RiMenu3Line />
                        </a>
                        <Search />
                        <div className='d-flex align-items-center'>
                            <CreditsButton />
                            <Language />
                            <Profile />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}


MusicHeader.displayName = 'MusicHeader'
export default MusicHeader