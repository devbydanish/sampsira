/**
 * @name Producer
 * @file producer.tsx
 * @description music landing page producer section component
 */
"use client"


// Modules
import React from 'react'
import { useTranslations } from 'next-intl'

// Utilities
import { title } from '@/core/utils'

interface Props {
    children: React.ReactElement
}


const Producer: React.FC<Props> = ({children}) => {

    const homePage = useTranslations('home_page')


    return (
        // main section [[ Find at scss/framework/section.scss ]]
        <section className='main-section bg-light'>
            <div className='container'>
                <div className='col-xl-6 col-lg-8 mx-auto text-center fs-5 mb-5'>
                    <h2 dangerouslySetInnerHTML={{__html: title(homePage, 'Producers_title')}} />
                    <p>{homePage('Producers_description')}</p>
                </div>
                {children}
            </div>
        </section>
    )
}


Producer.displayName = 'Producer'
export default Producer