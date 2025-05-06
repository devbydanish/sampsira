/**
 * @file helper.ts
 * @description helper functions for the application, now using Redux for state management
 */

// Import types
import { 
    SoundKitTypes, 
    ProducerTypes, 
    GenreTypes, 
    MoodTypes, 
    TrackTypes 
} from '../types';
import { PlanTypes } from '../types/pricing';

// Import Redux hooks and actions
import { useAppDispatch } from '../../redux/hooks';
import { 
    fetchTracks,
    fetchSoundKits,
    fetchProducers,
    fetchGenres,
    fetchMoods,
    fetchPlans
} from '../../redux/features/dataSlice';

// Import mock data
import mockTracks from '../mock/tracks.json';
import mockProducers from '../mock/producers.json';
import mockSoundKits from '../mock/sound_kits.json';
import mockGenres from '../mock/genres.json';
import mockMoods from '../mock/moods.json';

// Local conversion functions
import trackToLocal from '../local/track';
import soundKitToLocal from '../local/soundkit';
import producerToLocal from '../local/producer';
import genreToLocal from '../local/genre';
import moodToLocal from '../local/mood';

// Options interface for getTracks
interface GetTracksOptions {
    limit?: number;
    genre?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Get tracks data using Redux hooks
 */
export function useTracksData(options: GetTracksOptions = {}) {
    const dispatch = useAppDispatch();
    
    const fetchData = async () => {
        try {
            const resultAction = await dispatch(fetchTracks(options));
            if (fetchTracks.fulfilled.match(resultAction)) {
                return resultAction.payload;
            }
            return mockTracks.data.map(item => trackToLocal(item));
        } catch (error) {
            console.error('Error fetching tracks:', error);
            return mockTracks.data.map(item => trackToLocal(item));
        }
    };
    
    return fetchData;
}

/**
 * Get sound kits using Redux hooks
 */
export function useSoundKitsData() {
    const dispatch = useAppDispatch();
    
    const fetchData = async () => {
        try {
            const resultAction = await dispatch(fetchSoundKits());
            if (fetchSoundKits.fulfilled.match(resultAction)) {
                return resultAction.payload;
            }
            return mockSoundKits.data.map(item => soundKitToLocal(item));
        } catch (error) {
            console.error('Error fetching sound kits:', error);
            return mockSoundKits.data.map(item => soundKitToLocal(item));
        }
    };
    
    return fetchData;
}

/**
 * Get producers using Redux hooks
 */
export function useProducersData() {
    const dispatch = useAppDispatch();
    
    const fetchData = async () => {
        try {
            const resultAction = await dispatch(fetchProducers());
            if (fetchProducers.fulfilled.match(resultAction)) {
                return resultAction.payload;
            }
            return [];
        } catch (error) {
            console.error('Error fetching producers:', error);
            return [];
        }
    };
    
    return fetchData;
}

/**
 * Get genres using Redux hooks
 */
export function useGenresData() {
    const dispatch = useAppDispatch();
    
    const fetchData = async () => {
        try {
            const resultAction = await dispatch(fetchGenres());
            if (fetchGenres.fulfilled.match(resultAction)) {
                return resultAction.payload;
            }
            return mockGenres.data.map(item => genreToLocal(item));
        } catch (error) {
            console.error('Error fetching genres:', error);
            return mockGenres.data.map(item => genreToLocal(item));
        }
    };
    
    return fetchData;
}

/**
 * Get plans using Redux hooks
 */
export function usePlansData() {
    const dispatch = useAppDispatch();
    
    const fetchData = async () => {
        try {
            const resultAction = await dispatch(fetchPlans());
            if (fetchPlans.fulfilled.match(resultAction)) {
                return resultAction.payload;
            }
            return [];
        } catch (error) {
            console.error('Error fetching plans:', error);
            return [];
        }
    };
    
    return fetchData;
}

/**
 * Get moods using Redux hooks
 */
export function useMoodsData() {
    const dispatch = useAppDispatch();
    
    const fetchData = async () => {
        try {
            const resultAction = await dispatch(fetchMoods());
            if (fetchMoods.fulfilled.match(resultAction)) {
                return resultAction.payload;
            }
            return mockMoods.data.map(item => moodToLocal(item));
        } catch (error) {
            console.error('Error fetching moods:', error);
            return mockMoods.data.map(item => moodToLocal(item));
        }
    };
    
    return fetchData;
}