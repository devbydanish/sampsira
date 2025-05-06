"use client"

import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Script from 'next/script'

// Components
import Section from '@/core/components/section'

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

    return (
        <>
            {/* Main Content */}
            <div className="under-hero container" style={{marginTop: '100px'}}>
                <Section id="contact-form">
                    <div className="row">
                        <div className="col-lg-6">
                            <h2>Send Us a Message</h2>
                            <form className="contact-form mt-4">
                                <div className="mb-3">
                                    <label htmlFor="name" className="text-white form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
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
                                        placeholder="Message Subject"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="text-white form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        rows={6}
                                        placeholder="Your Message"
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Send Message
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
