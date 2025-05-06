// Utilities
import trackToLocal from './track'
import { GenreTypes } from '../types'

/**
 * 
 * Convert genre data for local use
 * @param data 
 * @returns
 */
export default function genreToLocal(data: any): GenreTypes {
    const genre = {} as GenreTypes

    genre.id = data.id
    genre.title = data.name
    genre.type = data.type
    genre.cover = data.genreCover
    genre.href = '/genre/' + genre.id
    genre.tracks = Array.isArray(data.trackList) 
        ? data.trackList.map((item: any) => trackToLocal(item)) 
        : []

    return genre
}
