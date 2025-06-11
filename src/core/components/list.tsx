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

            <div className='list__content text-white'>
                {number && (
                    <span className='list__number me-3'>{number}.</span>
                )}
                <span className='list__title text-truncate text-white'>
                    {data.title ? data.title : data.name}
                </span>
                {data.Producers && (
                    <div className='list__subtitle text-truncate text-white'>
                        {data.Producers.map((producer: InfoType, index: number) => (
                            <Link
                                key={index}
                                href={`/producers/${encodeURIComponent(producer.name.toLowerCase())}`}
                            >
                                {producer.name}
                                {data.Producers.length - 1 === index ? '' : ', '}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <ul className='list__option text-white'>
                {(duration && data.duration) && (
                    <li className="me-3">{data.duration}</li>
                )}
                {download && (
                    <li>
                        {data.purchased ? (
                            <button className="btn btn-outline-light btn-sm">
                                <RiDownloadLine size={18} className="me-1" />
                                Download
                            </button>
                        ) : (
                            <button className="btn btn-outline-light btn-sm">
                                Purchase for 3 Credits
                            </button>
                        )}
                    </li>
                )}
                {dropdown && (
                    <li>
                        <button className="btn btn-icon text-white" data-bs-toggle="dropdown">
                            <RiMoreFill size={18} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-sm bg-dark">
                            <li>
                                <button className="dropdown-item text-white menu-item-hover">Share</button>
                            </li>
                            <li>
                                <Link href="/report" className="dropdown-item text-white menu-item-hover">Report</Link>
                            </li>
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