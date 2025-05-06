/**
 * @name Hero
 * @file hero.tsx
 * @description music landing page hero section component
 */
"use client"


// Modules
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { title } from '@/core/utils'


const Hero: React.FC = () => {

    const {replaceClassName} = useTheme()
    const locale = useTranslations()
    const homePage = useTranslations('home_page')

    return (
        <section className='container-fluid px-xl-4'>
            {/* Main hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='main-hero mx-auto'>
                <div className='container'>
                    <div className='col-xl-6 col-lg-8 col-md-9 fs-5'>
                        <h1 
                            className='main-hero__title mb-3' 
                            dangerouslySetInnerHTML={{__html: title(homePage, 'hero_title')}} 
                        />
                        <div className={replaceClassName('me-sm-5')}>
                            <p>{homePage('hero_description')}</p>
                            <div className='d-flex gap-2'>
                                <Link 
                                    className='btn btn-lg btn-white flex-sm-grow-0 flex-grow-1' 
                                    href='/auth/register'
                                >
                                    {locale('try_it_free')}
                                </Link>
                                <Link 
                                    className='btn btn-lg btn-outline-dark flex-sm-grow-0 flex-grow-1' 
                                    href='/music'
                                >
                                    {locale('header.discover')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


Hero.displayName = 'Hero'
export default Hero