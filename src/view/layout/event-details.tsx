/**
 * @name EventDetails
 * @file event-details.tsx
 * @description event details page component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { 
    RiAddCircleLine, 
    RiMailOpenFill, 
    RiMapPin2Fill, 
    RiPhoneFill 
} from '@remixicon/react'

// Components
import AvatarGroup from '@/core/components/avatar-group'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { EventTypes } from '@/core/types'

interface Props {
    event: EventTypes
}

const propTypes = {
    /**
     * Set event data
     */
    event: PropTypes.object.isRequired

}


const EventDetails: React.FC<Props> = ({event}) => {

    const {replaceClassName} = useTheme()
    const locale = useTranslations()
    

    return (
        <>
            {/* Hero [[ Find at scss/framework/hero.scss ]] */}
			<div 
                className='hero' 
                style={{backgroundImage: 'url(/images/banner/event.jpg)'}}
            />
            
            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='under-hero container'>
                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='col-xl-8 px-sm-4 px-md-5 px-xl-0 mx-auto mb-5'>
                        <h1>{event.title}</h1>
                        {/* Info list [[ Find at scss/components/list.scss ]] */}
                        <ul className='info-list info-list--dotted mt-3'>
                            <li>
                                <AvatarGroup data={event} />
                            </li>
                            {event.seats && (
                                <li>{event.seats} seats only</li>
                            )}
                            <li className='fw-semibold'>{event.date}</li>
                        </ul>

                        <button 
                            type='button' 
                            className='btn btn-primary mt-4' 
                            style={{minWidth: 140}}
                        >
                            <div className='btn__wrap'>
                                <RiAddCircleLine />
                                <span>{locale('join_event')}</span>
                            </div>
                        </button>
                    </div>

                    <div className='col-xl-10 mx-auto mb-5'>
                        {/* Cover [[ Find at scss/components/cover.scss ]] */}
                        <div className='cover cover--round'>
                            <div className='cover__image'>
                                <div className='ratio ratio-16x9'>
                                    <Image 
                                        width={540}
                                        height={320}
                                        src={event.image}
                                        alt={event.title}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-xl-8 px-4 px-md-5 px-xl-0 mx-auto'>
                        <div className='row g-4 fs-6 mb-4'>
                            <div className='col-sm-6 d-flex'>
                                <RiMapPin2Fill size={20} />
                                <div className={replaceClassName('ms-3')}>
                                    <span className='d-block mb-2 fw-semibold text-dark'>Venue At</span>
                                    <div 
                                        dangerouslySetInnerHTML={
                                            { __html: event.address }
                                        }
                                    />
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='d-flex align-items-center mb-3'>
                                    <RiPhoneFill size={20} />
                                    <a 
                                        href={'tel:' + event.phone} 
                                        className={replaceClassName(
                                            'ms-3 text-dark'
                                        )}
                                    >
                                        {event.phone}
                                    </a>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <RiMailOpenFill size={20} />
                                    <a 
                                        href={'mailto:' + event.email} 
                                        className={replaceClassName(
                                            'ms-3 text-dark'
                                        )}
                                    >
                                        {event.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div 
                            dangerouslySetInnerHTML={
                                { __html: event.description }
                            }
                        />
                    </div>
                </div>
            </div>
		</>
    )
}


EventDetails.propTypes = propTypes as any
EventDetails.displayName = 'EventDetails'

export default EventDetails