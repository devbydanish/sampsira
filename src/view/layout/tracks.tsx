/**
 * @name Tracks
 * @file tracks.tsx
 * @description Tracks page component
 */
"use client"

// Modules
import React from 'react'
import PropTypes from 'prop-types'
import { useTranslations } from 'next-intl'

// Context
import { useTheme } from '@/core/contexts/theme'

// Components
import Section from '@/view/layout/section'
import TrackList from '@/core/components/list'

// Utilities
import { title } from '@/core/utils'
import { SoundKitTypes, TrackTypes } from '@/core/types'

interface Props {
    soundKits: SoundKitTypes[]
    tracks: TrackTypes[]
}

const propTypes = {
    /**
     * Set sound kits data
     */
    soundKits: PropTypes.array.isRequired,

    /**
     * Set tracks data
     */
    tracks: PropTypes.array.isRequired
}

const Tracks: React.FC<Props> = ({soundKits, tracks}) => {
    const {replaceClassName} = useTheme()
    const locale = useTranslations()

    return (
        <>
            {/* Hero [[ Find at scss/framework/hero.scss ]] */}
            <div 
                className='hero' 
                style={{backgroundImage: 'url(/images/banner/track.jpg)'}} 
            />

            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='under-hero container'>
                <Section 
                    title={title(locale, 'featured_sound_kits')}
                    subtitle={locale('featured_sound_kits_subtitle')}
                    data={soundKits}
                    card='sound_kit'
                    slideView={5}
                    navigation
                    autoplay
                />

                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='section__head'>
                        <h3 className='mb-0'>{locale('tracks_title')}</h3>
                        <div>
                            <select className='form-select' aria-label='Filter track'>
                                <option value='Popular'>Popular</option>
                                <option value='Most played'>Most played</option>
                                <option value='A to Z'>A to Z</option>
                                <option value='Z to A'>Z to A</option>
                            </select>
                        </div>
                    </div>

                    {/* List [[ Find at scss/components/list.scss ]] */}
                    <div className='list list--lg'>
                        <div className='row'>
                            {tracks.map((item: TrackTypes, index: number) => (
                                <div key={index} className='col-xl-6'>
                                    <TrackList 
                                        data={item}
                                        dropdown
                                        like
                                        link
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

Tracks.propTypes = propTypes as any
Tracks.displayName = 'Tracks'

export default Tracks