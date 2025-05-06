"use client";

import React from 'react';
import Image from 'next/image';
import { RiInstagramLine, RiYoutubeLine, RiTiktokLine, RiFacebookLine } from '@remixicon/react';
import { useAuthentication } from '@/core/contexts/authentication';

const ProfileInfo = () => {
    const { currentUser } = useAuthentication();

    const displayName = currentUser?.displayName || (currentUser?.isProducer
        ? currentUser.producerName || `${currentUser?.firstName} ${currentUser?.lastName}`
        : `${currentUser?.firstName} ${currentUser?.lastName}`);

    return (
        <div className='profile-info container text-white p-4'>
            <div className='d-flex align-items-center'>
                <div className='avatar avatar--xl me-4'>
                    <div className='avatar__image'>
                        <Image
                            src={currentUser?.cover || "/images/users/default.png"}
                            alt="Profile"
                            width={160}
                            height={160}
                            className='rounded-circle'
                        />
                    </div>
                </div>
                <div className='profile-details'>
                    <h2 className='mb-2'>{displayName}</h2>
                    <p className='mb-3' style={{maxWidth: '600px'}}>{currentUser?.bio}</p>
                    <div className='social-links d-flex gap-3'>
                        {currentUser?.socialAccounts?.instagram?.connected && (
                            <a href={`https://instagram.com/${currentUser.socialAccounts.instagram.username}`}
                                className='text-white'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <RiInstagramLine className='fs-3' />
                            </a>
                        )}
                        {currentUser?.socialAccounts?.facebook?.connected && (
                            <a href={`https://facebook.com/${currentUser.socialAccounts.facebook.username}`}
                                className='text-white'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <RiFacebookLine className='fs-3' />
                            </a>
                        )}
                        {currentUser?.socialAccounts?.youtube?.connected && (
                            <a href={`https://youtube.com/@${currentUser.socialAccounts.youtube.username}`}
                                className='text-white'
                                target='_blank'
                                rel='noopener noreferrer'>
                                <RiYoutubeLine className='fs-3' />
                            </a>
                        )}
                        {currentUser?.socialAccounts?.tiktok?.connected && (
                            <a href={`https://tiktok.com/@${currentUser.socialAccounts.tiktok.username}`}
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
