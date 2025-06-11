"use client"

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

const ReportPage = () => {
    const [progress, setProgress] = useState(20)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        phone: '',
        email: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
    }

    return (
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h1 className="text-white mb-4">Report Copyright Infringement</h1>
                    
                    <div className="text-white mb-4">
                        <p>Please fill out the form below if you&apos;ve encountered something that you think might violate your intellectual property rights or be illegal.</p>
                        <p>To report content that violates our Platform Rules (for example, bullying, harassment, or deceptive content), please let us know <a href="#" className="text-primary">here</a>.</p>
                        <p>If reporting illegal content, please complete this form in its entirety and include specific supporting evidence, as this will help us make an informed legal assessment. Failure to provide a complete report may result in delays or our inability to process your report.</p>
                        <p>Submit one form for each category of content you wish to report (e.g., music, beats, sound kits, etc). You can report multiple pieces of content from the same content category in the same form.</p>
                        <p className="mt-3"><strong>Reminder:</strong> If you wish to report content that violates our Platform Rules, please use this <a href="#" className="text-primary">form</a>.</p>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-white h4">Your details</h2>
                        <div className="progress bg-dark">
                            <div 
                                className="progress-bar bg-primary" 
                                role="progressbar" 
                                style={{width: `${progress}%`}}
                                aria-valuenow={progress} 
                                aria-valuemin={0} 
                                aria-valuemax={100}
                            >{progress}%</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label text-white">First name*</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-white">Last name*</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-white">Company name</label>
                            <input
                                type="text"
                                className="form-control bg-dark text-white"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-white">Mailing address</label>
                            <textarea
                                className="form-control bg-dark text-white"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-white">Phone number</label>
                            <input
                                type="tel"
                                className="form-control bg-dark text-white"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-white">Email*</label>
                            <input
                                type="email"
                                className="form-control bg-dark text-white"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Submit Report
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ReportPage