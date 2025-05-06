
// Modules
import { getTranslations } from 'next-intl/server'

// Components
import CoverInfo from '@/core/components/cover-info'
import Section from '@/view/layout/section'
import Comments from '@/core/components/comments'

// Utilities
import { title } from '@/core/utils'
import { getTracks } from '@/core/utils/helper'
import { ParamsTypes, TrackTypes } from '@/core/types'


export default async function SongDetailsPage({params}: ParamsTypes) {

    const locale = await getTranslations()
    const tracks = await getTracks()
    const song = tracks.find(item => item.id === params.slug) as TrackTypes

	
	return (
        <>
			<div 
                className='hero' 
            />
            <div className='under-hero container'>
                <CoverInfo data={song} />
                <Section 
                    title={title(locale, 'related_tracks_title')}
                    data={tracks}
                    card='track'
                    slideView={5}
                    navigation
                    autoplay
                />

                <Comments id={song.id} />
            </div>
        </>
    )
}
