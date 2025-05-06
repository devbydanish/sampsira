/**
 * @name Sound-Kits
 * @file Sound-Kits.tsx
 * @description album page component
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
import { SoundKitTypes } from '@/core/types'

interface Props {
    soundKits: SoundKitTypes[]
}

const propTypes = {
    /**
     * Set sound kits data
     */
    soundKits: PropTypes.array.isRequired

}


const SoundKits: React.FC<Props> = ({soundKits}) => {

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
                    title={title(locale, 'sound_kits_title')}
                    data={soundKits}
                    card='sound_kit'
                    slideView={5}
                    navigation
                    autoplay
                />

                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='section__head'>
                        <span className={replaceClassName(
                            'd-block pe-3 fs-6 fw-semibold'
                            )}
                        >
                            10245 {locale('sidebar.sound_kits') + ' ' + locale('in_the_list')}
                        </span>
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
                            {soundKits.map((item: SoundKitTypes, index: number) => (
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


SoundKits.propTypes = propTypes as any
SoundKits.displayName = 'SoundKits'

export default SoundKits