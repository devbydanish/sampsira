/**
 * @name DownloadApp
 * @file download-app.tsx
 * @description download app button component
 */
"use client"


// Modules
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { APP } from '@/core/constants/constant'

interface Props {
    button?: 'default' | 'primary'
}


const DownloadApp: React.FC<Props> = ({button = 'default'}) => {

    const {replaceClassName} = useTheme()
    const locale = useTranslations()


    return (
        APP.length && (
            <div className='app-btn-group'>
                {APP.map((item, index) => 
                    <Link 
                        key={index}
                        href={item.href} 
                        className={'btn btn-lg btn-' + button}
                    >
                        <span className='btn__wrap'>
                            <item.icon />
                            <span className={replaceClassName('ms-2')}>
                                {locale(item.name)}
                            </span>
                        </span>
                    </Link>
                )}
            </div>
        )
    )
}


DownloadApp.displayName = 'DownloadApp'
export default DownloadApp