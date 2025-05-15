"use client"

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import Section from '@/view/layout/section'
import Tab from '@/core/components/tab'
import { useAuthentication } from '@/core/contexts/authentication'

const UserUploads: React.FC = () => {
    const locale = useTranslations()
    const { currentUser } = useAuthentication()
    const [activeTab, setActiveTab] = useState('samples')

    const tabs = [
        { id: 'samples', name: locale('samples') },
        { id: 'sound_kits', name: locale('sound_kits') }
    ]

    const tracks = currentUser?.tracks?.filter((item:any) => !item.isSoundKit).map((item:any) => ({
        ...item,
        cover: item.cover.url ? process.env.NEXT_PUBLIC_STRAPI_URL + item.cover.url : '/images/cover/default.jpg',
        src: process.env.NEXT_PUBLIC_STRAPI_URL + item.audio.url,
    }))

    return (
        <div className="card-body">
            <h5 className="mb-4 text-black">My Uploads</h5>
            <Tab id="uploads">
                {tabs.map((tab) => (
                    <li key={tab.id} className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                            id={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </button>
                    </li>
                ))}
            </Tab>

            <div className="tab-content mt-4 p-4">
                <div className={`tab-pane fade ${activeTab === 'samples' ? 'show active' : ''}`}>
                    {(currentUser?.tracks?.length || 0) > 0 ? (
                        <Section
                            title=""
                            data={tracks || []}
                            card="track"
                            slideView={4}
                            navigation
                        />
                    ) : (
                        <div className="text-center">
                            <p className="mb-0">{locale('no_samples_uploaded')}</p>
                        </div>
                    )}
                </div>
                <div className={`tab-pane fade ${activeTab === 'sound_kits' ? 'show active' : ''}`}>
                    {(currentUser?.soundKits?.length || 0) > 0 ? (
                        <Section
                            title=""
                            data={currentUser?.soundKits || []}
                            card="track"
                            slideView={4}
                            navigation
                        />
                    ) : (
                        <div className="text-center">
                            <p className="mb-0">{locale('no_sound_kits_uploaded')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserUploads