"use client"

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { RiUploadLine } from '@remixicon/react'

const LicensePage = () => {
    const [formData, setFormData] = useState({
        sample: '',
        youtubeChannel: '',
        file: null as File | null
    })

    // Mock purchased samples - replace with actual data from user's purchases
    const purchasedSamples = [
        { id: 1, title: "Sample 1" },
        { id: 2, title: "Sample 2" },
        { id: 3, title: "Sample 3" }
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                file: e.target.files[0]
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log(formData)
    }

    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-white mb-4">License Request</h1>
                    
                    <div className="text-white mb-4">
                        <p>Please fill out this form to request a license for your purchased sample. You'll need to:</p>
                        <ul>
                            <li>Select the sample you purchased</li>
                            <li>Provide your YouTube channel URL for whitelisting</li>
                            <li>Upload your track that uses the sample</li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label text-white">Select Sample*</label>
                            <select
                                className="form-select bg-dark text-white"
                                name="sample"
                                value={formData.sample}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Choose a sample...</option>
                                {purchasedSamples.map(sample => (
                                    <option key={sample.id} value={sample.id}>
                                        {sample.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-white">YouTube Channel URL*</label>
                            <input
                                type="url"
                                className="form-control bg-dark text-white"
                                name="youtubeChannel"
                                value={formData.youtubeChannel}
                                onChange={handleChange}
                                placeholder="https://youtube.com/channel/..."
                                required
                            />
                            <small className="text-muted">This channel will be whitelisted for content ID</small>
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-white">Upload Your Track*</label>
                            <div className="drop-zone bg-dark p-4 rounded text-center">
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    className="d-none"
                                    onChange={handleFileChange}
                                    accept="audio/*"
                                    required
                                />
                                <label htmlFor="file" className="mb-0 cursor-pointer">
                                    <RiUploadLine size={48} className="text-white mb-2" />
                                    <div className="text-white">
                                        {formData.file ? formData.file.name : 'Drop your track here or click to browse'}
                                    </div>
                                </label>
                            </div>
                            <small className="text-muted">Accepted formats: MP3, WAV (max 20MB)</small>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Submit License Request
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .drop-zone {
                    border: 2px dashed rgba(255,255,255,0.2);
                    transition: all 0.3s ease;
                }
                .drop-zone:hover {
                    border-color: rgba(255,255,255,0.4);
                }
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}

export default LicensePage