/**
 * @name Plan
 * @file plan.tsx
 * @description music landing page plan section component
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


const Plan: React.FC<Props> = ({children}) => {

    const homePage = useTranslations('home_page')


    return (
        // Main section [[ Find at scss/framework/section.scss ]]
        <section id='pricing' className='main-section'>
            <div className='container'>
                <div className='text-center mb-5'>
                    <h2 
                        className='mb-4 mb-sm-0' 
                        dangerouslySetInnerHTML={{__html: title(homePage, 'plan_title')}} 
                    />
                </div>
                <div className='col-xl-11 col-lg-8 mx-auto pt-4'>
                    {children}
                </div>
            </div>
        </section>
    )
}


Plan.displayName = 'Plan'
export default Plan