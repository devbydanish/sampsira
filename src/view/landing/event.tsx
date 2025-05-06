/**
 * @name Event
 * @file event.tsx
 * @description music landing page event section component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

// Components
import Carousel from '@/core/components/carousel'
import EventCard from '@/core/components/card/event'

// Utilities
import { title } from '@/core/utils'
import { EventTypes } from '@/core/types'

interface Props {
    events: EventTypes[]
}

const propTypes = {
    /**
     * Set event data
     */
    events: PropTypes.array.isRequired
}


const Event: React.FC<Props> = ({events}) => {
    
    const homePage = useTranslations('home_page')


    return (
        // Main section [[ Find at scss/framework/section.scss ]]
        <section className='main-section bg-light'>
            <div className='container'>
                <div className='d-sm-flex align-items-center justify-content-between text-center mb-5'>
                    <h2 
                        className='mb-4 mb-sm-0'
                        dangerouslySetInnerHTML={{__html: title(homePage, 'event_title')}}
                    />
                    <Link className='btn btn-outline-primary' href='/music/event'>{homePage('event_button')}</Link>
                </div>
                <Carousel 
                    Component={EventCard}
                    slideView={3}
                    gap={32}
                    data={events} 
                    pagination 
                    autoplay
                />
            </div>
        </section>
    )
}


Event.propTypes = propTypes as any
Event.displayName = 'Event'

export default Event