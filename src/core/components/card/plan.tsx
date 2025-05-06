/**
 * @name PlanCard
 * @file plan.tsx
 * @description plan card component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { title } from '@/core/utils'

interface Props {
    register?: boolean
    showLink?: boolean
}

const propTypes = {
    /**
     * Set plan registered
     */
    register: PropTypes.bool,

    /**
     * Set register/choose plan link
     */
    showLink: PropTypes.bool
}


const PlanCard: React.FC<Props> = ({register, showLink}) => {

    const {rtl, replaceClassName} = useTheme()
    const locale = useTranslations()
    const pricing = useTranslations('pricing')

    const ArrowIcon = rtl ? RiArrowLeftLine : RiArrowRightLine
    const href = register ? '/auth/register' : '/music/plan'


    return (
        <div className='card plan__info overflow-hidden'>
            <div className='card-body d-flex flex-column p-0'>
                <div className='p-4'>
                    <h3 
                        className='h4 mb-3' 
                        dangerouslySetInnerHTML={{__html: register 
                            ? title(pricing, 'plan_1_title')
                            : title(pricing, 'plan_2_title')
                        }}
                    />
                    <p 
                        className='fs-6'
                        dangerouslySetInnerHTML={{__html: register 
                            ? (pricing.markup('plan_1_description', {
                                bold: (chunks: any) => `<b>${chunks}</b>`
                            }))
                            : (pricing.markup('plan_2_description', {
                                bold: (chunks: any) => `<b>${chunks}</b>`
                            }))
                        }}
                    />
                    {showLink && (
                        <Link
                            href={href}
                            className='d-inline-flex align-items-center'
                        >
                            <span className={replaceClassName('me-1')}>
                                {register 
                                    ? (locale('register_now')) 
                                    : (pricing('choose_plan'))
                                }
                            </span>
                            <ArrowIcon size={16} />
                        </Link>
                    )}
                </div>
                <div className='px-3 text-center mt-auto'>
                    <Image 
                        src='/images/misc/plan.png'
                        width={320}
                        height={374}
                        alt='Plan image'
                        className='img-fluid'
                    />
                </div>
            </div>
        </div>
    )
}


PlanCard.propTypes = propTypes as any
PlanCard.displayName = 'PlanCard'

export default PlanCard