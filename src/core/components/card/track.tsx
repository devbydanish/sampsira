/**
 * @name TrackCard
 * @file track.tsx
 * @description track card component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { RiHeartFill, RiVipCrownFill } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Components
import TrackDropdown, { TrackDropdownProps } from '../dropdown'
import PlayButton from '../audio-player/play'

// Utilities
import { InfoType } from '@/core/types'

interface TrackProps 
extends Omit<TrackDropdownProps, 'href'> {
    data: any,
    dropdown?: boolean,
    link?: boolean
}

const propTypes = {
    /**
     * Set track data
     */
    data: PropTypes.any.isRequired,

    /**
     * Set dropdown options
     */
    dropdown: PropTypes.bool,

    /**
     * Set link on card
     */
    link: PropTypes.bool,
}


const TrackCard: React.FC<TrackProps> = (
    {
        data,
        dropdown,
        like,
        queue,
        playlist,
        play,
        link
    }
) => {

    const {replaceClassName} = useTheme()

    const Component: any = link ? Link : 'div'
    const attr = link ? {href: data.href} : {}

    // Ensure track data has all required fields
    const trackData = {
        ...data,
        id: data.id,
        title: data.title || data.name,
        type: 'track',
        src: data.src || (data.audio?.data?.attributes?.url ? 
            `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.audio.data.attributes.url}` : 
            data.audioUrl),
        cover: data.cover || (data.cover?.data?.attributes?.url ?
            `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.cover.data.attributes.url}` :
            '/images/cover/default.jpg'),
        Producers: data.Producers || []
    }

    console.log("Track data for player:", trackData);

    return (
        // Cover [[ Find at scss/components/cover.scss ]]
        <div className='cover cover--round scale-animation'>
            {/* Cover head */}
            {(dropdown || data.premium || data.like) && (
                <div className='cover__head'>
                    {(data.premium || data.like) && (
                        <ul className='cover__label d-flex'>
                            {data.like && (
                                <li>
                                    <span className='badge rounded-pill bg-danger'>
                                        <RiHeartFill size={16} />
                                    </span>
                                </li>
                            )}
                        </ul>
                    )}

                    {dropdown && (
                        <TrackDropdown 
                            className={replaceClassName('cover__options dropstart d-inline-flex ms-auto')}
                            play={play}
                            like={like}
                            playlist={playlist}
                            queue={queue}
                            data={trackData}
                            href={data.href}
                            iconVertical
                        />
                    )}
                </div>
            )}

            {/* Cover image */}
            <div className='cover__image'>
                <Component 
                    className='ratio ratio-1x1'
                    {...attr}
                >
                    <Image
                        src={trackData.cover}
                        width={320}
                        height={320}
                        alt={trackData.title}
                    />
                </Component>

                {play && (
                    <PlayButton track={trackData} />
                )}
            </div>

            {/* Cover foot */}
            <div className='cover__foot'>
                {data.href ? (
                    <Link href={data.href} className='cover__title text-truncate'>
                        {trackData.title}
                    </Link>
                ) : (
                    <span className='cover__title text-truncate'>
                        {trackData.title}
                    </span>
                )}
                {trackData.Producers && trackData.Producers.length > 0 && (
                    <div className='cover__subtitle text-truncate'>
                        {trackData.Producers.map((producer: InfoType, index: number) => (
                            <Link
                                key={index}
                                href={'/music/producers/' + producer.id}
                            >
                                {producer.name}
                                {index < trackData.Producers.length - 1 ? ', ' : ''}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}


TrackCard.propTypes = propTypes as any
TrackCard.displayName = 'TrackCard'

export default TrackCard