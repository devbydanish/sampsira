"use client"

import React from 'react'
import classNames from 'classnames'
import { Control, UseFormRegister, UseFormWatch, FormState, UseFormSetValue } from 'react-hook-form'
import { useTranslations } from 'next-intl'
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