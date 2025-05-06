
// Modules
import { getTranslations } from 'next-intl/server'

// Components
import Section from '@/view/layout/section'

// Utilities
import { title } from '@/core/utils'
import { getPlaylist } from '@/core/utils/helper'


export default async function PlaylistPage() {

    const playlist = await getPlaylist()
    const locale = await getTranslations()
	
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
                    title={title(locale, 'trending_playlist_title')}
                    data={playlist}
                    card='playlist'
                    slideView={4}
                    grid
                />
            </div>
        </>
    )
}
