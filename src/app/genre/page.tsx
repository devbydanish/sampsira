
// Modules
import { getTranslations } from 'next-intl/server'

// Components
import Section from '@/view/layout/section'

// Utilities
import { title } from '@/core/utils'
import { getGenre } from '@/core/utils/helper'


export default async function GenrePage() {

    const locale = await getTranslations()
    const genre = await getGenre()
	
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
                    title={title(locale, 'music_genres_title')}
                    data={genre}
                    card='genre'
                    slideView={4}
                    grid
                    navigation
                    autoplay
                />
            </div>
		</>
	)
}
