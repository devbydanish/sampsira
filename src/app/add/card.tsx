"use client"

import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { RiAddLine, RiDeleteBinLine } from '@remixicon/react'
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

    const handleTrackSubmit = async (formData: TrackFormData) => {
        try {
            setIsSubmitting(true)
            setUploadError(null)
            setUploadStatus('Validating files...')

            if (!formData.cover || !formData.audio) {
                throw new Error('Cover image and audio file are required')
            }

            if (formData.cover.size > MAX_FILE_SIZE || formData.audio.size > MAX_FILE_SIZE) {
                throw new Error('File size exceeds maximum allowed')
            }

            const token = localStorage.getItem('jwt')
            if (!token) {
                throw new Error('Please log in to upload')
            }

            const uploadData = new FormData()
            uploadData.append('files.cover', formData.cover)
            uploadData.append('files.audio', formData.audio)
            uploadData.append('data', JSON.stringify({
                title: formData.title,
                bpm: formData.bpm,
                moods: formData.moods,
                keys: formData.keys,
                publishedAt: null
            }))

            setUploadStatus('Uploading...')
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            localStorage.setItem('settingsTab', 'Uploads')
            router.push('/settings')
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Upload failed')
            setUploadStatus('')
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        <form onSubmit={soundKitForm.handleSubmit(async (data) => {
                            try {
                                setIsSubmitting(true);
                                setUploadError(null);
                                setUploadStatus('Validating files...');

                                if (!data.cover) {
                                    throw new Error('Cover image is required');
                                }

                                if (tracks.some(track => !track.audio || !track.title)) {
                                    throw new Error('All tracks must have audio files and titles');
                                }

                                const token = localStorage.getItem('jwt');
                                if (!token) {
                                    throw new Error('Please log in to upload');
                                }

                                const uploadData = new FormData();
                                uploadData.append('files.cover', data.cover);
                                tracks.forEach((track, index) => {
                                    uploadData.append(`files.audio_${index}`, track.audio as File);
                                });

                                uploadData.append('data', JSON.stringify({
                                    title: data.title,
                                    tracks: tracks.map(track => ({
                                        title: track.title,
                                        bpm: track.bpm,
                                        moods: track.moods,
                                        keys: track.keys
                                    })),
                                    publishedAt: null
                                }));

                                setUploadStatus('Uploading...');
                                const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks/sound-kit`, {
                                    method: 'POST',
                                    headers: { 'Authorization': `Bearer ${token}` },
                                    body: uploadData
                                });

                                if (!response.ok) {
                                    throw new Error('Upload failed');
                                }

                                localStorage.setItem('settingsTab', 'Uploads');
                                router.push('/settings');
                            } catch (error) {
                                setUploadError(error instanceof Error ? error.message : 'Upload failed');
                                setUploadStatus('');
                            } finally {
                                setIsSubmitting(false);
                            }
                        })}>
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
                                    <Dropzone
                                        title={locale('drag_and_drop')}
                                        accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                                        maxFiles={1}
                                        disabled={isSubmitting}
                                        onDrop={(acceptedFiles) => {
                                            if (acceptedFiles[0]) {
                                                soundKitForm.setValue('cover', acceptedFiles[0])
                                            }
                                        }}
                                    />
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
                                                <Dropzone
                                                    title={locale('drag_and_drop')}
                                                    accept={{ 'audio/*': ['.mp3', '.wav'] }}
                                                    maxFiles={1}
                                                    disabled={isSubmitting}
                                                    onDrop={(acceptedFiles) => {
                                                        if (acceptedFiles[0]) {
                                                            updateTrack(track.id, 'audio', acceptedFiles[0])
                                                        }
                                                    }}
                                                    style={{ height: '150px' }}
                                                />
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
