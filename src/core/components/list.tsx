"use client"

import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import { RiDownloadLine, RiHeartLine, RiMoreFill, RiPlayListLine } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'
import { usePlayer } from '../contexts/player'

// Components
import PlayButton from './audio-player/play'

// Utilities
import { InfoType } from '@/core/types'

interface TrackListProps {
    data: any
    duration?: boolean
    link?: boolean
    play?: boolean
    number?: number
    download?: boolean
    dropdown?: boolean
    like?: boolean
    playlist?: boolean
    queue?: boolean
}

const propTypes = {
    data: PropTypes.any.isRequired,
    duration: PropTypes.bool,
    link: PropTypes.bool,
    play: PropTypes.bool,
    number: PropTypes.number,
    download: PropTypes.bool,
    dropdown: PropTypes.bool,
    like: PropTypes.bool,
    playlist: PropTypes.bool,
    queue: PropTypes.bool
}

const TrackList: React.FC<TrackListProps> = ({
    data,
    duration,
    play,
    link,
    number,
    download,
    dropdown,
    like,
    playlist,
    queue
}) => {
    const {replaceClassName} = useTheme()
    const Component: any = link ? Link : 'div'
    const attr = link ? {href: data.href} : {}
    
    return (
        <div className='list__item'>
            <div className='list__cover'>
                <Component 
                    className='ratio ratio-1x1'
                    {...attr}
                >
                    <Image
                        src={data.cover}
                        width={320}
                        height={320}
                        alt={data.title ? data.title : data.name}
                    />
                </Component>

                {play && (
                    <PlayButton 
                        className='p-2 border-0'
                        iconSize={16} 
                        track={data}
                    />
                )}
            </div>

            <div className='list__content'>
                {number && (
                    <span className='list__number me-3'>{number}.</span>
                )}
                <Component
                    className='list__title text-truncate'
                    {...attr}
                >
                    {data.title ? data.title : data.name}
                </Component>
                {data.Producers && (
                    <div className='list__subtitle text-truncate'>
                        {data.Producers.map((producer: InfoType, index: number) => (
                            <span key={index}>
                                {producer.name}
                                {data.Producers.length - 1 === index ? '' : ', '}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <ul className='list__option'>
                {(duration && data.duration) && (
                    <li>{data.duration}</li>
                )}
                {download && (
                    <li>
                        <button
                            className="btn btn-icon hover-trigger"
                            aria-label="Download for 3 credits"
                        >
                            <RiDownloadLine size={18} />
                            <div className="hover-tooltip">Download for 3 credits</div>
                        </button>
                    </li>
                )}
                {like && (
                    <li>
                        <button className="btn btn-icon">
                            <RiHeartLine size={18} />
                        </button>
                    </li>
                )}
                {playlist && (
                    <li>
                        <button className="btn btn-icon">
                            <RiPlayListLine size={18} />
                        </button>
                    </li>
                )}
                {dropdown && (
                    <li>
                        <button className="btn btn-icon dropdown-toggle" data-bs-toggle="dropdown">
                            <RiMoreFill size={18} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-sm">
                            <li><button className="dropdown-item">Add to playlist</button></li>
                            <li><button className="dropdown-item">Share</button></li>
                        </ul>
                    </li>
                )}
            </ul>
        </div>        
    )
}

TrackList.propTypes = propTypes as any
TrackList.displayName = 'TrackList'

export default TrackList