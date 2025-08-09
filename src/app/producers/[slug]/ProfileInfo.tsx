"use client";

import React from 'react';
import Image from 'next/image';
import { RiInstagramLine, RiYoutubeLine, RiTiktokLine, RiFacebookLine } from '@remixicon/react';
import { ProducerTypes } from '@/core/types';

interface ProducerWithDetails extends ProducerTypes {
    bio?: string;
    socialAccounts?: {
        instagram?: { connected: boolean; username: string };
        facebook?: { connected: boolean; username: string };
        youtube?: { connected: boolean; username: string };
        tiktok?: { connected: boolean; username: string };
    };
}

interface ProfileInfoProps {
    producer: ProducerWithDetails;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ producer }) => {
    return (
        <div className='profile-info container text-white p-4'>
            <div className='d-flex align-items-center'>
                <div className='avatar avatar--xl me-4'>
                    <div className='avatar__image'>
                        <Image
                            src={producer.cover || "/images/users/default.jpg"}
                            alt="Profile"
                            width={160}
                            height={160}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%'
                            }}
                        />
                    </div>
                </div>
                <div className='profile-details'>
                    <h2 className='mb-2'>{producer.displayName}</h2>
                    <p className='mb-3' style={{maxWidth: '600px'}}>{producer.bio}</p>
                    <div className='social-links d-flex gap-3'>
                        {producer.socialAccounts?.instagram?.connected && (
                            <a href={`https://instagram.com/${producer.socialAccounts.instagram.username}`}
                                className='text-white'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <RiInstagramLine className='fs-3' />
                            </a>
                        )}
                        {producer.socialAccounts?.facebook?.connected && (
                            <a href={`https://facebook.com/${producer.socialAccounts.facebook.username}`}
                                className='text-white'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <RiFacebookLine className='fs-3' />
                            </a>
                        )}
                        {producer.socialAccounts?.youtube?.connected && (
                            <a href={`https://youtube.com/@${producer.socialAccounts.youtube.username}`}
                                className='text-white'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <RiYoutubeLine className='fs-3' />
                            </a>
                        )}
                        {producer.socialAccounts?.tiktok?.connected && (
                            <a href={`https://tiktok.com/@${producer.socialAccounts.tiktok.username}`}
                                className='text-white'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <RiTiktokLine className='fs-3' />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
