import { getFloat, getInt, getPersonInfo, localDate } from '../utils'
import { SoundKitTypes } from '../types'
import trackToLocal from './track'

/**
 * Convert sound kit data for local use
 * @param data
 */
export default function soundKitToLocal(data: any): SoundKitTypes {
    const soundKit = {} as SoundKitTypes

    soundKit.id = data?.id || ''
    soundKit.name = data?.name || 'Unknown Sound Kit'
    soundKit.type = data?.type || 'Unknown Type'
    soundKit.cover = data?.albumCover || '/path/to/default-cover.jpg' // Default cover image
    soundKit.likes = getInt(data?.likes || 0)
    soundKit.thumb = data?.albumThumb || '/path/to/default-thumb.jpg' // Default thumbnail
    soundKit.rating = getFloat(data?.albumRatings || 0)
    soundKit.company = data?.albumCompany || 'Unknown Company'
    soundKit.downloads = data?.albumDownloads || 0
    soundKit.date = localDate(data?.release || new Date())
    soundKit.href = '/sound-kit/' + soundKit.id

    soundKit.tracks = Array.isArray(data?.trackList)
        ? data.trackList.map((item: any) => trackToLocal(item))
        : [] // Default to an empty array if trackList is undefined or not an array

    soundKit.Producers = Array.isArray(data?.Producers)
        ? getPersonInfo(data.Producers)
        : [] // Default to an empty array if Producers is undefined or not an array

    if (data?.premium) {
        soundKit.premium = data.premium
    }

    if (data?.like) {
        soundKit.like = data.like
    }

    return soundKit
}
