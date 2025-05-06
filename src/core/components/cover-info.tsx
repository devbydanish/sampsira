/**
 * @name CoverInfo
 * @file cover-info.tsx
 * @description component use to show content of cover in the details pages
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { 
    RiDownload2Line, 
    RiHeartFill, 
    RiHeartLine, 
    RiStarFill 
} from '@remixicon/react'

// Contexts
import { useTheme } from '../contexts/theme'
import { usePlayer } from '../contexts/player'

// Components
import TrackDropdown from './dropdown'
import PlayButton from './audio-player/play'

interface Props {
    data: any
}

const propTypes = {
    /**
     * Set cover data
     */
    data: PropTypes.object.isRequired
}


const CoverInfo: React.FC<Props> = ({data}) => {

    const FavoriteIcon = data.like ? RiHeartFill : RiHeartLine

    const pathname = usePathname()
    const {replaceClassName} = useTheme() 
    const {playAll} = usePlayer()
    const locale = useTranslations()


    /**
     * 
     * Get the person list view based on array
     * @param title 
     * @param list 
     * @returns 
     */
    const getPersonList = (title: string, list: any[]) => {
        return (
            list && (
                <p className='mb-2'>
                    {title} {' '}
                    {list.map((item: any, index: number) => 
                        <Link 
                            key={item.id}
                            className='text-dark fw-medium' 
                            href={'/music/producers/' + item.id}
                        >
                            {item.name}{index !== list.length - 1 ? ', ' : ''}
                        </Link>
                    )}
                </p>
            )
        )
    }

    /**
     * 
     * Get the section information
     * @returns 
     */
    const getSectionInfoList = () => {
        return (
            pathname.includes('album') 
            ? (
                <>
                    <li>{locale('sidebar.albums')}</li>
                    <li>{data.tracks.length} {locale('tracks')}</li>
                </>
            ) : (
                <>
                    {data.categories && (
                        <li>
                            {data.categories.map(
                                (category: any, index: number) => category.name
                                + (index !== data.categories.length - 1 ? ', ' : '')
                            )}
                        </li>
                    )}
                    {data.totalAlbums && (
                        <li>{data.totalAlbums} {locale('sidebar.albums')}</li>
                    )}
                    {data.totalTracks && (
                        <li>{data.totalTracks} {locale('tracks')}</li>
                    )}
                </>
            )
        )
    }


    return (
        //  Section [[ Find at scss/framework/section.scss ]]
        <div className='section'>
            <div className='row'>
                <div className='col-xl-3 col-md-4'>
                    {/* Cover [[ Find at scss/components/cover.scss ]] */}
                    <div className='cover cover--round'>
                        <div className='cover__image'>
                            <div className='ratio ratio-1x1'>
                                <Image 
                                    width={320}
                                    height={320}
                                    src={data.cover}
                                    alt={data.title ? data.title : data.name}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-1 d-none d-xl-block'></div>
                <div className='col-md-8 mt-5 mt-md-0'>
                    <div className='d-flex align-items-center flex-wrap'>
                        <span className={replaceClassName('text-dark fs-4 fw-semibold pe-2')}>
                            {data.title ? data.title : data.name}
                        </span>
                        <TrackDropdown 
                            className={replaceClassName(
                                'dropstart d-inline-flex ms-auto'
                            )} 
                            data={data}
                            queue={!data.tracks}
                            play 
                            playlist 
                        />
                    </div>

                    {/* Info list [[ Find at scss/components/list.scss ]] */}
                    <ul className='info-list info-list--dotted mt-2'>
                        {getSectionInfoList()}
                        {data.duration && (<li>{data.duration}</li>)}
                        <li>{data.dob ? data.dob : data.date}</li>
                        {data.company && (<li>{data.company}</li>)}
                    </ul>

                    {(
                        data.Producers || 
                        data.composers || 
                        data.lyricists || 
                        data.directors
                    ) && (
                        <div className='mt-3'>
                            {getPersonList('By:', data.Producers)}
                            {getPersonList('Compose by:', data.composers)}
                            {getPersonList('Lyrics by:', data.lyricists)}
                            {getPersonList('Music director:', data.directors)}
                        </div>
                    )}                    

                    {data.description && (
                        <div 
                            className='mt-4' 
                            dangerouslySetInnerHTML={
                                { __html: data.description }
                            } 
                        />
                    )}

                    {/* Info list [[ Find at scss/components/list.scss ]] */}
                    <ul className='info-list mt-5'>
                        <li>
                            <div className='d-flex align-items-center'>
                                {data.tracks ? (
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        onClick={() => playAll(data.tracks)}
                                    >
                                        {locale('play_all')}
                                    </button>
                                ) : (
                                    <>
                                        <PlayButton 
                                            primaryButton
                                            track={data}
                                        />
                                        <span className={replaceClassName(
                                                'ps-2 fw-semibold text-dark'
                                            )}
                                        >
                                            {data.played}
                                        </span>
                                    </>
                                )}
                            </div>
                        </li>
                        <li>
                            <a role='button' 
                                aria-label='Like'
                                className='d-flex align-items-center text-dark'
                            >
                                <FavoriteIcon className={classNames(
                                    data.like && 'text-danger'
                                    )} 
                                />
                                <span 
                                    className={replaceClassName(
                                        'ps-2 fw-semibold'
                                    )}
                                >
                                    {data.likes}
                                </span>
                            </a>
                        </li>
                        {data.downloads && (
                            <li>
                                <a 
                                    role='button' 
                                    className='text-dark d-flex align-items-center' 
                                    aria-label='Download'
                                >
                                    <RiDownload2Line />
                                    <span className={replaceClassName(
                                            'ps-2 fw-semibold'
                                        )}
                                    >
                                        {data.downloads}
                                    </span>
                                </a>
                            </li>
                        )}
                        <li>
                            <span className='text-dark d-flex align-items-center'>
                                <RiStarFill className='text-warning' />
                                <span className={replaceClassName(
                                        'ps-2 fw-semibold'
                                    )}
                                >
                                    {data.rating}
                                </span>
                            </span>
                        </li>
                    </ul>

                    {data.lyrics && (
                        <div className='mt-5'>
                            <span className='d-block text-dark fs-6 fw-semibold mb-3'>{locale('lyrics')}</span>
                            <div 
                                dangerouslySetInnerHTML={
                                    { __html: data.lyrics }
                                } 
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


CoverInfo.propTypes = propTypes as any
CoverInfo.displayName = 'CoverInfo'

export default CoverInfo