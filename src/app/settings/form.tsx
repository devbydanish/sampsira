/**
 * @name ProfileForm
 * @file form.tsx
 * @description profile form component with tabbed interface
 */
"use client"

// Modules
import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { RiInstagramLine, RiFacebookCircleLine, RiYoutubeLine, RiTiktokLine, RiAlertLine } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'
import { useAuthentication } from '@/core/contexts/authentication'

// Components
import Input from '@/core/components/input'
import ErrorHandler from '@/core/components/error'
import UserUploads from './uploads'


// Utilities
import { ProfileTypes, SocialMediaAccountType } from '@/core/types'

const ProfileForm: React.FC = () => {
    const { replaceClassName } = useTheme()
    const { currentUser } = useAuthentication()
    const locale = useTranslations()
    type ActiveTab = 'Edit Profile' | 'Account Security' | 'Subscription Plan' | 'Delete Account' | 'My Uploads';
    const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
        if (typeof window !== 'undefined') {
            const storedTab = localStorage.getItem('settingsTab')
            if (storedTab === 'My Uploads') {
                localStorage.removeItem('settingsTab')
                return storedTab as ActiveTab
            }
        }
        return 'Edit Profile'
    })
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [socialAccounts, setSocialAccounts] = useState<{[key: string]: SocialMediaAccountType}>({
        instagram: { platform: 'instagram', connected: false, username: '', profileUrl: '' },
        facebook: { platform: 'facebook', connected: false, username: '', profileUrl: '' },
        youtube: { platform: 'youtube', connected: false, username: '', profileUrl: '' },
        tiktok: { platform: 'tiktok', connected: false, username: '', profileUrl: '' }
    })
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>(currentUser?.img ? process.env.NEXT_PUBLIC_STRAPI_URL + currentUser?.img?.url : '/images/users/default.png');

    // Initialize social accounts from currentUser if available
    useEffect(() => {
        if (currentUser?.socialAccounts) {
            setSocialAccounts(prevAccounts => ({
                ...prevAccounts,
                ...currentUser?.socialAccounts
            }));
        }
    }, [currentUser]);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            if (!currentUser) {
                console.error('No user logged in');
                return;
            }
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/request-deletion`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${currentUser.jwt}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    email: currentUser.email,
                    currentBalance: currentUser.balance,
                }),
            });
    
            if (response.ok) {
                alert("A confirmation email has been sent. Check your inbox to proceed.");
                setShowDeleteModal(false);
                setDeleteConfirmation('');
            } else {
                const errorData = await response.json();
                console.error('Error requesting deletion:', errorData.message || 'Unknown error');
                alert('Failed to send confirmation email. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors }
    } = useForm<ProfileTypes>({
        defaultValues: {
            image: currentUser?.img || '/images/users/default.png',
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            displayName: currentUser?.displayName || '',
            username: currentUser?.username || '',
            bio: currentUser?.bio || '',
        }
    })

    // Effect to update form when currentUser changes
    // useEffect(() => {
    //     if (currentUser) {
    //         reset({
    //             image: currentUser?.cover || '/images/users/default.png',
    //             firstName: currentUser?.firstName || '',
    //             lastName: currentUser?.lastName || '',
    //             displayName: currentUser?.displayName || '',
    //             username: currentUser?.username || '',
    //             bio: currentUser?.bio || '',
    //         });
    //     }
    // }, [currentUser, reset]);

    const handleCancel = () => {
        reset({
            image: currentUser?.cover || '/images/users/default.png',
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName || '',
            displayName: currentUser?.displayName || '',
            username: currentUser?.username || '',
            bio: currentUser?.bio || '',
        });
        setIsEditing(false);
    }

    // Update form values when editing mode changes
    useEffect(() => {
        if (!isEditing) {
            reset({
                image: currentUser?.cover || '/images/users/default.png',
                firstName: currentUser?.firstName || '',
                lastName: currentUser?.lastName || '',
                displayName: currentUser?.displayName || '',
                username: currentUser?.username || '',
                bio: currentUser?.bio || '',
            });
        }
    }, [isEditing, currentUser, reset]);

    const tabs: Array<{ id: string, name: ActiveTab }> = [
        { id: 'edit_profile', name: 'Edit Profile' },
        { id: 'uploads', name: 'My Uploads' }, // Renamed and moved below Edit Profile
        { id: 'account_security', name: 'Account Security' },
        { id: 'subscription_plan', name: 'Subscription Plan' },
        { id: 'delete_account', name: 'Delete Account' },
    ]

    const handleTabClick = (tabName: ActiveTab) => {
        setActiveTab(tabName)
    }

    const closeDeleteModal = () => {
        setShowDeleteModal(false)
        setDeleteConfirmation('')
    }

    const handleImageUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('files', file);

            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const uploadData = await uploadResponse.json();
            return uploadData[0].id; // Return the URL of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedImage(file);
            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const submitForm = async (data: ProfileTypes) => {
        try {
            if (currentUser) {
                let imageUrl;

                // If there's a new image uploaded, process it first
                if (uploadedImage) {
                    imageUrl = await handleImageUpload(uploadedImage);
                }

                console.log('Submitting profile update:', { ...data, image: imageUrl });
                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        username: data.username,
                        displayName: data.displayName,
                        bio: data.bio,
                        img: imageUrl
                    }),
                });
    
                const responseData = await response.json();
                console.log('Response:', responseData);
    
                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to update profile');
                }
    
                // Update localStorage
                const updatedUser = {
                    ...currentUser,
                    ...responseData
                };
                
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setIsEditing(false);
                setUploadedImage(null);
                reset({
                    image: responseData.cover || '/images/users/default.png',
                    firstName: responseData.firstName || '',
                    lastName: responseData.lastName || '',
                    displayName: responseData.displayName || '',
                    username: responseData.username || '',
                    bio: responseData.bio || '',
                });
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error instanceof Error) {
                alert(error.message || 'Failed to update profile. Please try again.');
            } else {
                alert('Failed to update profile. Please try again.');
            }
        }
    };

    const handleSocialConnect = async (platform: 'instagram' | 'facebook' | 'youtube' | 'tiktok', username: string, profileUrl: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/connect-social`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${currentUser?.jwt}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        platform,
                        username,
                        profileUrl,
                    }),
                }
            );
        
            if (response.ok) {
                // Update local state
                const updatedSocialAccounts = {
                    ...socialAccounts,
                    [platform]: {
                        platform,
                        connected: true,
                        username,
                        profileUrl
                    }
                };
                
                setSocialAccounts(updatedSocialAccounts);
                
                // Update currentUser in localStorage to persist the change
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        socialAccounts: {
                            ...(currentUser.socialAccounts || {}),
                            [platform]: {
                                platform,
                                connected: true,
                                username,
                                profileUrl
                            }
                        }
                    };
                    
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }
                
                alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
            }
        } catch (error) {
            console.error(`Error connecting ${platform}:`, error);
        }
    };

    const handleSocialLink = async (platform: 'instagram' | 'facebook' | 'youtube' | 'tiktok') => {
        const config = {
            instagram: {
            clientId: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
            redirectUri: process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI,
            scope: 'instagram_basic,email'
            },
            facebook: {
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
            redirectUri: `${window.location.origin}/auth/facebook/callback`,
            scope: 'public_profile,email'
            },
            youtube: {
            clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
            redirectUri: `${window.location.origin}/auth/youtube/callback`,
            scope: 'https://www.googleapis.com/auth/youtube.readonly'
            },
            tiktok: {
            clientId: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID,
            redirectUri: `${window.location.origin}/auth/tiktok/callback`,
            scope: 'user.info.basic'
            }
        };
        
        if (!socialAccounts[platform].connected) {
            const { clientId, redirectUri, scope } = config[platform];
            const state = Math.random().toString(36).substring(7);
            
            localStorage.setItem('oauth_state', state);
            localStorage.setItem('oauth_platform', platform);
        
            if (!clientId || !redirectUri) {
                console.error('Missing OAuth configuration for', platform);
                alert(`OAuth configuration missing for ${platform}. Please check your environment variables.`);
                return;
            }

            const authUrl = platform === 'instagram'
                ? `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`
                : platform === 'facebook'
                ? `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`
                : platform === 'youtube'
                ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`
                : `https://www.tiktok.com/auth/authorize?client_key=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;
        
            window.location.href = authUrl;
        } else {
            // Handle unlinking
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/disconnect-social`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${currentUser?.jwt}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ platform }),
                    }
                );
                
                if (response.ok) {
                    // Update local state
                    const updatedSocialAccounts = {
                        ...socialAccounts,
                        [platform]: { 
                            platform,
                            connected: false, 
                            username: '', 
                            profileUrl: '' 
                        }
                    };
                    
                    setSocialAccounts(updatedSocialAccounts);
                    
                    // Update user in localStorage
                    if (currentUser && currentUser.socialAccounts) {
                        const updatedUser = {
                            ...currentUser,
                            socialAccounts: {
                                ...currentUser.socialAccounts,
                                [platform]: {
                                    platform,
                                    connected: false,
                                    username: '',
                                    profileUrl: ''
                                }
                            }
                        };
                        
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                    }
                    
                    alert(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected successfully!`);
                }
            } catch (error) {
                console.error(`Error disconnecting ${platform}:`, error);
            }
        }
    };

    const sendEmailConfirmation = async (newEmail: string) => {
        try {
            if (!currentUser) {
                console.error('No user logged in');
                return;
            }
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/send-email-confirmation`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${currentUser.jwt}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    newEmail,
                }),
            });
    
            if (response.ok) {
                alert('A confirmation email has been sent to your new email address. Please check your inbox.');
            } else {
                const errorData = await response.json();
                console.error('Error sending confirmation email:', errorData.message || 'Unknown error');
                alert('Failed to send confirmation email. Please try again.');
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        }
    };

    const [passwordError, setPasswordError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validatePassword = (password: string, confirmation: string): string | null => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        if (password !== confirmation) {
            return 'Passwords do not match';
        }
        return null;
    };

    const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string, form: HTMLFormElement) => {
        const error = validatePassword(newPassword, confirmPassword);
        if (error) {
            setPasswordError(error);
            return;
        }
        setPasswordError('');
        setIsSubmitting(true);
        try {
            if (!currentUser) {
                console.error('No user logged in');
                alert('You must be logged in to change your password.');
                return;
            }
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentUser?.jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: newPassword,
                    confirmPassword: newPassword,
                    currentPassword: currentPassword,
                    identifier: currentUser?.email
                }),
            });
    
            // Debug logging
            console.log('Change password request:', {
                url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/change-password`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentUser?.jwt}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    currentPassword: '[REDACTED]',
                    password: '[REDACTED]',
                    confirmPassword: '[REDACTED]',
                    identifier: currentUser?.email
                }
            });

            if (!currentUser?.email || !currentUser?.jwt) {
                alert('User credentials are missing. Please try logging in again.');
                return;
            }

            try {
                const responseData = await response.json();
                if (response.ok) {
                    setPasswordError('');
                    alert('Password changed successfully!');
                    form.reset();
                } else {
                    console.error('Error changing password:', responseData);
                    if (responseData.error?.message === 'Invalid credentials. User not found.') {
                        setPasswordError('Invalid credentials. Please try logging in again.');
                    } else if (responseData.error?.message === 'Current password is incorrect') {
                        setPasswordError('Current password is incorrect. Please try again.');
                    } else {
                        setPasswordError('Failed to change password. Please try again.');
                    }
                }
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                if (response.status === 405) {
                    setPasswordError('This operation is not allowed. Please check your permissions.');
                } else if (response.status === 401) {
                    setPasswordError('Authentication failed. Please log in again.');
                } else {
                    setPasswordError('An unexpected error occurred. Please try again.');
                }
            } finally {
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please check your connection and try again.');
        }
    };

    // Fetch user's tracks and sound kits
    useEffect(() => {
        const fetchUploads = async () => {
            if (currentUser) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate[0]=tracks&populate[1]=soundKits`, {
                        headers: {
                            'Authorization': `Bearer ${currentUser.jwt}`
                        }
                    });
                    const data = await response.json();
                    
                    // Update user data in localStorage with tracks and sound kits
                    const updatedUser = {
                        ...currentUser,
                        tracks: data.tracks || [],
                        soundKits: data.soundKits || []
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } catch (error) {
                    console.error('Error fetching uploads:', error);
                }
            }
        };
        
        fetchUploads();
    }, [currentUser]);

    return (
        <div className={replaceClassName('d-flex flex-column flex-md-row w-100')}>
            {/* Sidebar with Tabs */}
            <div className={replaceClassName('w-25 w-md-20 pe-md-3 mb-4 mb-md-0')}>
                <ul className='nav flex-md-column' role='tablist'>
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className='nav-item'
                            role='presentation'
                        >
                            <button
                                className={classNames(
                                    'nav-link w-100 text-start',
                                    activeTab === tab.name && 'active'
                                )}
                                id={tab.id}
                                type='button'
                                role='tab'
                                aria-selected={activeTab === tab.name}
                                onClick={() => handleTabClick(tab.name)}
                            >
                                {tab.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content Area */}
            <div className={replaceClassName('w-100 w-md-80 ps-md-3')}>
                {activeTab === 'Edit Profile' && (
                    <div className='card'>
                        <div className='card-body'>
                            <form
                                className={replaceClassName('px-4 pt-4 mb-3 my-sm-0 w-100')}
                                onSubmit={handleSubmit(submitForm)}
                            >
                                <div className='row mb-4'>
                                    <div className='col-12 mb-4'>
                                        <div className='d-flex align-items-center gap-4 flex-wrap'>
                                            <div className='profile-image-section'>
                                                <div className='avatar avatar--xl mb-2'>
                                                    <div className='avatar__image'>
                                                        <Image
                                                            src={previewImage}
                                                            className='img-fluid'
                                                            width={128}
                                                            height={128}
                                                            alt='User avatar'
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-3 d-flex gap-2">
                                                    <input
                                                        type='file'
                                                        id='profile'
                                                        className='d-none'
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    <label
                                                        htmlFor='profile'
                                                        className='btn btn-primary'
                                                        style={{ color: '#ffffff' }}
                                                    >
                                                        {locale('change_profile_image')}
                                                    </label>
                                                    {currentUser?.cover && currentUser.cover !== "/images/users/default.png" && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger"
                                                            onClick={() => {
                                                                setPreviewImage("/images/users/default.png");
                                                                setUploadedImage(null);
                                                                const updatedUser = {
                                                                    ...currentUser,
                                                                    cover: "/images/users/default.png"
                                                                };
                                                                localStorage.setItem("user", JSON.stringify(updatedUser));
                                                            }}
                                                        >
                                                            {locale('remove_profile_image')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        <div className='row g-4'>
                            <div className='col-sm-6'>
                                <Input
                                    label="First Name"
                                    id='firstName'
                                    className={classNames(
                                        'form-control',
                                        errors?.firstName && 'is-invalid'
                                    )}
                                    disabled={!isEditing}
                                    {...register('firstName', {required: true})}
                                />
                                {<ErrorHandler root={errors?.firstName as any} />}
                            </div>
                                <div className='col-sm-6'>
                                    <Input
                                    label="Last Name"
                                    id='lastName'
                                    className={classNames(
                                        'form-control',
                                        errors?.lastName && 'is-invalid'
                                    )}
                                    disabled={!isEditing}
                                    {...register('lastName', {required: true})}
                                />
                                {<ErrorHandler root={errors?.lastName as any} />}
                            </div>
                            <div className='col-sm-6'>
                                <Input
                                    label={locale('display_name')}
                                    id='d_name'
                                    className={classNames(
                                        'form-control',
                                        errors?.displayName && 'is-invalid'
                                    )}
                                    disabled={!isEditing}
                                    {...register('displayName', {required: true})}
                                />
                                {<ErrorHandler root={errors?.displayName as any} />}
                            </div>
                            <div className='col-sm-6'>
                                <Input
                                    label={locale('username')}
                                    id='username'
                                    className={classNames(
                                        'form-control',
                                        errors?.username && 'is-invalid'
                                    )}
                                    disabled={!isEditing}
                                    {...register('username', {required: true})}
                                />
                                {<ErrorHandler root={errors?.username as any} />}
                            </div>
                            <div className='col-12'>
                                <div style={{minHeight: 100}}>
                                    <Input
                                        as='textarea'
                                        label={locale('bio')}
                                        id='bio'
                                        className='form-control'
                                        placeholder='Write here...'
                                        disabled={!isEditing}
                                        {...register('bio')}
                                    />
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    {!isEditing ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            style={{ color: '#ffffff' }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsEditing(true);
                                            }}
                                        >
                                            {locale('edit_profile_info')}
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                style={{ color: '#ffffff' }}
                                            >
                                                {locale('save')}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleCancel();
                                                }}
                                            >
                                                {locale('cancel')}
                                            </button>
                                        </>
                                    )}
                                </div>
        
                            </div>

                            {/* Connected Accounts Section */}
                            <div className='col-12'>
                                <h5 className='mb-4 text-dark'>{locale('settings.connected_accounts')}</h5>
                                <ul className='list-group list-group-flush'>
                                    <li className='list-group-item d-flex justify-content-between align-items-center py-3'>
                                        <div className='d-flex align-items-center'>
                                            <RiInstagramLine className='fs-2 me-2' />
                                            <span>{locale('social_media.instagram')}</span>
                                        </div>
                                        <button
                                            type='button'
                                            className={`btn ${socialAccounts.instagram.connected ? 'btn-danger' : 'btn-primary'}`}
                                            style={!socialAccounts.instagram.connected ? { color: '#ffffff' } : undefined}
                                            onClick={() => handleSocialLink('instagram')}
                                        >
                                            {socialAccounts.instagram.connected ?
                                                locale('social_media.unlink_account') :
                                                locale('social_media.link_account')}
                                        </button>
                                    </li>
                                    <li className='list-group-item d-flex justify-content-between align-items-center py-3'>
                                        <div className='d-flex align-items-center'>
                                            <RiFacebookCircleLine className='fs-2 me-2' />
                                            <span>{locale('social_media.facebook')}</span>
                                        </div>
                                        <button
                                            type='button'
                                            className={`btn ${socialAccounts.facebook.connected ? 'btn-danger' : 'btn-primary'}`}
                                            style={!socialAccounts.facebook.connected ? { color: '#ffffff' } : undefined}
                                            onClick={() => handleSocialLink('facebook')}
                                        >
                                            {socialAccounts.facebook.connected ?
                                                locale('social_media.unlink_account') :
                                                locale('social_media.link_account')}
                                        </button>
                                    </li>
                                    <li className='list-group-item d-flex justify-content-between align-items-center py-3'>
                                        <div className='d-flex align-items-center'>
                                            <RiYoutubeLine className='fs-2 me-2' />
                                            <span>{locale('social_media.youtube')}</span>
                                        </div>
                                        <button
                                            type='button'
                                            className={`btn ${socialAccounts.youtube.connected ? 'btn-danger' : 'btn-primary'}`}
                                            style={!socialAccounts.youtube.connected ? { color: '#ffffff' } : undefined}
                                            onClick={() => handleSocialLink('youtube')}
                                        >
                                            {socialAccounts.youtube.connected ?
                                                locale('social_media.unlink_account') :
                                                locale('social_media.link_account')}
                                        </button>
                                    </li>
                                    <li className='list-group-item d-flex justify-content-between align-items-center py-3'>
                                        <div className='d-flex align-items-center'>
                                            <RiTiktokLine className='fs-2 me-2' />
                                            <span>{locale('social_media.tiktok')}</span>
                                        </div>
                                        <button
                                            type='button'
                                            className={`btn ${socialAccounts.tiktok.connected ? 'btn-danger' : 'btn-primary'}`}
                                            style={!socialAccounts.tiktok.connected ? { color: '#ffffff' } : undefined}
                                            onClick={() => handleSocialLink('tiktok')}
                                        >
                                            {socialAccounts.tiktok.connected ?
                                                locale('social_media.unlink_account') :
                                                locale('social_media.link_account')}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
                </div>
                )}

                {activeTab === 'My Uploads' && (
                    <div className='card'>
                        <div className='card-body'>
                            <UserUploads />
                        </div>
                    </div>
                )}

                {activeTab === 'Account Security' && (
                    <div>
                        <div className='card'>
                            <div className='card-body'>
                                <h5 className='mb-4 text-dark'>Change Email Address</h5>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const newEmail = (e.target as any).newEmail.value;
                                        sendEmailConfirmation(newEmail);
                                    }}
                                >
                                    <div className='mb-3'>
                                        <label htmlFor='currentEmail' className='form-label'>
                                            Current Email Address
                                        </label>
                                        <input
                                            type='email'
                                            className='form-control'
                                            id='currentEmail'
                                            value={currentUser?.email || ''}
                                            disabled
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='newEmail' className='form-label'>
                                            New Email Address
                                        </label>
                                        <input
                                            type='email'
                                            className='form-control'
                                            id='newEmail'
                                            placeholder='Enter new email address'
                                            required
                                        />
                                    </div>
                                    <button type='submit' className='btn btn-primary' style={{ color: '#ffffff' }}>
                                        Update Email
                                    </button>
                                </form>

                                <hr className='my-5' />

                                <h5 className='mb-4 text-dark'>Change Password</h5>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const currentPassword = (e.target as any).currentPassword.value;
                                        const newPassword = (e.target as any).newPassword.value;
                                        const confirmPassword = (e.target as any).confirmPassword.value;

                                        if (newPassword !== confirmPassword) {
                                            alert('New password and confirmation password do not match.');
                                            return;
                                        }

                                        changePassword(currentPassword, newPassword, confirmPassword, e.currentTarget);
                                    }}
                                >
                                    <div className='mb-3'>
                                        <label htmlFor='currentPassword' className='form-label'>
                                            Current Password
                                        </label>
                                        <input
                                            type='password'
                                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                            id='currentPassword'
                                            placeholder='Enter current password'
                                            minLength={6}
                                            required
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='newPassword' className='form-label'>
                                            New Password
                                        </label>
                                        <input
                                            type='password'
                                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                            id='newPassword'
                                            placeholder='Enter new password'
                                            minLength={6}
                                            required
                                        />
                                        <div className='form-text'>
                                            Password must be at least 6 characters long
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='confirmPassword' className='form-label'>
                                            Confirm New Password
                                        </label>
                                        <input
                                            type='password'
                                            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                                            id='confirmPassword'
                                            placeholder='Confirm new password'
                                            minLength={6}
                                            required
                                        />
                                        {passwordError && (
                                            <div className='invalid-feedback'>
                                                {passwordError}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        style={{ color: '#ffffff' }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Updating Password...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Subscription Plan' && (
                    <div className='card'>
                        <div className='card-body'>
                        <h5 className='mb-4 text-dark'>Subscription Plan</h5>
                            <p>Manage your subscription plan here.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'Delete Account' && (
                    <div className='card'>
                        <div className='card-body'>
                            <div className='d-flex align-items-center mb-4'>
                                <div>
                                    <h5 className='text-dark mb-4'>Delete Account</h5>
                                    <p className='mb-0'>
                                    <RiAlertLine className='fs-1 text-danger me-2' />
                                    <strong className='text-danger'>WARNING!</strong> <br /> This action cannot be undone. All your data will be permanently deleted.
                                    </p>
                                </div>
                            </div>
                            <button
                                className='btn btn-danger'
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                )}

                {/* Delete Account Confirmation Modal */}
                {showDeleteModal && (
                    <div
                        className='modal show d-block'
                        tabIndex={-1}
                        style={{ zIndex: 1050, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                closeDeleteModal()
                            }
                        }}
                    >
                        <div className='modal-dialog modal-dialog-centered'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className='modal-title text-dark'>Confirm Account Deletion</h5>
                                    <button
                                        type='button'
                                        className='btn-close'
                                        onClick={closeDeleteModal}
                                    />
                                </div>
                                <div className='modal-body'>
                                    <p>Are you absolutely sure you want to delete your account? This action cannot be undone, and you will lose access to:</p>
                                    <ul className='list-unstyled mb-4'>
                                        <li>• <strong>Your profile and personal information</strong></li>
                                        <li>• <strong>Your uploaded samples and sound kits</strong></li>
                                        <li>• <strong>Your purchase history and analytics</strong></li>
                                        <li>• <strong>Your total earnings and the ability to withdraw funds</strong></li>
                                    </ul>
                                    <p className="text-danger">
                                        ⚠️ <strong>Important:</strong> If you have earnings in your account, they will be permanently lost upon deletion. 
                                        We strongly recommend withdrawing your funds before proceeding. If you have not yet reached the withdrawal 
                                        threshold, consider waiting until you do so to avoid losing your balance.
                                    </p>
                                    <div className='form-group'>
                                        <label className='form-label'>Type "delete account" to confirm:</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            value={deleteConfirmation}
                                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                                            placeholder='delete account'
                                        />
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <button
                                        type='button'
                                        className='btn btn-secondary'
                                        onClick={closeDeleteModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='button'
                                        className='btn btn-danger'
                                        onClick={handleDeleteAccount}
                                        disabled={deleteConfirmation.toLowerCase() !== 'delete account'}
                                    >
                                        Yes, Delete My Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

ProfileForm.displayName = 'ProfileForm';
export default ProfileForm;
