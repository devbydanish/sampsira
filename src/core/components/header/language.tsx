/**
 * @name Language
 * @file language.tsx
 * @description language dropdown component for header
 */
"use client"


// Modules
import React from 'react'
import { RiEarthLine } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { LANGUAGES } from '@/core/constants/constant'


const Language: React.FC = () => {

    const {replaceClassName} = useTheme()


    return (
        <div className='dropdown'>
            <a 
                role='button' 
                id='language_menu' 
                className='header-text d-flex align-items-center' 
                data-bs-toggle='dropdown' 
                data-bs-auto-close='outside' 
                data-bs-offset='0,14'
                aria-expanded='false'
            >
                {/* <RiEarthLine size={20} />
                <span className={replaceClassName('d-none d-md-block ms-1')}>Language</span> */}
            </a>
            <div 
                className={replaceClassName('dropdown-menu dropdown-menu-lg dropdown-menu-end lang-dropdown')} 
                aria-labelledby='language_menu'
            >
                <div className='py-2 px-4'>
                    <span className='d-block fw-semibold mb-1 text-dark'>What music do you like?</span>
                    <p>Select languages you want to listen.</p>
                </div>
                <div className='dropdown-divider'></div>
                <div className='d-flex flex-wrap py-2'>
                    {LANGUAGES.map(lang => (
                        <div key={lang.id} className='py-2 px-4 w-50'>
                            <div className='form-check mb-0'>
                                <input 
                                    className='form-check-input' 
                                    type='checkbox' 
                                    id={'lang_' + lang.id}
                                />
                                <label 
                                    className='form-check-label fw-medium' 
                                    htmlFor={'lang_' + lang.id}
                                >
                                    {lang.name}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='dropdown-divider'></div>
                <div className='py-2 px-4'>
                    <button 
                        type='button' 
                        className='btn btn-primary w-100 justify-content-center'
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}


Language.displayName = 'Language'
export default Language