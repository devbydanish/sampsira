/**
 * @name MainFooter
 * @file main.tsx
 * @description music main pages footer component
 */
"use client"


// Modules
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import moment from 'moment'

// Components
import DownloadApp from './download-app'

// Utilities
import { title } from '@/core/utils'
import { BRAND, SOCIAL } from '@/core/constants/constant'


const MainFooter: React.FC = () => {

    const year = moment().year()
    const locale = useTranslations()
    const footer = useTranslations('footer')

    
    return (
        <>
            <section className='container'>
                {/* Newsletter [[ Find at scss/base/core.scss ]] */}
                <div className='newsletter text-white'>
                    <div className='col-xl-7 col-lg-10 fs-5 mx-auto text-center'>
                        <h2 className='text-white'>
                            {footer('title') + ' '} 
                            <span className='newsletter__title-text'>{BRAND.name}</span>
                        </h2>
                        <p>{footer('description')}</p>
                        <Link href='/auth/register' className='btn btn-lg btn-white mt-3'>
                            {locale('register_now')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer [[ Find at scss/framework/footer.scss ]] */}
            <footer id='main_footer'>
                <div className='container'>
                    <div className='col-xl-6 col-lg-8 col-md-10 mx-auto text-center'>
                        <h3 
                            className='mb-5'
                            dangerouslySetInnerHTML={{__html: title(footer, 'subtitle')}}
                        />
                        <DownloadApp />
                    </div>
                    <div className='last-footer py-4'>
                        <span>&copy; {year} {BRAND.name}. {footer('copy')}</span>
                        <ul className='social'>
                            {SOCIAL.map((item, index) => 
                                <li key={index}>
                                    <Link 
                                        href={item.href} 
                                        target='_blank'
                                        aria-label={item.name}
                                    >
                                        <item.icon size={16} />
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}


MainFooter.displayName = 'MainFooter'
export default MainFooter