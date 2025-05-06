/**
 * @name CollectionCard
 * @file collection.tsx
 * @description collection card component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

// Utilities
import { PlaylistTypes } from '@/core/types'

interface Props {
    data: PlaylistTypes
    info?: boolean
}

const propTypes = {
    /**
     * Set collection data
     */
    data: PropTypes.any.isRequired,

    /**
     * Display collection information
     */
    info: PropTypes.bool
}


const CollectionCard: React.FC<Props> = ({data, info}) => {

    return (
        // Cover [[ Find at scss/components/cover.scss ]]
        <div className='cover cover--round scale-animation'>
            <div className='cover__image'>
                <Link className='ratio ratio-16x9 d-block' href={data.href}>
                    <Image 
                        src={data.cover}
                        width={540}
                        height={320}
                        alt={data.title}
                    />
                </Link>
                <div className='cover__image__content'>
                    <Link href={data.href} className='cover__title mb-1 fs-6 text-truncate'>
                        {data.title}
                    </Link>
                    {info && (
                        <span className='cover__subtitle'>
                            {data.tracks.length} Tracks
                            {data?.likes ? '| ' + data?.likes + ' Likes' : ''}
                        </span>
                    )}
                </div>
            </div>            
        </div>
    )
}


CollectionCard.propTypes = propTypes as any
CollectionCard.displayName = 'CollectionCard'

export default CollectionCard