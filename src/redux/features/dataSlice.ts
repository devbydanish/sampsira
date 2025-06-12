import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
    TrackTypes, 
    SoundKitTypes, 
    ProducerTypes, 
    GenreTypes, 
    MoodTypes 
} from '../../core/types';
import { PlanTypes } from '../../core/types/pricing';
import { RootState } from '../store';

// Constants
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1338';
const DEFAULT_COVER = '/images/cover/default.jpg';

// Utility to get media URL from Strapi response
function getMediaUrl(field: any): string | null {
    if (!field?.data?.attributes?.url) return null;
    
    const url = field.data.attributes.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

// Import local conversion functions
import soundKitToLocal from '../../core/local/soundkit';
import producerToLocal from '../../core/local/producer';
import genreToLocal from '../../core/local/genre';
import moodToLocal from '../../core/local/mood';
import planToLocal from '../../core/local/plan';
import trackToLocal from '../../core/local/track';

// Import API endpoints
import { 
    SOUNDKITS, 
    PRODUCERS, 
    GENRES, 
    MOODS, 
    PLANS, 
    TRACKS 
} from '../../core/constants/api-urls';

// Define our state interface
interface DataState {
    tracks: {
        data: TrackTypes[];
        loading: boolean;
        error: string | null;
    };
    soundKits: {
        data: SoundKitTypes[];
        loading: boolean;
        error: string | null;
    };
    producers: {
        data: ProducerTypes[];
        loading: boolean;
        error: string | null;
    };
    genres: {
        data: GenreTypes[];
        loading: boolean;
        error: string | null;
    };
    moods: {
        data: MoodTypes[];
        loading: boolean;
        error: string | null;
    };
    plans: {
        data: PlanTypes[];
        loading: boolean;
        error: string | null;
    };
}

const initialState: DataState = {
    tracks: {
        data: [],
        loading: false,
        error: null
    },
    soundKits: {
        data: [],
        loading: false,
        error: null
    },
    producers: {
        data: [],
        loading: false,
        error: null
    },
    genres: {
        data: [],
        loading: false,
        error: null
    },
    moods: {
        data: [],
        loading: false,
        error: null
    },
    plans: {
        data: [],
        loading: false,
        error: null
    }
};

// Define interface for fetch tracks options
interface GetTracksOptions {
    limit?: number;
    genre?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Create async thunks for fetching each data type
export const fetchTracks = createAsyncThunk(
    'data/fetchTracks',
    async (options: GetTracksOptions = {}, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            // const token = state.user.token;
            
            // if (!token) {
            //     return rejectWithValue('No authentication token found');
            // }
            
            const {
                limit,
                genre,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = options;
    
            let url = `${TRACKS}?populate[audio][fields][0]=url&populate[cover][fields][0]=url&populate[producer][fields][0]=username`;
            
            // Add sorting
            url += `&sort=${sortBy}:${sortOrder}`;
            
            // Add genre filter if specified
            if (genre) {
                url += `&filters[genre][name][$eq]=${genre}`;
            }
    
            // Add pagination if limit specified
            if (limit) {
                url += `&pagination[limit]=${limit}`;
            }
            
            const response = await fetch(url);

            console.log('API response:', response);
    
            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
    
            const data = await response.json(); 

            console.log('Parsed response data:', data);
            
            return data.data.map((item: any) => {
                const attrs = item.attributes;
                console.log('Track attributes:', attrs);
    
                // Get media URLs
                const audioUrl = getMediaUrl(item.attributes.audio);
                const coverUrl = getMediaUrl(item.attributes.cover);

                console.log('Audio URL:', audioUrl);
                
    
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

                console.log('Track data:', trackData);
    
                const local = trackToLocal(trackData);
                console.log('Local track data:', local);
                return local;
            });
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error fetching tracks');
        }
    }
);

export const fetchSoundKits = createAsyncThunk(
    'data/fetchSoundKits',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.user.token;
            
            if (!token) {
                return rejectWithValue('No authentication token found');
            }
            
            const response = await fetch(`${SOUNDKITS}?populate=*`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const data = await response.json();
            
            return data.data.map((item: any) => soundKitToLocal({
                ...item.attributes,
                id: item.id
            }));
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error fetching sound kits');
        }
    }
);

export const fetchProducers = createAsyncThunk(
    'data/fetchProducers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            // const token = state.user.token;
            
            // if (!token) {
            //     return rejectWithValue('No authentication token found');
            // }
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users?populate[img][fields][0]=url&populate[tracks][populate]=*&populate[soundKits][populate]=*&populate=*&filters[isProducer][$eq]=true`, {
                // headers: {
                //     'Authorization': `Bearer ${token}`
                // }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Producers data api:', data);
            const producers = data
                ?.map((user: any) => ({
                    id: user.id,
                    name: user.username.toLowerCase(),
                    displayName: user.displayName || user.username,
                    type: 'producer',
                    cover: user.img ? process.env.NEXT_PUBLIC_STRAPI_URL + user.img.url : '/images/cover/large/1.jpg',
                    href: `/producers/${user.username.toLowerCase()}`,
                    isProducer: true,
                    tracks: user.tracks || [],
                    soundKits: user.soundKits || [],
                    bio: user.bio,
                    socialAccounts: user.socialAccounts
                }));
            console.log('Producers data:', producers);
            // return random 8 producers
            const randomProducers = producers.sort(() => 0.5 - Math.random()).slice(0, 8);
            console.log('Random producers:', randomProducers);
            return randomProducers

        } catch (error: any) {
            return rejectWithValue(error.message || 'Error fetching producers');
        }
    }
);

export const fetchGenres = createAsyncThunk(
    'data/fetchGenres',
    async (_, { getState, rejectWithValue }) => {
        try {
            const mockGenres = (await import('../../core/mock/genres.json')).default;
            return mockGenres.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error fetching genres');
        }
    }
);

export const fetchMoods = createAsyncThunk(
    'data/fetchMoods',
    async (_, { getState, rejectWithValue }) => {
        try {
            const mockMoods = (await import('../../core/mock/moods.json')).default;
            return mockMoods.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error fetching moods');
        }
    }
);

export const fetchPlans = createAsyncThunk(
    'data/fetchPlans',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.user.token;
            
            if (!token) {
                return rejectWithValue('No authentication token found');
            }
            
            const response = await fetch(PLANS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const data = await response.json();
            
            return data.data.map((item: any) => planToLocal({
                ...item.attributes,
                id: item.id
            })) as PlanTypes[];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Error fetching plans');
        }
    }
);

// Create the slice
const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        clearData: (state) => {
            // Reset all data when user logs out
            return initialState;
        }
    },
    extraReducers: (builder) => {
        // Tracks
        builder
            .addCase(fetchTracks.pending, (state) => {
                state.tracks.loading = true;
                state.tracks.error = null;
            })
            .addCase(fetchTracks.fulfilled, (state, action) => {
                state.tracks.loading = false;
                state.tracks.data = action.payload;
            })
            .addCase(fetchTracks.rejected, (state, action) => {
                state.tracks.loading = false;
                state.tracks.error = action.payload as string;
            });
            
        // Sound Kits
        builder
            .addCase(fetchSoundKits.pending, (state) => {
                state.soundKits.loading = true;
                state.soundKits.error = null;
            })
            .addCase(fetchSoundKits.fulfilled, (state, action) => {
                state.soundKits.loading = false;
                state.soundKits.data = action.payload;
            })
            .addCase(fetchSoundKits.rejected, (state, action) => {
                state.soundKits.loading = false;
                state.soundKits.error = action.payload as string;
            });
            
        // Producers
        builder
            .addCase(fetchProducers.pending, (state) => {
                state.producers.loading = true;
                state.producers.error = null;
            })
            .addCase(fetchProducers.fulfilled, (state, action) => {
                state.producers.loading = false;
                state.producers.data = action.payload;
            })
            .addCase(fetchProducers.rejected, (state, action) => {
                state.producers.loading = false;
                state.producers.error = action.payload as string;
            });
            
        // Genres
        builder
            .addCase(fetchGenres.pending, (state) => {
                state.genres.loading = true;
                state.genres.error = null;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.genres.loading = false;
                state.genres.data = action.payload;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.genres.loading = false;
                state.genres.error = action.payload as string;
            });
            
        // Moods
        builder
            .addCase(fetchMoods.pending, (state) => {
                state.moods.loading = true;
                state.moods.error = null;
            })
            .addCase(fetchMoods.fulfilled, (state, action) => {
                state.moods.loading = false;
                state.moods.data = action.payload;
            })
            .addCase(fetchMoods.rejected, (state, action) => {
                state.moods.loading = false;
                state.moods.error = action.payload as string;
            });
            
        // Plans
        builder
            .addCase(fetchPlans.pending, (state) => {
                state.plans.loading = true;
                state.plans.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.plans.loading = false;
                state.plans.data = action.payload;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.plans.loading = false;
                state.plans.error = action.payload as string;
            });
    }
});

export const { clearData } = dataSlice.actions;
export default dataSlice.reducer; 