
// Utilities
import { RadioTypes } from '../types'


/**
 * 
 * Convert radio data for local use
 * @param data 
 * @returns
 */
export default function radioToLocal(data: any): RadioTypes {
    const radio = {} as RadioTypes

    radio.id = data.id
    radio.title = data.name
    radio.type = data.type
    radio.cover = data.radioCover
    radio.src = data.url

    if (data.premium) {
        radio.premium = data.premium
    }

    if (data.like) {
        radio.like = data.like
    }

    return radio
}