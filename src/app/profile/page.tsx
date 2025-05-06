"use client"

// Modules
import { useTranslations } from 'next-intl'

// Components
import Section from '@/view/layout/section'
import TrackList from '@/core/components/list'
import ProfileInfo from './ProfileInfo'

// Utilities
import { useAuthentication } from '@/core/contexts/authentication'

export default function ProfilePage() {
    const locale = useTranslations()
    const { currentUser } = useAuthentication()
    const tracks = currentUser?.tracks || []
    const soundKits = currentUser?.soundKits || []

    return (
        <div className="min-h-screen">
            <ProfileInfo />

            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='under-hero container mt-4'>
                {/* Section [[ Find at scss/framework/section.scss ]] */}
                <div className='section'>
                    <div className='section__head'>
                        <h3 className='mb-0'>{locale('tracks')}</h3>
                    </div>

                    {tracks.length > 0 ? (
                        <div className='list'>
                            <div className='row'>
                                {tracks.map((item: any, index: number) => (
                                    <div key={index} className='col-xl-6'>
                                        <TrackList
                                            data={{
                                                ...item,
                                                href: `/tracks/${item.id}`,
                                                title: item.title || item.name,
                                                src: item.audio?.data?.attributes?.url ?
                                                    `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.audio.data.attributes.url}` :
                                                    item.audioUrl,
                                                cover: item.cover?.data?.attributes?.url ?
                                                    `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.cover.data.attributes.url}` :
                                                    '/images/covers/default.png',
                                                type: 'track'  // Changed to 'track' to match the player's expected type
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
                    {soundKits.length > 0 ? (
                        <Section
                            title=""
                            data={soundKits.map(kit => ({
                                ...kit,
                                href: `/sound_kits/${kit.id}`,
                                title: kit.title || kit.name,
                                cover: kit.cover?.data?.attributes?.url ?
                                    `${process.env.NEXT_PUBLIC_STRAPI_URL}${kit.cover.data.attributes.url}` :
                                    '/images/covers/default.png',
                                type: 'sound_kit'
                            }))}
                            card='sound_kit'
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
