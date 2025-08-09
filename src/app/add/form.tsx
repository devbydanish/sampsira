"use client"

import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Control, UseFormRegister, UseFormWatch, FormState, UseFormSetValue } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Input from '@/core/components/input'
import Dropzone from '@/core/components/dropzone'
import MultiSelect from '@/core/components/multi-select'
import { MOODS } from '@/core/constants/moods'
import { KEYS } from '@/core/constants/keys'

const allowedGenres = ['Reggaeton', 'Trap', 'Hip-Hop/Rap', 'Drill', 'Techno', 'Drum & Bass', 'Jersey Club', 'Dancehall', 'Afrobeat', 'Amapiano', 'House', 'Pop', 'R&B'];

export interface TrackFormData {
    title: string;
    cover: File | null;
    audio: File | null;
    stem: File[] | null;
    bpm: string;
    moods: string[];
    keys: string[];
    genre: string;
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

const FilePreview: React.FC<{ file: File | null }> = ({ file }) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    if (!file || !preview) return null;

    if (file.type.startsWith('image/')) {
        return (
            <div className="mt-3 position-relative" style={{ width: '100%', height: '200px' }}>
                <Image
                    src={preview}
                    alt="Cover preview"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded"
                />
            </div>
        );
    }

    if (file.type.startsWith('audio/')) {
        return (
            <div className="mt-3">
                <audio controls className="w-100">
                    <source src={preview} type={file.type} />
                    Your browser does not support the audio element.
                </audio>
            </div>
        );
    }
    
    if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
        return (
            <div className="mt-3">
                <div className="alert alert-info">
                    <strong>{file.name}</strong> ({Math.round(file.size / 1024 / 1024)}MB)
                </div>
            </div>
        );
    }

    return null;
};

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
                <Dropzone
                    title={locale('drag_and_drop')}
                    accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                    maxFiles={1}
                    disabled={isSubmitting}
                    onDrop={(acceptedFiles) => {
                        if (acceptedFiles[0]) {
                            setValue('cover', acceptedFiles[0])
                        }
                    }}
                />
                <FilePreview file={coverFile} />
                {errors.cover && (
                    <div className='invalid-feedback d-block'>{errors.cover.message}</div>
                )}
            </div>

            <div className='col-12'>
                <label className='form-label'>{locale('audio_file')}</label>
                <Dropzone
                    title={locale('drag_and_drop')}
                    accept={{ 'audio/*': ['.mp3', '.wav'] }}
                    maxFiles={1}
                    disabled={isSubmitting}
                    onDrop={(acceptedFiles) => {
                        if (acceptedFiles[0]) {
                            setValue('audio', acceptedFiles[0])
                        }
                    }}
                    style={{ height: '150px' }}
                />
                <FilePreview file={audioFile} />
                {errors.audio && (
                    <div className='invalid-feedback d-block'>{errors.audio.message}</div>
                )}
            </div>

            <div className='col-12'>
                <label className='form-label'>{locale('stem_files')}</label>
                <Dropzone
                    title={locale('drag_and_drop')}
                    accept={{ 'application/zip': ['.zip'] }}
                    maxFiles={1}
                    disabled={isSubmitting}
                    onDrop={(acceptedFiles) => {
                        if (acceptedFiles.length > 0) {
                            setValue('stem', acceptedFiles)
                        }
                    }}
                    style={{ height: '150px' }}
                    infoText="Upload stem files as ZIP (Max: 250MB)"
                />
                {(() => {
                    const stemFiles = watch('stem');
                    if (stemFiles && Array.isArray(stemFiles) && stemFiles.length > 0 && stemFiles[0]) {
                        return (
                            <div className="mt-2">
                                <div className="alert alert-success">
                                    <strong>{stemFiles[0].name}</strong> ({Math.round(stemFiles[0].size / 1024 / 1024)}MB)
                                </div>
                            </div>
                        );
                    }
                    return null;
                })()}
                {errors.stem && (
                    <div className='invalid-feedback d-block'>{errors.stem.message}</div>
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
                <label className='form-label'>{locale('genre')}</label>
                <select
                    className={classNames(
                        'form-select',
                        errors.genre && 'is-invalid'
                    )}
                    {...register('genre', {
                        required: 'Genre is required'
                    })}
                >
                    <option value="">{locale('select_genre')}</option>
                    {allowedGenres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                {errors.genre && (
                    <div className='invalid-feedback'>{errors.genre.message}</div>
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