import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import Script from 'next/script'

// Components
import Section from '@/core/components/section'

// Styles
import './styles.css'

// Add JSON-LD schema
const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sampsira',
    description: 'Premier platform for music producers to showcase their work, discover new sounds, and collaborate with fellow creators.',
    url: 'https://sampsira.com',
    logo: 'https://sampsira.com/images/logos/brand.png',
    sameAs: [
        'https://twitter.com/sampsira',
        'https://instagram.com/sampsira'
    ]
}

const AboutPage = () => {
    const locale = useTranslations()

    // Hardcoded content - should be moved to CMS/API later
    const milestones = [
        {
            year: 2023,
            title: 'Launch of Sampsira',
            description: 'Revolutionizing the way producers share and discover music'
        },
        {
            year: 2024,
            title: 'Growing Community',
            description: '10,000+ active producers and expanding globally'
        }
    ]

    const team = [
        {
            name: 'John Doe',
            role: 'Founder & CEO',
            image: '/images/team/john-doe.jpg',
            bio: 'Passionate about music and technology, John founded Sampsira to empower music producers worldwide.'
        }
    ]

    const testimonials = [
        {
            name: 'Producer X',
            role: 'Platinum Producer',
            quote: 'Sampsira has transformed how I discover and share music. It\'s an essential tool for modern producers.'
        }
    ]

    return (
        <>
            {/* Hero Section */}
            <div className="hero" style={{backgroundImage: 'url(/images/background/waves.jpg)'}}>
                <div className="container h-100">
                    <div className="row h-100 align-items-center">
                        <div className="col-lg-6">
                            <h1 className="text-white">Empowering Music Producers Worldwide</h1>
                            <p className="text-white-50 lead">
                                Sampsira is revolutionizing the way producers create, share, and discover music.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="under-hero container">
                {/* Introduction Section */}
                <Section id="introduction">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h2>Who We Are</h2>
                            <p className="lead">
                                Sampsira is a premier platform for music producers to showcase their work, 
                                discover new sounds, and collaborate with fellow creators.
                            </p>
                            <p>
                                Our mission is to provide producers with the tools and platform they need 
                                to succeed in today&apos;s digital music landscape.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <Image 
                                src="/images/about/studio.jpg"
                                alt="Music Studio"
                                width={600}
                                height={400}
                                className="img-fluid rounded shadow"
                            />
                        </div>
                    </div>
                </Section>

                {/* Team Section */}
                <Section id="team">
                    <h2 className="text-center mb-5">Meet Our Team</h2>
                    <div className="row">
                        {team.map((member, index) => (
                            <div key={index} className="col-lg-4">
                                <div className="team-member text-center">
                                    <Image 
                                        src={member.image}
                                        alt={member.name}
                                        width={200}
                                        height={200}
                                        className="rounded-circle mb-3"
                                    />
                                    <h4>{member.name}</h4>
                                    <p className="text-muted">{member.role}</p>
                                    <p>{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Testimonials Section */}
                <Section id="testimonials" className="bg-light">
                    <h2 className="text-center mb-5">What Producers Say</h2>
                    <div className="row">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="col-lg-4">
                                <div className="testimonial text-center">
                                    <blockquote className="mb-4">
                                        {testimonial.quote}
                                    </blockquote>
                                    <p className="font-weight-bold mb-0">{testimonial.name}</p>
                                    <small className="text-muted">{testimonial.role}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Call to Action */}
                <Section id="cta" className="text-center">
                    <h2 className="mb-4">Ready to Join Our Community?</h2>
                    <p className="lead mb-4">
                        Start sharing your music and connecting with producers worldwide.
                    </p>
                    <button className="btn btn-primary btn-lg">
                        Get Started Today
                    </button>
                </Section>
            </div>
        </>
    )
}

export default AboutPage
