"use client"

import React from 'react'
import classNames from 'classnames'
import { Control, UseFormRegister, UseFormWatch, FormState, UseFormSetValue } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { RiCloseLine } from '@remixicon/react'
import Input from '@/core/components/input'
import Dropzone from '@/core/components/dropzone'
import MultiSelect from '@/core/components/multi-select'
import { MOODS } from '@/core/constants/moods'
import { KEYS } from '@/core/constants/keys'

export interface TrackFormData {
    title: string;
    cover: File | null;
    audio: File | null;
    bpm: string;
    moods: string[];
    keys: string[];
}

interface SongFormProps {
    attachmentId: string;
    register: UseFormRegister<TrackFormData>;
    control: Control<TrackFormData>;
    watch: UseFormWatch<TrackFormData>;
    errors: FormState<TrackFormData>['errors'];
    setValue: UseFormSetValue<TrackFormData>;
    isSubmitting: boolean;
}

const SongForm: React.FC<SongFormProps> = ({
    attachmentId,
    register,
    control,
    watch,
    errors,
    setValue,
    isSubmitting
}) => {
    const locale = useTranslations()
    const coverFile = watch('cover')
    const audioFile = watch('audio')

    const handleCoverDelete = () => {
        setValue('cover', null)
    }

    const handleAudioDelete = () => {
        setValue('audio', null)
    }

    return (
        <div className='row g-4'>
            <div className='col-12'>
                <label className='form-label'>{locale('track_title')}</label>
                <Input
                    type='text'
                    placeholder={locale('track_title')}
                    className={classNames(
                        'form-control',
                        errors.title && 'is-invalid'
                    )}
                    {...register('title', {
                        required: 'Track title is required',
                        minLength: { value: 3, message: 'Title must be at least 3 characters' }
                    })}
                />
                {errors.title && (
                    <div className='invalid-feedback'>{errors.title.message}</div>
                )}
            </div>

            <div className='col-12'>
                <label className='form-label'>{locale('cover_image')}</label>
                <div className="position-relative">
                    <Dropzone
                        title={coverFile ? '' : locale('drag_and_drop')}
                        accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                        maxFiles={1}
                        disabled={isSubmitting}
                        onDrop={(acceptedFiles) => {
                            if (acceptedFiles[0]) {
                                setValue('cover', acceptedFiles[0])
                            }
                        }}
                    >
                        {coverFile && (
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center">
                                <div className="text-center">
                                    <img 
                                        src={URL.createObjectURL(coverFile)} 
                                        alt="Cover preview" 
                                        className="img-thumbnail mb-2" 
                                        style={{ maxHeight: '100px', maxWidth: '100px' }} 
                                    />
                                    <div className="d-flex align-items-center justify-content-center">
                                        <small className="text-muted me-2">{coverFile.name}</small>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleCoverDelete()
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
                {errors.cover && (
                    <div className='invalid-feedback d-block'>{errors.cover.message}</div>
                )}
            </div>

            <div className='col-12'>
                <label className='form-label'>{locale('audio_file')}</label>
                <div className="position-relative">
                    <Dropzone
                        title={audioFile ? '' : locale('drag_and_drop')}
                        accept={{ 'audio/*': ['.mp3', '.wav'] }}
                        maxFiles={1}
                        disabled={isSubmitting}
                        onDrop={(acceptedFiles) => {
                            if (acceptedFiles[0]) {
                                setValue('audio', acceptedFiles[0])
                            }
                        }}
                        style={{ height: '150px' }}
                    >
                        {audioFile && (
                            <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center">
                                <div className="text-center">
                                    <div className="mb-2">
                                        <i className="ri-music-2-line ri-2x text-primary"></i>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <small className="text-muted me-2">
                                            {audioFile.name} ({Math.round(audioFile.size / (1024 * 1024))}MB)
                                        </small>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleAudioDelete()
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
                {errors.audio && (
                    <div className='invalid-feedback d-block'>{errors.audio.message}</div>
                )}
            </div>

            <div className='col-12'>
                <label className='form-label'>BPM</label>
                <Input
                    type='number'
                    placeholder='BPM'
                    className={classNames(
                        'form-control',
                        errors.bpm && 'is-invalid'
                    )}
                    {...register('bpm', {
                        required: 'BPM is required',
                        min: { value: 1, message: 'BPM must be greater than 0' }
                    })}
                />
                {errors.bpm && (
                    <div className='invalid-feedback'>{errors.bpm.message}</div>
                )}
            </div>

            <div className='col-12'>
                <label className='form-label'>{locale('moods')}</label>
                <MultiSelect
                    options={MOODS}
                    placeholder={locale('select_moods')}
                    selected={watch('moods') || []}
                    onChange={(selected: string[]) => setValue('moods', selected)}
                />
                {errors.moods && (
                    <div className='invalid-feedback d-block'>{errors.moods.message}</div>
                )}
            </div>

            <div className='col-12'>
                <label className='form-label'>{locale('keys')}</label>
                <MultiSelect
                    options={KEYS}
                    placeholder={locale('select_keys')}
                    selected={watch('keys') || []}
                    onChange={(selected: string[]) => setValue('keys', selected)}
                />
                {errors.keys && (
                    <div className='invalid-feedback d-block'>{errors.keys.message}</div>
                )}
            </div>
        </div>
    )
}

export default SongForm