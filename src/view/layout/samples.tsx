"use client"

// Modules
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslations } from 'next-intl'
import { RiLoader3Fill } from '@remixicon/react'

// Context
import { useTheme } from '@/core/contexts/theme'

// Components
import Section from '@/view/layout/section'
import TrackList from '@/core/components/list'

// Utilities
import { title } from '@/core/utils'
import { GenreTypes, MoodTypes, TrackTypes, SoundKitTypes } from '@/core/types'

interface Props {
    genres: GenreTypes[]
    moods: MoodTypes[]
    tracks: TrackTypes[]
    soundKits: SoundKitTypes[]
}

const propTypes = {
    genres: PropTypes.array.isRequired,
    moods: PropTypes.array.isRequired,
    tracks: PropTypes.array.isRequired,
    soundKits: PropTypes.array.isRequired
}

const Samples: React.FC<Props> = ({genres, moods, tracks, soundKits}) => {
    const {replaceClassName} = useTheme()
    const locale = useTranslations()

    console.log(tracks, 'tracks')
    

    return (
        <div className='container' style={{marginTop: '100px'}}>
            {/* Latest Samples Section */}
            <section className='section'>
                <div className='section__head'>
                    <h3 className='mb-0' dangerouslySetInnerHTML={{__html: title(locale, 'latest_samples_title')}} />
                </div>
                <div className='list'>
                    <div className='row'>
                        {tracks.length > 0 ? (
                            tracks.map((item: any, index: number) => (
                                <div key={index} className='col-xl-6'>
                                    <TrackList
                                        data={{
                                            ...item,
                                            href: `/tracks/${item.id}`,
                                            title: item.title || item.name,
                                            src: item.src,
                                            cover: item.cover,
                                            type: 'track'
                                        }}
                                        duration
                                        download
                                        dropdown
                                        play
                                        link
                                    />
                                </div>
                            ))
                        ) : (
                            <div className='col-12'>
                                <p className='text'>No samples available</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sound Kits Section */}
            <section className='section mt-5'>
                <div className='section__head'>
                    <h3 className='mb-0' dangerouslySetInnerHTML={{__html: title(locale, 'sound_kits_title')}} />
                </div>
                <div className='list'>
                    <div className='row'>
                        {soundKits.length > 0 ? (
                            soundKits.map((item: SoundKitTypes, index: number) => (
                                <div key={index} className='col-xl-6'>
                                    <TrackList
                                        data={item}
                                        dropdown
                                        like
                                        link
                                        playlist
                                        queue
                                    />
                                </div>
                            ))
                        ) : (
                            <div className='col-12'>
                                <p className='text'>No sound kits available</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Genre Section */}
            <section className='section mt-5'>
                <div className='section__head'>
                    <h3 className='mb-0' dangerouslySetInnerHTML={{__html: title(locale, 'samples_genres_title')}} />
                </div>
                <div className='row g-4'>
                    {genres.length > 0 ? (
                        genres.map((genre, index) => (
                            <div key={index} className='col-xl-2 col-md-3 col-sm-4 col-6'>
                                <a href={`/genre/${genre.id}`} className='cover cover--round scale-animation'>
                                    <div className='cover__image'>
                                        <div className='ratio ratio-1x1'>
                                            <img
                                                src={genre.cover}
                                                alt={genre.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '0.5rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='cover__foot'>
                                        <span className='cover__title text-truncate'>{genre.title}</span>
                                    </div>
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className='col-12'>
                            <p className='text'>No genres available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Moods Section */}
            <section className='section mt-5'>
                <div className='section__head'>
                    <h3 className='mb-0' dangerouslySetInnerHTML={{__html: title(locale, 'moods_title')}} />
                </div>
                <div className='row g-4'>
                    {moods.length > 0 ? (
                        moods.map((mood, index) => (
                            <div key={index} className='col-xl-2 col-md-3 col-sm-4 col-6'>
                                <a href={`/mood/${mood.id}`} className='cover cover--round scale-animation'>
                                    <div className='cover__image'>
                                        <div className='ratio ratio-1x1'>
                                            <img
                                                src={mood.cover}
                                                alt={mood.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: '0.5rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='cover__foot'>
                                        <span className='cover__title text-truncate'>{mood.title}</span>
                                    </div>
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className='col-12'>
                            <p className='text'>No moods available</p>
                        </div>
                    )}
                </div>
            </section>

        </div>
    )
}

Samples.propTypes = propTypes as any
Samples.displayName = 'Samples'

export default Samples