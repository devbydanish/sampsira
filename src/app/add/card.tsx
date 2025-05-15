"use client"

import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { RiAddLine, RiDeleteBinLine, RiCloseLine } from '@remixicon/react'
import { useAuthentication } from '@/core/contexts/authentication'
import { useTheme } from '@/core/contexts/theme'

// Components
import Tab from '@/core/components/tab'
import SongForm from './form'
import Input from '@/core/components/input'
import Dropzone from '@/core/components/dropzone'
import MultiSelect from '@/core/components/multi-select'

// Constants
import { MOODS } from '@/core/constants/moods'
import { KEYS } from '@/core/constants/keys'

// Types
import { TrackFormData } from './form'

interface SoundKitFormData {
    title: string;
    cover: File | null;
}

interface TrackState {
    id: string;
    title: string;
    audio: File | null;
    bpm: string;
    moods: string[];
    keys: string[];
}

interface UploadedFile {
    id: number;
    url: string;
}

interface FileUploadResponse {
    id: number;
    url: string;
}

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB

const SongCard: React.FC = () => {
    const { replaceClassName } = useTheme()
    const { currentUser, isLoading } = useAuthentication()
    const locale = useTranslations()
    const router = useRouter()

    // Initialize all state and form hooks at the top level
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')
    const [activeTab, setActiveTab] = useState('track')
    const [soundKitCoverPreview, setSoundKitCoverPreview] = useState<string | null>(null)
    const [tracks, setTracks] = useState<TrackState[]>([{
        id: Date.now().toString(),
        title: '',
        audio: null,
        bpm: '',
        moods: [],
        keys: []
    }])

    // Track form for single track upload
    const trackForm = useForm<TrackFormData>({
        mode: 'onChange',
        defaultValues: {
            title: '',
            cover: null,
            audio: null,
            bpm: '',
            moods: [],
            keys: []
        }
    })

    // Sound kit form
    const soundKitForm = useForm<SoundKitFormData>({
        mode: 'onChange',
        defaultValues: {
            title: '',
            cover: null
        }
    })

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push('/auth')
        } else if (!isLoading && !currentUser?.isProducer) {
            router.push('/')
        }
    }, [currentUser, isLoading, router])

    useEffect(() => {
        if (isSubmitting) {
            document.body.style.cursor = 'wait';
        } else {
            document.body.style.cursor = 'default';
        }

        return () => {
            document.body.style.cursor = 'default';
        };
    }, [isSubmitting]);

    if (isLoading) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (!currentUser || !currentUser.isProducer) {
        return null
    }

    const tabs = [
        { id: 'track', name: locale('upload_track') },
        { id: 'sound_kit', name: locale('upload_sound_kit') }
    ]

    const uploadFileToStrapi = async (file: File): Promise<FileUploadResponse> => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            throw new Error('Please log in to upload');
        }

        const formData = new FormData();
        formData.append('files', file);

        const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'File upload failed');
        }

        const data = await response.json();
        return { id: data[0].id, url: data[0].url };
    };

    const handleTrackSubmit = async (formData: TrackFormData) => {
        try {
            setIsSubmitting(true);
            setUploadError(null);
            setUploadStatus('Uploading files...');

            if (!formData.cover || !formData.audio) {
                throw new Error('Cover image and audio file are required');
            }

            // First upload the files
            const [coverUpload, audioUpload] = await Promise.all([
                uploadFileToStrapi(formData.cover),
                uploadFileToStrapi(formData.audio)
            ]);

            setUploadStatus('Creating track...');

            // Then create the track with file IDs
            const token = localStorage.getItem('jwt');
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        title: formData.title,
                        bpm: parseInt(formData.bpm) || 0,
                        moods: formData.moods.join(','),
                        keys: formData.keys.join(','),
                        cover: coverUpload.id,
                        audio: audioUpload.id,
                        producer: currentUser.id
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'Track creation failed');
            }

            localStorage.setItem('settingsTab', 'Uploads');
            router.push('/settings');
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed');
            setUploadStatus('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addTrack = () => {
        setTracks([...tracks, {
            id: Date.now().toString(),
            title: '',
            audio: null,
            bpm: '',
            moods: [],
            keys: []
        }])
    }

    const removeTrack = (id: string) => {
        if (tracks.length > 1) {
            setTracks(tracks.filter(track => track.id !== id))
        }
    }

    const updateTrack = (id: string, field: keyof TrackState, value: any) => {
        setTracks(tracks.map(track =>
            track.id === id ? { ...track, [field]: value } : track
        ))
    }

    const handleSoundKitSubmit = async (data: SoundKitFormData) => {
        try {
            setIsSubmitting(true);
            setUploadError(null);
            setUploadStatus('Uploading files...');

            if (!data.cover) {
                throw new Error('Cover image is required');
            }

            // Validate tracks
            const invalidTracks = tracks.filter(track => 
                !track.audio || 
                !track.title || 
                !track.bpm || 
                track.title.trim().length < 3
            );

            if (invalidTracks.length > 0) {
                throw new Error(`${invalidTracks.length} track(s) have missing or invalid information`);
            }

            // First upload all files
            const coverUpload = await uploadFileToStrapi(data.cover);
            
            const audioUploads = await Promise.all(
                tracks.map(track => track.audio && uploadFileToStrapi(track.audio as File))
            );

            setUploadStatus('Creating sound kit...');

            // Then create the sound kit with file IDs
            const token = localStorage.getItem('jwt');
            
            // First create tracks and store their IDs in array
            const trackUploads = await Promise.all(
                tracks.map(async (track, index) => {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: {
                                title: track.title,
                                bpm: parseInt(track.bpm) || 0,
                                moods: track.moods.join(','),
                                keys: track.keys.join(','),
                                audio: audioUploads[index]?.id,
                                cover: coverUpload.id,
                                producer: currentUser.id
                            }
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.error?.message || 'Track creation failed');
                    }

                    const data = await response.json();
                    return data.data.id;
                })
            );

            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/sound-kits`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        title: data.title,
                        cover: coverUpload.id,
                        tracks: trackUploads,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'Sound kit creation failed');
            }

            localStorage.setItem('settingsTab', 'Uploads');
            router.push('/settings');
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed');
            setUploadStatus('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='card'>
            <div className='card-header'>
                <Tab id='add_music'>
                    {tabs.map((tab) => (
                        <li key={tab.id} className='nav-item' role='presentation'>
                            <button
                                className={classNames('nav-link', activeTab === tab.id && 'active')}
                                id={tab.id}
                                type='button'
                                role='tab'
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.name}
                            </button>
                        </li>
                    ))}
                </Tab>
            </div>
            <div className='card-body'>
                <div className='tab-content'>
                    <div
                        className={classNames(
                            'tab-pane fade',
                            activeTab === 'track' && 'show active'
                        )}
                        id='track_pane'
                        role='tabpanel'
                    >
                        {uploadError && (
                            <div className="alert alert-danger mb-4">
                                {uploadError}
                            </div>
                        )}
                        <form onSubmit={trackForm.handleSubmit(handleTrackSubmit)}>
                            <SongForm
                                attachmentId='song_file_1'
                                register={trackForm.register}
                                control={trackForm.control}
                                watch={trackForm.watch}
                                errors={trackForm.formState.errors}
                                setValue={trackForm.setValue}
                                isSubmitting={isSubmitting}
                            />
                            <div className='mt-4 text-center'>
                                <button
                                    type='submit'
                                    className='btn btn-primary'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                                            {uploadStatus || locale('uploading')}
                                        </>
                                    ) : (
                                        locale('upload_track')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div
                        className={classNames(
                            'tab-pane fade',
                            activeTab === 'sound_kit' && 'show active'
                        )}
                        id='sound_kit_pane'
                        role='tabpanel'
                    >
                        {uploadError && (
                            <div className="alert alert-danger mb-4">
                                {uploadError}
                            </div>
                        )}
                        <form onSubmit={soundKitForm.handleSubmit(handleSoundKitSubmit)}>
                            <div className="row g-4">
                                <div className='col-12'>
                                    <label className='form-label'>{locale('sound_kit_title')}</label>
                                    <Input
                                        type='text'
                                        placeholder={locale('sound_kit_title')}
                                        className={classNames(
                                            'form-control',
                                            soundKitForm.formState.errors.title && 'is-invalid'
                                        )}
                                        {...soundKitForm.register('title', {
                                            required: 'Sound kit title is required',
                                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                                        })}
                                    />
                                </div>
                                <div className='col-12'>
                                    <label className='form-label'>{locale('cover_image')}</label>
                                    <div className="position-relative">
                                        <Dropzone
                                            title={soundKitForm.watch('cover') ? '' : locale('drag_and_drop')}
                                            accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                                            maxFiles={1}
                                            disabled={isSubmitting}
                                            onDrop={(acceptedFiles) => {
                                                if (acceptedFiles[0]) {
                                                    soundKitForm.setValue('cover', acceptedFiles[0])
                                                }
                                            }}
                                        >
                                            {soundKitForm.watch('cover') && (
                                                <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center">
                                                    <div className="text-center">
                                                        <img 
                                                            src={URL.createObjectURL(soundKitForm.watch('cover')!)} 
                                                            alt="Cover preview" 
                                                            className="img-thumbnail mb-2" 
                                                            style={{ maxHeight: '100px', maxWidth: '100px' }} 
                                                        />
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <small className="text-muted me-2">{soundKitForm.watch('cover')!.name}</small>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    soundKitForm.setValue('cover', null)
                                                                }}
                                                            >
                                                                <RiCloseLine />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Dropzone>
                                    </div>
                                </div>
                                {tracks.map((track, index) => (
                                    <div key={track.id} className="col-12 border rounded p-3 position-relative">
                                        {tracks.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                                                onClick={() => removeTrack(track.id)}
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                        )}
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label">{`${locale('track_title')} ${index + 1}`}</label>
                                                <Input
                                                    type="text"
                                                    placeholder={locale('track_title')}
                                                    value={track.title}
                                                    onChange={(e) => updateTrack(track.id, 'title', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">{locale('audio_file')}</label>
                                                <div className="position-relative">
                                                    <Dropzone
                                                        title={track.audio ? '' : locale('drag_and_drop')}
                                                        accept={{ 'audio/*': ['.mp3', '.wav'] }}
                                                        maxFiles={1}
                                                        disabled={isSubmitting}
                                                        onDrop={(acceptedFiles) => {
                                                            if (acceptedFiles[0]) {
                                                                updateTrack(track.id, 'audio', acceptedFiles[0])
                                                            }
                                                        }}
                                                        style={{ height: '150px' }}
                                                    >
                                                        {track.audio && (
                                                            <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center">
                                                                <div className="text-center">
                                                                    <div className="mb-2">
                                                                        <i className="ri-music-2-line ri-2x text-primary"></i>
                                                                    </div>
                                                                    <div className="d-flex align-items-center justify-content-center">
                                                                        <small className="text-muted me-2">
                                                                            {(track.audio as File).name} ({Math.round((track.audio as File).size / (1024 * 1024))}MB)
                                                                        </small>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                updateTrack(track.id, 'audio', null)
                                                                            }}
                                                                        >
                                                                            <RiCloseLine />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Dropzone>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">BPM</label>
                                                <Input
                                                    type="number"
                                                    placeholder="BPM"
                                                    value={track.bpm}
                                                    onChange={(e) => updateTrack(track.id, 'bpm', e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">{locale('moods')}</label>
                                                <MultiSelect
                                                    options={MOODS}
                                                    placeholder={locale('select_moods')}
                                                    selected={track.moods}
                                                    onChange={(selected: string[]) => updateTrack(track.id, 'moods', selected)}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label">{locale('keys')}</label>
                                                <MultiSelect
                                                    options={KEYS}
                                                    placeholder={locale('select_keys')}
                                                    selected={track.keys}
                                                    onChange={(selected: string[]) => updateTrack(track.id, 'keys', selected)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-12">
                                    <button
                                        type="button"
                                        className="btn btn-light-primary w-100"
                                        onClick={addTrack}
                                    >
                                        <RiAddLine className="me-2" />
                                        {locale('add_track')}
                                    </button>
                                </div>
                                <div className="col-12 text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                {uploadStatus || locale('uploading')}
                                            </>
                                        ) : (
                                            locale('upload_sound_kit')
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SongCard
