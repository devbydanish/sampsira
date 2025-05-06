/**
 * @name AvatarCard
 * @file avatar.tsx
 * @description producer avatar card component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

// Utilities
import { ProducerTypes } from '@/core/types'

interface Props {
    data: ProducerTypes
}

const propTypes = {
    /**
     * Set event data
     */
    data: PropTypes.any.isRequired
}


const AvatarCard: React.FC<Props> = ({data}) => {

    return (
        // Avatar [[ Find at scss/components/avatar.scss ]]
        <div className='avatar avatar--xxl scale-animation d-block text-center'>
            <div className='avatar__image mx-auto'>
                <Link href={data.href}>
                    <Image 
                        src={data.cover}
                        width={128}
                        height={128}
                        alt={data.name}
                    />
                </Link>
            </div>
            <Link 
                href={data.href}
                className='avatar__title mt-3'
            >
                {data.name}
            </Link>
        </div>
    )
}


AvatarCard.propTypes = propTypes as any
AvatarCard.displayName = 'AvatarCard'

export default AvatarCard