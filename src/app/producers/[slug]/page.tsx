"use client"

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useProducers } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'

// Components
import Section from '@/view/layout/section'
import TrackList from '@/core/components/list'
import ProfileInfo from './ProfileInfo'

// Types
import { ProducerTypes, TrackTypes, SoundKitTypes } from '@/core/types'

type ProducerWithDetails = ProducerTypes & {
    bio?: string;
    socialAccounts?: {
        instagram?: { connected: boolean; username: string };
        facebook?: { connected: boolean; username: string };
        youtube?: { connected: boolean; username: string };
        tiktok?: { connected: boolean; username: string };
    };
    tracks?: TrackTypes[];
    soundKits?: SoundKitTypes[];
}

export default function ProducerPage() {
    const locale = useTranslations()
    const params = useParams()
    const { producers, loading } = useProducers()
    
    console.log('Producer page:', {
        slug: params.slug,
        producers: producers?.map(p => ({
            name: p.name,
            displayName: p.displayName,
            tracksCount: p.tracks?.length,
            soundKitsCount: p.soundKits?.length
        }))
    })
    
    const producer = producers?.find(p => p.name === (params.slug as string)?.toLowerCase()) as ProducerWithDetails | undefined
    
    console.log('Found producer:', producer)

    if (loading) {
        return <div className="container py-5 text-center"><LoadingSpinner /></div>
    }

    if (!producer) {
        return <div className="container py-5 text-center">Producer not found</div>
    }

    return (
        <div className="min-h-screen" style={{ marginTop: '100px' }}>
            <ProfileInfo producer={producer} />

            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='container' style={{ marginTop: '50px' }}>
                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='section__head'>
                        <h3 className='mb-0'>{locale('tracks')}</h3>
                    </div>

                    {producer.tracks && producer.tracks.length > 0 ? (
                        <div className='list'>
                            <div className='row'>
                                {producer.tracks.map((item, index) => (
                                    <div key={index} className='col-xl-6'>
                                        <TrackList
                                            data={{
                                                ...item,
                                                href: `/tracks/${item.id}`,
                                                title: item.title,
                                                src: item.src,
                                                cover: item.cover,
                                                type: 'track'
                                            }}
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
                    ) : (
                        <p className="my-4">{locale('no_samples_uploaded')}</p>
                    )}
                </div>

                <div className='section'>
                    <div className='section__head'>
                        <h3 className='mb-0'>{locale('sidebar.sound_kits')}</h3>
                    </div>
                    {producer.soundKits && producer.soundKits.length > 0 ? (
                        <Section
                            title=""
                            data={producer.soundKits.map(kit => ({
                                ...kit,
                                href: `/sound_kits/${kit.id}`,
                                title: kit.title || kit.name,
                                cover: kit.cover || '/images/cover/default.jpg',
                                type: 'sound_kit'
                            }))}
                            card="sound_kit"
                            slideView={5}
                            navigation
                            autoplay
                        />
                    ) : (
                        <p className="my-4">{locale('no_sound_kits_uploaded')}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
