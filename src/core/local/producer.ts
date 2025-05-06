
// Utilities
import trackToLocal from './track'
import { getFloat, getInt, localDate } from '../utils'
import { ProducerTypes } from '../types'



/**
 * 
 * Convert track data for local use
 * @param data 
 * @returns
 */
export default function producerToLocal(data: any): ProducerTypes {
    const producer = {} as ProducerTypes

    producer.id = data.id
    producer.name = data.name
    producer.type = data.type
    producer.totalSoundKits = getInt(data.totalAlbums)
    producer.totalTracks = getInt(data.totalTracks)
    producer.likes = getInt(data.likes)
    producer.cover = data.producerCover
    producer.description = data.description
    producer.href = '/producers/' + producer.id

    producer.tracks = data.tracksList?.map((item: any) => trackToLocal(item)) || []

    if (data.dob) {
        producer.dob = localDate(data.dob)
    }

    if (data.producerRatings) {
        producer.rating = getFloat(data.producerRatings)
    }

    return producer
}