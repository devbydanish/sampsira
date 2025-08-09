"use client"

// Modules
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

// Components
import Section from './section'
import Tab from '@/core/components/tab'
import TrackList from '@/core/components/list'
import Blog from '@/view/landing/blog'

// Utilities
import { title } from '@/core/utils'
import {
    SoundKitTypes,
    ProducerTypes,
    TrackTypes,
} from '@/core/types'
import { BRAND } from '@/core/constants/constant'

interface Props {
    soundKits: SoundKitTypes[]
    Producers: ProducerTypes[]
    tracks: TrackTypes[]
}

const propTypes = {
    soundKits: PropTypes.array.isRequired,
    Producers: PropTypes.array.isRequired,
    tracks: PropTypes.array.isRequired,
}

const Home: React.FC<Props> = ({
    soundKits,
    Producers,
    tracks
}) => {
    const locale = useTranslations()
    const footer = useTranslations('footer')

    // Create genre-specific track lists
    const genreTabs = useMemo(() => {
        const genreIds = [
            'reggaeton',
            'trap',
            'hiphop_rap',
            'drill',
            'techno',
            'drumandbass',
            'jersey_club',
            'dancehall',
            'afrobeat',
            'amapiano',
            'house',
            'pop',
            'randb'
        ];
        
        return genreIds.map(genreId => {
            const genreTracks = tracks.filter((track: TrackTypes) => 
                track.genre.some(g => 
                    g.name.toLowerCase() === genreId.toLowerCase()
                )
            );
            
            const limitedTracks = genreTracks;
            
            return {
                id: genreId,
                name: locale(genreId),
                list: limitedTracks
            };
        });
    }, [tracks, locale]);

    // Divide sound kits data into two parts to set a design.
    const divide = Math.ceil(soundKits.length / 2)
    const soundKitList = []
    soundKitList.push([...soundKits].slice(0, divide))
    soundKitList.push([...soundKits].slice(-divide))

    return (
        <div className='under-hero container'>
            <Section 
                title={title(locale, 'new_release_title')}
                subtitle={locale('new_release_subtitle')}
                href='/music/track'
                data={tracks}
                card='track'
                slideView={5}
                navigation
                autoplay
                isNewReleases={true}
            />

            <Section 
                title={title(locale, 'feature_Producers_title')}
                subtitle={locale('feature_Producers_subtitle')}
                href='/music/producers'
                data={Producers}
                card='avatar'
                slideView={6}
                pagination
                autoplay
            />

            <div className='row'>
                <div className='section col-xl-12'>
                    <h2 
                        style={{ fontSize: '32px', lineHeight: '1.2' }}
                        dangerouslySetInnerHTML={{ __html: title(locale, 'top_tracks_genre_title') }}
                    />
                    <Tab id='tracks_list'>
                        {genreTabs.map((tab, index) => (
                            <li 
                                key={tab.id}
                                className='nav-item' 
                                role='presentation'
                            >
                                <button 
                                    className={classNames(
                                        'nav-link',
                                        index === 0 && 'active'
                                    )}
                                    id={tab.id}
                                    data-bs-toggle='tab' 
                                    data-bs-target={'#' + tab.id + '_pane'}
                                    type='button' 
                                    role='tab' 
                                    aria-controls={tab.id + '_pane'}
                                    aria-selected={index === 0 ? true : false} 
                                >
                                    {tab.name}
                                </button>
                            </li>
                        ))}
                    </Tab>
                    <div className='tab-content mt-4' id='tracks_list_content'>
                        {genreTabs.map((tab, index) => (
                            <div 
                                key={tab.id}
                                id={tab.id + '_pane'}
                                role='tabpanel' 
                                aria-labelledby={tab.id}
                                tabIndex={0} 
                                className={classNames(
                                    'tab-pane fade',
                                    index === 0 && 'show active'
                                )}
                            >
                                <div className='list'>
                                    {tab.list.length > 0 ? (
                                        tab.list.map((track: TrackTypes) => (
                                            <TrackList
                                                key={track.id}
                                                data={{
                                                    ...track,
                                                    producer: track.Producers?.[0] || null,
                                                }}
                                                play
                                                duration
                                                download
                                                dropdown
                                                link
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p>No tracks found for this genre</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <section className='container'>
                <div className='newsletter text-white'>
                    <div className='col-xl-7 col-lg-10 fs-5 mx-auto text-center'>
                        <h2 className='text-white'>
                            {footer('title') + ' '} 
                            <span className='newsletter__title-text'>{BRAND.name}</span>
                        </h2>
                        <p>{footer('description')}</p>
                        <Link
                            href='/auth/register'
                            className='btn btn-lg mt-3'
                            style={{ background: '#fff', color: '#000' }}
                        >
                            {locale('register_now')}
                        </Link>
                    </div>
                </div>  
            </section>
        </div>
    )
}

Home.propTypes = propTypes

export default Home