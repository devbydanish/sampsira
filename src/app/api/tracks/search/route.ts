import { NextResponse } from 'next/server'

interface StrapiResponse<T> {
  data: T[]
}

interface Track {
  id: string;
  attributes: any; // Replace with actual type
}

interface Producer {
  id: string;
  attributes: any; // Replace with actual type
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query) {
            return NextResponse.json({ 
                tracks: [], 
                producers: [], 
            }, { status: 200 })
        }

        if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
            throw new Error('STRAPI URL not configured')
        }

        const token = request.headers.get('authorization')
        if (!token || !token.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const encodedQuery = encodeURIComponent(query)

        // Search tracks and producers in parallel
        const [tracksResponse, producersResponse] = await Promise.all([
            fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks?filters[$or][0][title][$containsi]=${encodedQuery}&populate=cover,producer`,
                {
                    headers: { 
                        'Authorization': process.env.STRAPI_TRACK_TOKEN || '' 
                    }
                }
            ),
            fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/producers?filters[name][$containsi]=${encodedQuery}&populate=avatar`,
                {
                    headers: { 'Authorization': token }
                }
            )
        ])

        if (!tracksResponse.ok || !producersResponse.ok) {
            throw new Error('Failed to fetch from Strapi')
        }

        const [tracksData, producersData] = await Promise.all([
            tracksResponse.json() as Promise<StrapiResponse<Track>>,
            producersResponse.json() as Promise<StrapiResponse<Producer>>,
        ])

        return NextResponse.json({
            tracks: tracksData.data.slice(0, 8),
            producers: producersData.data.slice(0, 8),
        }, { status: 200 })

    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}