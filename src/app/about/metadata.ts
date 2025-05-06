import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Sampsira - Empowering Music Producers Worldwide',
    description: 'Learn about Sampsira\'s mission to revolutionize music production, our team, and how we\'re building the future of music creation and sharing.',
    openGraph: {
        title: 'About Sampsira - Empowering Music Producers Worldwide',
        description: 'Learn about Sampsira\'s mission to revolutionize music production.',
        images: ['/images/og/about.jpg']
    },
    alternates: {
        canonical: 'https://sampsira.com/about'
    },
    keywords: ['music production', 'producer community', 'sound sharing', 'music collaboration'],
    robots: {
        index: true,
        follow: true
    }
}