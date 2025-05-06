import type { Metadata } from 'next'

interface Props {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const genre = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)
    
    return {
        title: `${genre} Samples - Sampsira`,
        description: `Browse and discover ${genre.toLowerCase()} samples. Find the perfect ${genre.toLowerCase()} sound for your next production.`,
    }
}