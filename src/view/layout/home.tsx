/**
 * @name Home
 * @file home.tsx
 * @description common component for music pages section
 */
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
} from '@/core/types'
import { BRAND, SOCIAL } from '@/core/constants/constant'

// Types
interface Track {
    id: number;
    title: string;
    type: string;
    cover: string;
    src: string;
    duration: string;
    href: string;
    thumb: string;
    date: string;
    rating: number | null;
    played: number | null;
    downloads: number;
    keys: string[];
    moods: string[];
    genre: Array<{
        id: number;
        name: string;
    }>;
    categories: any[];
    producers: any[];
    Producers: Array<{
        id: number;
        name: string;
    }>;
    bpm: number;
}

interface Props {
    soundKits: SoundKitTypes[]
    Producers: ProducerTypes[]
    tracks: Track[]
}

const propTypes = {
    /**
     * Set sound kits data
     */
    soundKits: PropTypes.array.isRequired,

    /**
     * Set Producers data
     */
    Producers: PropTypes.array.isRequired,


    
    /**
     * Set tracks data
     */
    tracks: PropTypes.array.isRequired,


}


const Home: React.FC<Props> = ({
    soundKits,
    Producers,
    tracks
}) => {

    const locale = useTranslations()
    const footer = useTranslations('footer')
    console.log(tracks)
    
    // Create genre-specific track lists
    const genreTabs = useMemo(() => {
        // Define genres we want to display
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
        ];
        
        // Create tabs with filtered tracks for each genre
        return genreIds.map(genreId => {
            // Filter tracks that have this genre
            const genreTracks = tracks.filter(track => 
                track.genre.some(g => 
                    g.name.toLowerCase() === genreId.toLowerCase()
                )
            );
            
            // If no tracks found for this genre, use a maximum of 5 random tracks 
            // as a fallback (but only if the genre is not reggaeton)
            // const trackList = genreId === 'reggaeton' 
            //     ? genreTracks 
            //     : (genreTracks.length > 0 
            //         ? genreTracks 
            //         : [...tracks].slice(0, 5));
            
            // // Limit to 5 tracks per genre
            const limitedTracks = genreTracks;
            
            return {
                id: genreId,
                name: locale(genreId),
                list: limitedTracks
            };
        });
    }, [tracks, locale]);

    // 
	// Divide sound kits data into two part to set a design.
	const divide = Math.ceil(soundKits.length / 2)
	const soundKitList = []
	soundKitList.push([...soundKits].slice(0, divide))
	soundKitList.push([...soundKits].slice(-divide))


    return (
        // Under hero [[ Find at scss/framework/hero.scss ]]
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
                                        tab.list.map((track: Track) => (
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

            <section className='section'>
                {/* <div className='section__head'>
                    <div className='flex-grow-1'>
                        <span className='section__subtitle'>{locale('top_sound_kits_subtitle')}</span>
                        <h3
                            className='mb-0'
                            dangerouslySetInnerHTML={{__html: title(locale, 'top_sound_kits_title')}}
                        />
                    </div>
                </div> */}
                {/* List [[ Find at scss/components/list.scss ]] */}
                <div className='list list--lg list--order'>
                    <div className='row'>
                        {soundKitList.map((item: any, index: number) => (
                            <div key={index} className='col-xl-6'>
                                {item.map((soundKit: SoundKitTypes) => (
                                    <TrackList
                                        key={soundKit.id}
                                        data={soundKit}
                                        download
                                        dropdown
                                        like
                                        link
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='container'>
                {/* Newsletter [[ Find at scss/base/core.scss ]] */}
                <div className='newsletter'>
                    <div className='newsletter__content'>
                        <h2>{footer('newsletter_title')}</h2>
                        <p>{footer('newsletter_subtitle')}</p>
                        <form action='#'>
                            <div className='form-group'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder={footer('newsletter_email')}
                                />
                                <button type='button' className='btn'>
                                    {footer('newsletter_subscribe')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

Home.propTypes = propTypes

export default Home