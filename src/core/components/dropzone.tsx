"use client"

import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'
import { RiUploadCloud2Line } from '@remixicon/react'

interface DropzoneProps {
    title: string;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    disabled?: boolean;
    onDrop: <T extends File>(acceptedFiles: T[]) => void;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const Dropzone: React.FC<DropzoneProps> = ({
    title,
    accept,
    maxFiles = 1,
    disabled = false,
    onDrop,
    style,
    children
}) => {
    const handleDrop = useCallback(onDrop, [onDrop])
    const locale = useTranslations()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept,
        maxFiles,
        disabled
    })

    if (!title) title = locale('drag_and_drop_upload')

    return (
        <div
            {...getRootProps()}
            className='dropzone'
            style={{
                border: '2px dashed #ccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? '#f8f9fa' : 'transparent',
                ...style
            }}
        >
            <input {...getInputProps()} />
            {children || (
                <p className='mb-0'>{title}</p>
            )}
        </div>
    )
}

export default Dropzone