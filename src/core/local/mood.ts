import { MoodTypes } from '../types'

export default function moodToLocal(data: any): MoodTypes {
    return {
        id: data.id,
        title: data.title,
        cover: data.cover,
        tracks: data.tracks || [],
        type: data.type || 'mood',
        href: `/mood/${data.id}`
    }
}