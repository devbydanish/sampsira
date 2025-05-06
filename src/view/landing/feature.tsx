/**
 * @name Feature
 * @file feature.tsx
 * @description music landing page hero section component
 */
"use client"


// Modules
import React from 'react'
import { 
    RiCalendarEventFill, 
    RiDonutChartFill, 
    RiMusic2Fill, 
    RiQuestionAnswerFill, 
    RiRadioFill, 
    RiUser4Fill, 
    RiVipCrownFill 
} from '@remixicon/react'
import { useTranslations } from 'next-intl'

// Utilities
import { BRAND } from '@/core/constants/constant'


const Feature: React.FC = () => {

    const homePage = useTranslations('home_page')


    return (
        // Main section [[ Find at scss/framework/section.scss ]]
        <section className='main-section'>
            <div className='container'>
                <div className='col-xl-6 col-lg-8 mx-auto text-center fs-5 mb-5'>
                    <h2>
                        {homePage('feature_title') + ' '} 
                        <span className='text-primary'>{BRAND.name}</span>
                    </h2>
                    <p>{homePage('feature_description')}</p>
                </div>
                
                {/* Feature [[ Find at scss/base/core.scss ]] */}
                <div className='feature'>
                    <div className='row g-4 g-md-5'>
                        <div className='col-xl-3 col-lg-4 col-sm-6'>
                            <div className='card h-100 py-2'>
                                <div className='card-body'>
                                    <div className='feature__icon' style={{color: 'var(--bs-blue)'}}>
                                        <RiMusic2Fill />
                                    </div>
                                    <h3 className='h5 mt-4 mb-3'>{homePage('feature_1_title')}</h3>
                                    <p>{homePage('feature_1_description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-lg-4 col-sm-6'>
                            <div className='card h-100 py-2'>
                                <div className='card-body'>
                                    <div className='feature__icon' style={{color: 'var(--bs-pink)'}}>
                                        <RiQuestionAnswerFill />
                                    </div>
                                    <h3 className='h5 mt-4 mb-3'>{homePage('feature_2_title')}</h3>
                                    <p>{homePage('feature_2_description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-lg-4 col-sm-6'>
                            <div className='card h-100 py-2'>
                                <div className='card-body'>
                                    <div className='feature__icon' style={{color: 'var(--bs-purple)'}}>
                                        <RiCalendarEventFill />
                                    </div>
                                    <h3 className='h5 mt-4 mb-3'>{homePage('feature_3_title')}</h3>
                                    <p>{homePage('feature_3_description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-lg-4 col-sm-6'>
                            <div className='card h-100 py-2'>
                                <div className='card-body'>
                                    <div className='feature__icon' style={{color: 'var(--bs-indigo)'}}>
                                        <RiDonutChartFill />
                                    </div>
                                    <h3 className='h5 mt-4 mb-3'>{homePage('feature_4_title')}</h3>
                                    <p>{homePage('feature_4_description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-lg-4 col-sm-6'>
                            <div className='card h-100 py-2'>
                                <div className='card-body'>
                                    <div className='feature__icon' style={{color: 'var(--bs-red)'}}>
                                        <RiRadioFill />
                                    </div>
                                    <h3 className='h5 mt-4 mb-3'>{homePage('feature_5_title')}</h3>
                                    <p>{homePage('feature_5_description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-lg-4 col-sm-6'>
                            <div className='card h-100 py-2'>
                                <div className='card-body'>
                                    <div className='feature__icon' style={{color: 'var(--bs-orange)'}}>
                                        <RiVipCrownFill />
                                    </div>
                                    <h3 className='h5 mt-4 mb-3'>{homePage('feature_6_title')}</h3>
                                    <p>{homePage('feature_6_description')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3 col-lg-4 col-sm-6'>
                            <div className='card h-100 py-2'>
                                <div className='card-body'>
                                    <div className='feature__icon' style={{color: 'var(--bs-green)'}}>
                                        <RiUser4Fill />
                                    </div>
                                    <h3 className='h5 mt-4 mb-3'>{homePage('feature_7_title')}</h3>
                                    <p>{homePage('feature_7_description')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


Feature.displayName = 'Feature'
export default Feature