
// Utilities
import trackToLocal from './track'
import { PlaylistTypes } from '../types'
import { getFloat } from '../utils'


/**
 * 
 * Convert playlist data for local use
 * @param data 
 * @returns
 */
export default function playlistToLocal(data: any): PlaylistTypes {
    const playlist = {} as PlaylistTypes

    playlist.id = data.id
    playlist.title = data.name
    playlist.type = data.type
    playlist.cover = data.playlistCover
    playlist.likes = getFloat(data.links)
    playlist.href = '/playlist/' + playlist.id
    playlist.tracks = data.songList.map((item: any) => trackToLocal(item))

    return playlist
}
