/**
 * @file helper.ts
 * @description helper functions to get data from API.
 */

// Utilities
import { SOUNDKITS, PRODUCERS, EVENTS, GENRES, MOODS, PLANS, PLAYLISTS, RADIO, TRACKS } from '../constants/api-urls'
import mockTracks from '../mock/tracks.json'
import mockProducers from '../mock/producers.json'
import mockSoundKits from '../mock/sound_kits.json'
import mockGenres from '../mock/genres.json'
import mockMoods from '../mock/moods.json'
import {
    SoundKitTypes,
    ProducerTypes,
    GenreTypes,
    MoodTypes,
    TrackTypes
} from '../types'
import { PlanTypes } from '../types/pricing'

// Local func.
import soundKitToLocal from '../local/soundkit'
import producerToLocal from '../local/producer'
import eventToLocal from '../local/event'
import genreToLocal from '../local/genre'
import moodToLocal from '../local/mood'
import playlistToLocal from '../local/playlist'
import planToLocal from '../local/plan'
import radioToLocal from '../local/radio'
import trackToLocal from '../local/track'

// Constants
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const DEFAULT_COVER = '/images/covers/default.png';

/**
 * Make authenticated API request
 */
async function makeAuthenticatedRequest(url: string) {
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        if (!token) {
            console.error('No authentication token found');
            return null;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('API request failed:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error making authenticated request:', error);
        return null;
    }
}

/**
 * Get media URL from Strapi response
 */
function getMediaUrl(field: any): string | null {
    if (!field?.data?.attributes?.url) return null;
    
    const url = field.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

interface GetTracksOptions {
    limit?: number;
    genre?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Get tracks data from API with proper population and filtering
 */
export async function getTracks(options: GetTracksOptions = {}): Promise<TrackTypes[]> {
    try {
        const {
            limit,
            genre,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = options;

        let url = `${TRACKS}?populate[audio][fields][0]=url&populate[cover][fields][0]=url&populate[producer][fields][0]=username`;
        
        // Add sorting
        url += `&sort=${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
        
        // Add genre filter if specified
        if (genre) {
            url += `&filters[genre][name][$eq]=${genre}`;
        }

        // Add pagination if limit specified
        if (limit) {
            url += `&pagination[limit]=${limit}`;
        }
        
        const data = await makeAuthenticatedRequest(url);
        if (!data) {
            console.log('Using mock tracks data');
            return mockTracks.data.map(item => trackToLocal(item));
        }

        return data.data.map((item: any) => {
            const attrs = item.attributes;

            // Get media URLs
            const audioUrl = getMediaUrl(attrs.audio);
            const coverUrl = getMediaUrl(attrs.cover);

            if (!audioUrl) {
                console.error('Missing audio URL for track:', item.id);
            }

            const trackData = {
                id: item.id,
                title: attrs.title,
                name: attrs.title,
                src: audioUrl,
                cover: coverUrl || DEFAULT_COVER,
                bpm: attrs.bpm,
                genre: attrs.genre,
                moods: attrs.moods?.split(',') || [],
                keys: attrs.keys?.split(',') || [],
                Producers: attrs.producer?.data ? [{
                    id: attrs.producer.data.id,
                    name: attrs.producer.data.attributes.username
                }] : [],
                type: 'track',
                duration: '0:00',
                href: `/tracks/${item.id}`
            };

            return trackToLocal(trackData);
        });
    } catch (error) {
        console.error('Error fetching tracks:', error);
        return [] as TrackTypes[];
    }
}

/**
 * Get tracks by genre
 */
export async function getTracksByGenre(genre: string, limit: number = 10): Promise<TrackTypes[]> {
    return getTracks({ genre, limit });
}

/**
 * Get latest tracks
 */
export async function getLatestTracks(limit: number = 8): Promise<TrackTypes[]> {
    return getTracks({ limit, sortBy: 'createdAt', sortOrder: 'desc' });
}

/**
 * Other API functions
 */
export async function getSoundKits(): Promise<SoundKitTypes[]> {
    try {
        const response = await makeAuthenticatedRequest(`${SOUNDKITS}?populate=*`);
        if (response?.data) {
            return response.data.map((item: any) => soundKitToLocal({
                ...item.attributes,
                id: item.id
            }));
        }
        console.log('Using mock sound kits data');
        return mockSoundKits.data.map(item => soundKitToLocal(item));
    } catch (error) {
        console.log('Using mock sound kits data');
        return mockSoundKits.data.map(item => soundKitToLocal(item));
    }
}

export async function getProducers(): Promise<ProducerTypes[]> {
    try {
        const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users`);
        if (response?.data) {
            return response.data
                .filter((user: any) => user.isProducer)
                .map((user: any) => ({
                    id: user.id,
                    name: user.username,
                    type: 'producer',
                    cover: user.cover || '/images/cover/large/1.jpg',
                    href: `/users/${user.username}`,
                    isProducer: true
                }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching producers:', error);
        return [];
    }
}

export async function getGenres(): Promise<GenreTypes[]> {
    try {
        const response = await makeAuthenticatedRequest(GENRES);
        if (response?.data) {
            return response.data.map((item: any) => genreToLocal({
                ...item.attributes,
                id: item.id
            }));
        }
        console.log('Using mock genres data');
        return mockGenres.data.map(item => genreToLocal(item));
    } catch (error) {
        console.log('Using mock genres data');
        return mockGenres.data.map(item => genreToLocal(item));
    }
}

export async function getPlans(): Promise<PlanTypes[]> {
    const response = await makeAuthenticatedRequest(PLANS);
    if (response?.data) {
        return response.data.map((item: any) => planToLocal({
            ...item.attributes,
            id: item.id
        })) as PlanTypes[];
    }
    return [] as PlanTypes[];
}

export async function getMoods(): Promise<MoodTypes[]> {
    try {
        const response = await makeAuthenticatedRequest(MOODS);
        if (response?.data) {
            return response.data.map((item: any) => moodToLocal({
                ...item.attributes,
                id: item.id
            }));
        }
        console.log('Using mock moods data');
        return mockMoods.data.map(item => moodToLocal(item));
    } catch (error) {
        console.log('Using mock moods data');
        return mockMoods.data.map(item => moodToLocal(item));
    }
}