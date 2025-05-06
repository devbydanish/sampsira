/**
 * @name AvatarGroup
 * @file avatar-group.tsx
 * @description avatar group component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { EventTypes } from '@/core/types'

interface Props {
    data: EventTypes
}

const propTypes = {
    /**
     * Set event data
     */
    data: PropTypes.any.isRequired
}


const AvatarGroup: React.FC<Props> = ({data}) => {

    const {replaceClassName} = useTheme()


    return (
        data.attendees && (
            <div className='d-flex align-items-center'>
                {/* Avatar group [[ Find at scss/components/avatar.scss ]] */}
                <div className='avatar-group'>
                    {data.attendees.map(attendee => (
                        <div key={attendee.id} className='avatar'>
                            <div className='avatar__image'>
                                <Image 
                                    src={attendee.cover}
                                    width={128}
                                    height={128}
                                    alt={attendee.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {data.totalAttendee && (
                    <div className={replaceClassName('ps-1')}>{data.totalAttendee - 3 + '+'}</div>
                )}
            </div>
        )
    )
}


AvatarGroup.propTypes = propTypes as any
AvatarGroup.displayName = 'AvatarGroup'

export default AvatarGroup