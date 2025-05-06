
// Utilities
import { getFloat, getInt, getPersonInfo, localDate } from '../utils'
import { TrackTypes } from '../types'


/**
 * 
 * Convert tracks data for local use
 * @param data 
 * @returns
 */
export default function trackToLocal(data: any): TrackTypes {
    const track = {} as TrackTypes

    track.id = data.id
    track.title = data.name
    track.type = data.type
    track.cover = data.trackCover
    track.date = localDate(data.release)
    track.src = data.trackUrl
    track.company = data.company
    track.thumb = data.trackThumb
    track.rating = getFloat(data.trackRatings)
    track.duration = data.trackDuration
    track.played = getInt(data.played)
    track.likes = getInt(data.likes)
    track.downloads = data.trackDownloads
    track.lyrics = data.trackLyrics
    track.href = '/tracks/' + track.id // Updated to match new URL structure

    track.keys = data.keys || []
    track.moods = data.moods || []
    track.bpm = data.bpm
    
    track.Producers = getPersonInfo(data.Producers)
    track.composers = getPersonInfo(data.composers)
    track.lyricists = getPersonInfo(data.lyricists)
    track.directors = getPersonInfo(data.directors)
    track.categories = getPersonInfo(data.categories)

    if (data.premium) {
        track.premium = data.premium
    }

    if (data.like) {
        track.like = data.like
    }

    if (data.sound_kit) {
        track.sound_kit = {
            id: getInt(data.sound_kit.id),
            name: data.sound_kit.name
        }
    }

    return track
}