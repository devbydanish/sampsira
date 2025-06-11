/**
 * @name Home
 * @file home.tsx
 * @description common component for music pages section
 */
"use client"


// Modules
import React from 'react'
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
    TrackTypes
} from '@/core/types'
import { BRAND, SOCIAL } from '@/core/constants/constant'


interface Props {
    soundKits: SoundKitTypes[]
    Producers: ProducerTypes[]
    tracks: TrackTypes[]
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
    

    // 
    // Data for tab list view
    const tabs = [
		{
			id: 'reggaeton',
			name: locale('reggaeton'),
			list: [...tracks].slice(0, 5)
		},
		{
			id: 'trap',
			name: locale('trap'),
			list: [...tracks].slice(5)
		},
		{
			id: 'hiphop_rap',
			name: locale('hiphop_rap'),
			list: [...tracks].slice(0, 5)
		},
		{
			id: 'drill',
			name: locale('drill'),
			list: [...tracks].slice(0, 5)
		},
		{
			id: 'techno',
			name: locale('techno'),
			list: [...tracks].slice(0, 5)
		},
		{
			id: 'drumandbass',
			name: locale('drumandbass'),
			list: [...tracks].slice(0, 5)
		},
		{
			id: 'jersey_club',
			name: locale('jersey_club'),
			list: [...tracks].slice(0, 5)
		},
		{
			id: 'dancehall',
			name: locale('dancehall'),
			list: [...tracks].slice(0, 5)
		},
		{
			id: 'afrobeat',
			name: locale('afrobeat'),
			list: [...tracks].slice(0, 5)
		},
	]

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
                        {tabs.map((tab, index) => (
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
                        {tabs.map((tab, index) => (
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
                                {/* List [[ Find at scss/components/list.scss ]] */}
                                <div className='list'>
                                    {tab.list.map((item: any, listIndex: number) => (
                                        <TrackList
                                            key={listIndex}
                                            data={item}
                                            play
                                            duration
                                            download
                                            dropdown
                                            link
                                        />
                                    ))}
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
                <div className='newsletter text-white'>
                    <div className='col-xl-7 col-lg-10 fs-5 mx-auto text-center'>
                        <h2 className='text-white'>
                            {footer('title') + ' '} 
                            <span className='newsletter__title-text'>{BRAND.name}</span>
                        </h2>
                        <p>{footer('description')}</p>
                        <Link href='/auth/register' className='btn btn-lg btn-white mt-3'>
                            {locale('register_now')}
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* <Blog /> */}

        </div>
    )
}


Home.propTypes = propTypes as any
Home.displayName = 'Home'

export default Home