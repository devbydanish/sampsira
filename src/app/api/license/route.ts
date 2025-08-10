import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid token' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]

    // For testing purposes, use mock data
    // In production, this would call the Strapi API
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/licenses/purchased`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch licenses' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Mock data for testing
    // const data = [
    //   {
    //     "id": 1,
    //     "purchaseDate": "2025-06-15T14:30:00.000Z",
    //     "sampleName": "Summer Vibes Beat",
    //     "licenseUrl": "https://example.com/licenses/summer-vibes-license.pdf",
    //     "purchasedBy": "John Doe"
    //   },
    //   {
    //     "id": 2,
    //     "purchaseDate": "2025-06-10T09:15:00.000Z",
    //     "sampleName": "Trap Melody Loop",
    //     "licenseUrl": "https://example.com/licenses/trap-melody-license.pdf",
    //     "purchasedBy": "Jane Smith"
    //   },
    //   {
    //     "id": 3,
    //     "purchaseDate": "2025-06-05T16:45:00.000Z",
    //     "sampleName": "Reggaeton Drum Kit",
    //     "licenseUrl": "https://example.com/licenses/reggaeton-drums-license.pdf",
    //     "purchasedBy": "Michael Johnson"
    //   },
    //   {
    //     "id": 4,
    //     "purchaseDate": "2025-05-28T11:20:00.000Z",
    //     "sampleName": "Hip-Hop Bass Line",
    //     "licenseUrl": "https://example.com/licenses/hiphop-bass-license.pdf",
    //     "purchasedBy": "Sarah Williams"
    //   },
    //   {
    //     "id": 5,
    //     "purchaseDate": "2025-05-20T13:10:00.000Z",
    //     "sampleName": "Techno Synth Lead",
    //     "licenseUrl": "https://example.com/licenses/techno-synth-license.pdf",
    //     "purchasedBy": "David Brown"
    //   }
    // ]

    // Return the licenses data
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching licenses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
