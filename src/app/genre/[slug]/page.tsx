// Components
import TrackList from '@/core/components/list'

// Utilities
import { getGenres } from '@/core/utils/helper'

interface Props {
    params: {
        slug: string
    }
}

export default async function GenrePage({ params }: Props) {
    const genres = await getGenres()
    const genre = genres.find(g => g.id === params.slug)

    if (!genre) {
        return (
            <div className="under-hero container">
                <div className="section">
                    <h3>Genre not found</h3>
                </div>
            </div>
        )
    }

    return (
        <>
            <div 
                className='hero' 
                style={{backgroundImage: 'url(' + genre.cover + ')'}} 
            />
            
            <div className='under-hero container'>
                <section className='section'>
                    <div className='section__head'>
                        <h3 className='mb-0'>{genre.title}</h3>
                    </div>

                    <div className='list'>
                        <div className='row'>
                            {genre.tracks.map((track, index) => (
                                <div key={index} className='col-xl-6'>
                                    <TrackList
                                        data={track}
                                        duration
                                        dropdown
                                        playlist
                                        queue
                                        play
                                        link
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
