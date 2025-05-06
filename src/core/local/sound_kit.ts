import { SoundKitTypes } from '../types'

export default function soundKitToLocal(data: any): SoundKitTypes {
    return {
        id: data.id,
        title: data.title || '',
        slug: data.slug || '',
        cover: data.cover || '',
        price: data.price || 0,
        description: data.description || '',
        producer: data.producer || null,
        tracks: data.tracks || [],
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || ''
    }
}