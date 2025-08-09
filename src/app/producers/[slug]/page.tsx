"use client"

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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
    tracks?: any[];
    soundKits?: SoundKitTypes[];
}

export default function ProducerPage() {
    const locale = useTranslations()
    const params = useParams()
    const { producers, loading } = useProducers()
    const [producer, setProducer] = useState<ProducerWithDetails | undefined>(undefined)
    const [isLoadingDetails, setIsLoadingDetails] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        const fetchProducerDetails = async () => {
            if (!params.slug) return
            
            setIsLoadingDetails(true)
            setError(null)
            
            try {
                console.log('producers', producers)
                // Find basic producer info from Redux store
                const basicProducer = producers?.find(p => 
                    p.name === (params.slug as string)?.toLowerCase() || 
                    p.id.toString() === params.slug
                )
                
                if (!basicProducer) {
                    setError('Producer not found')
                    setIsLoadingDetails(false)
                    return
                }

                const formatedTracks = basicProducer?.tracks?.map((track: any) => ({
                    ...track,
                    cover: track.cover?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${track.cover.url}` : '/images/cover/default.jpg',
                    audio: track.audio?.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${track.audio.url}` : '/images/cover/default.jpg'
                }))
                
                // Process the response data
                const producerDetails: ProducerWithDetails = {
                    ...basicProducer,
                    bio: basicProducer.bio || '',
                    socialAccounts: basicProducer.socialAccounts || {},
                    tracks: formatedTracks || [],
                    soundKits: basicProducer.soundKits || []
                }
                
                setProducer(producerDetails)
            } catch (err) {
                console.error('Error fetching producer details:', err)
                setError('Error loading producer details')
            } finally {
                setIsLoadingDetails(false)
            }
        }
        
        if (producers && producers.length > 0) {
            fetchProducerDetails()
        }
    }, [params.slug, producers])
    
    if (loading || isLoadingDetails) {
        return <div className="container py-5 text-center"><LoadingSpinner /></div>
    }

    if (error || !producer) {
        return <div className="container py-5 text-center" style={{marginTop: '100px'}}>{error || 'Producer not found'}</div>
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
                                                src: item.audio,
                                                cover: item.cover,
                                                type: 'track',
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

                {/* <div className='section'>
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
                </div> */}
            </div>
        </div>
    )
}
