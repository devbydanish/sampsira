
// Modules
import { getTranslations } from 'next-intl/server'

// Components
import Section from '@/view/layout/section'

// Utilities
import { title } from '@/core/utils'
import { getMood } from '@/core/utils/helper'


export default async function MoodPage() {

    const locale = await getTranslations()
    const mood = await getMood()
	
	return (
		<>
            {/* Hero [[ Find at scss/framework/hero.scss ]] */}
			<div 
                className='hero' 
                style={{backgroundImage: 'url(/images/banner/home.jpg)'}}
            />
            
            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='under-hero container'>
                <Section 
                    title={title(locale, 'music_moods_title')}
                    data={mood}
                    card='mood'
                    slideView={4}
                    grid
                    navigation
                    autoplay
                />
            </div>
		</>
	)
}
