"use client"

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Script from 'next/script'

// Components
import Section from '@/core/components/section'

// Declare global grecaptcha
declare global {
    interface Window {
        grecaptcha: any;
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
    const recaptchaRef = useRef<any>(null)
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    // Contact details - should be moved to CMS/API later
    const contactInfo = {
        email: 'support@sampsira.com',
        phone: '+1 (234) 567-8900',
        address: '123 Music Street, Studio City, CA 90210',
        hours: 'Monday - Friday: 9:00 AM - 6:00 PM (EST)',
        socialMedia: [
            { name: 'Instagram', url: 'https://instagram.com/sampsira' },
            { name: 'Facebook', url: 'https://facebook.com/sampsira' },
            { name: 'TikTok', url: 'https://tiktok.com/sampsira' },
        ]
    }

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            // Verify reCAPTCHA
            const recaptchaValue = window.grecaptcha.getResponse()
            if (!recaptchaValue) {
                alert('Please complete the reCAPTCHA verification')
                setIsSubmitting(false)
                return
            }

            // Here you would typically send the form data to your backend
            // For now, we'll simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            })
            
            // Reset reCAPTCHA
            window.grecaptcha.reset()
            
            setSubmitStatus('success')
        } catch (error) {
            console.error('Form submission error:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {/* Google reCAPTCHA Script */}
            <Script
                src="https://www.google.com/recaptcha/api.js"
                async defer
                strategy="lazyOnload"
            />
            
            {/* Main Content */}
            <div className="under-hero container" style={{marginTop: '100px'}}>
                <Section id="contact-form">
                    <div className="row">
                        <div className="col-lg-6">
                            <h2>Send Us a Message</h2>
                            
                            {/* Success/Error Messages */}
                            {submitStatus === 'success' && (
                                <div className="alert alert-success mt-3" role="alert">
                                    <strong>Success!</strong> Your message has been sent successfully. We'll get back to you soon!
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    <strong>Error!</strong> There was a problem sending your message. Please try again.
                                </div>
                            )}
                            
                            <form className="contact-form mt-4" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="text-dark form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="text-dark form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="subject" className="text-dark form-label">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="Message Subject"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="text-dark form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={6}
                                        placeholder="Your Message"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                
                                {/* reCAPTCHA */}
                                <div className="mb-3">
                                    <div 
                                        className="g-recaptcha" 
                                        data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                                        ref={recaptchaRef}
                                    ></div>
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
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
