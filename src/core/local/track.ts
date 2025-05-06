// Utilities
import { getFloat, getInt, getPersonInfo } from '../utils'
import { TrackTypes } from '../types'

/**
 * Convert tracks data for local use
 * @param data 
 * @returns
 */
export default function trackToLocal(data: any): TrackTypes {
    const track = {} as TrackTypes

    // Basic track info
    track.id = data.id
    track.title = data.title || data.name
    track.type = data.type || 'track'
    track.cover = data.cover
    track.src = data.src
    track.duration = data.duration || '0:00'
    track.href = '/tracks/' + track.id

    // Optional fields with defaults
    track.thumb = data.thumb || data.cover
    track.date = data.date || new Date().toISOString()
    track.rating = getFloat(data.rating)
    track.played = getInt(data.played)
    track.downloads = data.downloads || 0

    // Arrays with defaults
    track.keys = data.keys || []
    track.moods = data.moods || []
    track.genre = data.genre ? [{ id: 0, name: data.genre }] : []
    track.categories = data.categories || []
    
    // Producer information
    track.producers = data.producers || []
    track.Producers = data.Producers || []

    // Optional features
    if (data.sound_kit) {
        track.sound_kit = {
            id: getInt(data.sound_kit.id),
            name: data.sound_kit.name
        }
    }

    // BPM if available
    if (data.bpm) {
        track.bpm = parseInt(data.bpm)
    }

    return track
}