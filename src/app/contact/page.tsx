"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Script from 'next/script'

// Components
import Section from '@/core/components/section'

// Types
interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// Declare global type for grecaptcha
declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

// JSON-LD schema
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    'name': 'Contact Sampsira',
    'description': 'Get in touch with Sampsira for any questions about our music production platform.',
    'url': 'https://sampsira.com/contact',
    'mainEntity': {
        '@type': 'Organization',
        'name': 'Sampsira',
        'contactPoint': {
            '@type': 'ContactPoint',
            'telephone': '+1-234-567-8900',
            'contactType': 'customer service',
            'email': 'support@sampsira.com',
            'areaServed': 'Worldwide'
        }
    }
}

const ContactPage = () => {
    const locale = useTranslations()
    const [formSubmitting, setFormSubmitting] = useState(false)
    const [formStatus, setFormStatus] = useState<{success?: boolean, message?: string} | null>(null)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    // Contact details
    const contactInfo = {
        email: 'support@sampsira.com',
        phone: '+1 (234) 567-8900',
        address: '123 Music Street, Studio City, CA 90210',
        hours: 'Monday - Friday: 9:00 AM - 6:00 PM (EST)',
        socialMedia: [
            { name: 'Instagram', url: 'https://instagram.com/eccentricsounds_' },
            // { name: 'Facebook', url: 'https://facebook.com/sampsira' },
            // { name: 'TikTok', url: 'https://tiktok.com/sampsira' },
        ]
    }

    const executeRecaptcha = async () => {
        try {
            const token = await window.grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: 'submit' })
            return token
        } catch (error) {
            console.error('reCAPTCHA execution failed:', error)
            return null
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormSubmitting(true)
        setFormStatus(null)
        
        try {
            // Validate form data
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                throw new Error('Please fill in all required fields')
            }

            // Execute reCAPTCHA and get token
            const token = await executeRecaptcha()
            
            if (!token) {
                throw new Error('Failed to verify reCAPTCHA. Please try again.')
            }

            // Send form data to API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    recaptchaToken: token
                })
            })

            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message')
            }
            
            setFormStatus({
                success: true,
                message: 'Thank you for your message. We will get back to you soon!'
            })
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            })
            
        } catch (error) {
            console.error('Form submission error:', error)
            setFormStatus({
                success: false,
                message: error instanceof Error ? error.message : 'Something went wrong. Please try again later.'
            })
        } finally {
            setFormSubmitting(false)
        }
    }

    // Initialize reCAPTCHA when component mounts
    useEffect(() => {
        window.grecaptcha?.ready(() => {
            console.log('reCAPTCHA is ready')
        })
    }, [])

    return (
        <>
            {/* Load reCAPTCHA v3 script */}
            <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} />
            
            {/* Main Content */}
            <div className="under-hero container" style={{marginTop: '100px'}}>
                <Section id="contact-form">
                    <div className="row">
                        <div className="col-lg-6">
                            <h2>Send Us a Message</h2>
                            
                            {formStatus && (
                                <div className={`alert ${formStatus.success ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                                    {formStatus.message}
                                </div>
                            )}
                            
                            <form className="contact-form mt-4" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="text-white form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="text-white form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="subject" className="text-white form-label">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="Message Subject"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="text-white form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        placeholder="Your Message"
                                        required
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={formSubmitting}
                                >
                                    {formSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                        <div className="col-lg-5 offset-lg-1">
                            <div className="contact-info mt-5 mt-lg-0">
                                <h2>Contact Information</h2>
                                <div className="mt-4">
                                    <div className="contact-info-item mb-4">
                                        <h5>Email</h5>
                                        <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
                                    </div>
                                    <div className="contact-info-item mb-4">
                                        <h5>Phone</h5>
                                        <p><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></p>
                                    </div>
                                    <div className="contact-info-item">
                                        <h5>Follow Us</h5>
                                        <div className="social-links mt-2">
                                            {contactInfo.socialMedia.map((social, index) => (
                                                <a
                                                    key={index}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary me-2"
                                                >
                                                    {social.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            </div>
        </>
    )
}

export default ContactPage
