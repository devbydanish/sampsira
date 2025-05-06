import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useEffect } from 'react';
import { 
  fetchTracks, 
  fetchSoundKits, 
  fetchProducers,
  fetchGenres,
  fetchMoods,
  fetchPlans 
} from './features/dataSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for data fetching
interface UseTracksOptions {
  limit?: number;
  genre?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  skipFetch?: boolean;
}

export const useTracks = (options: UseTracksOptions = {}) => {
  const dispatch = useAppDispatch();
  const { tracks } = useAppSelector((state) => state.data);
  const { token } = useAppSelector((state) => state.user);
  
  
  useEffect(() => {
    if (token && !options.skipFetch) {
      dispatch(fetchTracks(options));
    }
  }, [dispatch, token, options.limit, options.genre, options.sortBy, options.sortOrder, options.skipFetch]);
  
  return {
    tracks: tracks.data,
    loading: tracks.loading,
    error: tracks.error
  };
};

export const useSoundKits = (skipFetch = false) => {
  const dispatch = useAppDispatch();
  const { soundKits } = useAppSelector((state) => state.data);
  const { token } = useAppSelector((state) => state.user);
  
  useEffect(() => {
    if (token && !skipFetch) {
      dispatch(fetchSoundKits());
    }
  }, [dispatch, token, skipFetch]);
  
  return {
    soundKits: soundKits.data,
    loading: soundKits.loading,
    error: soundKits.error
  };
};

export const useProducers = (skipFetch = false) => {
  const dispatch = useAppDispatch();
  const { producers } = useAppSelector((state) => state.data);
  const { token } = useAppSelector((state) => state.user);
  
  useEffect(() => {
    if (token && !skipFetch) {
      dispatch(fetchProducers());
    }
  }, [dispatch, token, skipFetch]);
  
  return {
    producers: producers.data,
    loading: producers.loading,
    error: producers.error
  };
};

export const useGenres = (skipFetch = false) => {
  const dispatch = useAppDispatch();
  const { genres } = useAppSelector((state) => state.data);
  const { token } = useAppSelector((state) => state.user);
  
  useEffect(() => {
    if (token && !skipFetch) {
      dispatch(fetchGenres());
    }
  }, [dispatch, token, skipFetch]);
  
  return {
    genres: genres.data,
    loading: genres.loading,
    error: genres.error
  };
};

export const useMoods = (skipFetch = false) => {
  const dispatch = useAppDispatch();
  const { moods } = useAppSelector((state) => state.data);
  const { token } = useAppSelector((state) => state.user);
  
  useEffect(() => {
    if (token && !skipFetch) {
      dispatch(fetchMoods());
    }
  }, [dispatch, token, skipFetch]);
  
  return {
    moods: moods.data,
    loading: moods.loading,
    error: moods.error
  };
};

export const usePlans = (skipFetch = false) => {
  const dispatch = useAppDispatch();
  const { plans } = useAppSelector((state) => state.data);
  const { token } = useAppSelector((state) => state.user);
  
  useEffect(() => {
    if (token && !skipFetch) {
      dispatch(fetchPlans());
    }
  }, [dispatch, token, skipFetch]);
  
  return {
    plans: plans.data,
    loading: plans.loading,
    error: plans.error
  };
}; 