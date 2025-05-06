
// Modules
import { getTranslations } from 'next-intl/server'

// Components
import Section from '@/view/layout/section'
import TrackList from '@/core/components/list'

// Utilities
import { title } from '@/core/utils'
import { getMood } from '@/core/utils/helper'
import { MoodTypes, ParamsTypes } from '@/core/types'


export default async function MoodDetailsPage({params}: ParamsTypes) {

    const locale = await getTranslations()
    const moods = await getMood()
    const mood = moods.find(item => item.id === params.slug) as MoodTypes
	
	return (
		<>
            {/* Hero [[ Find at scss/framework/hero.scss ]] */}
			<div 
                className='hero' 
                style={{backgroundImage: 'url(/images/banner/home.jpg)'}}
            />
            
            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='under-hero container'>
                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='section__head'>
                        <h3 className='mb-0'>{mood.title}</h3>
                    </div>
                    {/* List [[ Find at scss/components/list.scss ]] */}
                    <div className='list'>
                        <div className='row'>
                            {mood.tracks.map((item: any, index: number) => (
                                <div key={index} className='col-xl-6'>
                                    <TrackList 
                                        data={item}
                                        duration
                                        dropdown
                                        playlist
                                        queue
                                        play
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Section 
                    title={title(locale, 'discover_genres_title')}
                    data={moods}
                    card='mood'
                    slideView={4}
                    navigation
                    autoplay
                />
            </div>
		</>
	)
}
