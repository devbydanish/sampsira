
// Modules
import { getTranslations } from 'next-intl/server'

// Components
import Section from '@/view/layout/section'
import Comments from '@/core/components/comments'
import TrackList from '@/core/components/list'

// Utilities
import { title } from '@/core/utils'
import { getPlaylist } from '@/core/utils/helper'
import { ParamsTypes, PlaylistTypes } from '@/core/types'


export default async function PlaylistDetailsPage({params}: ParamsTypes) {

    const playlists = await getPlaylist()
    const playlist = playlists.find(item => item.id === params.slug) as PlaylistTypes
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

                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='section__head'>
                        <div>
                            <span className='section__subtitle'>{locale('playlist')}</span>
                            <h3 className='mb-0'>{playlist.title}</h3>
                        </div>
                    </div>

                    {/* List [[ Find at scss/components/list.scss ]] */}
                    <div className='list'>
                        <div className='row'>
                            {playlist.tracks?.map((item: any, index: number) => (
                                <div key={index} className='col-xl-6'>
                                    <TrackList 
                                        data={item}
                                        duration
                                        dropdown
                                        queue
                                        play
                                        link
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                

                <Section 
                    title={title(locale, 'top_playlist_title')}
                    data={playlists}
                    card='playlist'
                    slideView={4}
                    navigation
                    autoplay
                />

                <Comments id={playlist.id} />
            </div>
		</>
	)
}
