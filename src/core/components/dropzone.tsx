"use client"

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'
import { RiUploadCloud2Line } from '@remixicon/react'

interface DropzoneProps extends DropzoneOptions {
    title?: string
    infoText?: string
    label?: string
    multiple?: boolean
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onUploadProgress?: (progress: number) => void
    onUploadError?: (error: string) => void
    preview?: string
    error?: boolean
    style?: React.CSSProperties
}

const propTypes = {
    title: PropTypes.string,
    infoText: PropTypes.string,
    label: PropTypes.string,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    onUploadProgress: PropTypes.func,
    onUploadError: PropTypes.func,
    preview: PropTypes.string,
    error: PropTypes.bool
}

const Dropzone: React.FC<DropzoneProps> = ({
    title,
    infoText = '3000x3000 (Max: 5MB)',
    label,
    multiple,
    onChange,
    onUploadProgress,
    onUploadError,
    preview,
    error,
    ...props
}) => {
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [uploadError, setUploadError] = React.useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (preview) {
            setPreviewUrl(preview);
        }
    }, [preview]);

    const handleDrop = React.useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            
            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setUploadProgress(0);
            
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                onUploadProgress?.(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 200);

            // Call original onChange
            if (onChange) {
                const target = { files: acceptedFiles } as unknown as HTMLInputElement;
                onChange({ target } as React.ChangeEvent<HTMLInputElement>);
            }

            return () => {
                URL.revokeObjectURL(objectUrl);
                clearInterval(interval);
            };
        }
    }, [onChange, onUploadProgress]);

    const { getRootProps, getInputProps, open } = useDropzone({
        multiple,
        noClick: true,
        onDrop: handleDrop,
        accept: {'image/*': []},
        onDropRejected: () => {
            const errMsg = 'Please upload a valid image file';
            setUploadError(errMsg);
            onUploadError?.(errMsg);
        },
        ...props
    });

    const locale = useTranslations();
    if (!title) title = locale('drag_and_drop_upload');
    if (!label) label = locale('cover_image');

    return (
        <div
            className={classNames(
                'dropzone text-center position-relative',
                error && 'is-invalid',
                uploadError && 'is-invalid'
            )}
            style={props.style}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            
            {previewUrl ? (
                <div className='preview-container'>
                    <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className='img-fluid mb-3'
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className='progress mb-3' style={{ height: '5px' }}>
                            <div 
                                className='progress-bar bg-primary' 
                                role='progressbar'
                                style={{ width: `${uploadProgress}%` }}
                                aria-valuenow={uploadProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    )}
                    <button 
                        type='button' 
                        className='btn btn-sm btn-light-primary'
                        onClick={open}
                    >
                        {locale('replace_image')}
                    </button>
                </div>
            ) : (
                <div className='dz-message'>
                    <RiUploadCloud2Line className='text-gray' size={40} />
                    <div className='fs-6 mt-2'>{title}</div>
                    <div className='form-text mb-4'>{infoText}</div>
                    <button 
                        type='button' 
                        className='btn btn-light-primary'
                        onClick={open}
                    >
                        {label}
                    </button>
                </div>
            )}

            {uploadError && (
                <div className='alert alert-danger mt-3' role='alert'>
                    {uploadError}
                </div>
            )}
        </div>
    );
};

Dropzone.propTypes = propTypes as any;
Dropzone.displayName = 'Dropzone';

export default Dropzone;