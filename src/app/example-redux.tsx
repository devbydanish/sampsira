'use client';

import { useEffect } from 'react';
import { 
  useTracks, 
  useSoundKits, 
  useProducers, 
  useGenres,
  useMoods,
  useAppSelector
} from '../redux/hooks';
import { logout } from '../redux/features/userSlice';
import { useAppDispatch } from '../redux/hooks';
import Link from 'next/link';

export default function ExampleReduxComponent() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.user);
  
  // Use our custom hooks
  const { tracks, loading: tracksLoading, error: tracksError } = useTracks({ limit: 5 });
  const { soundKits, loading: soundKitsLoading } = useSoundKits();
  const { producers, loading: producersLoading } = useProducers();
  const { genres, loading: genresLoading } = useGenres();
  const { moods, loading: moodsLoading } = useMoods();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  if (!isAuthenticated) {
    return (
      <div className="p-5">
        <h1 className="text-xl font-bold mb-4">Please login to see content</h1>
        <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Redux Data Example</h1>
        <div>
          <span className="mr-4">Welcome, {user?.username}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Tracks */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Latest Tracks</h2>
          {tracksLoading ? (
            <p>Loading tracks...</p>
          ) : tracksError ? (
            <p className="text-red-500">Error: {tracksError}</p>
          ) : (
            <ul className="list-disc pl-5">
              {tracks.map(track => (
                <li key={track.id} className="mb-1">
                  {track.title} {track.bpm && `(${track.bpm} BPM)`}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Sound Kits */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Sound Kits</h2>
          {soundKitsLoading ? (
            <p>Loading sound kits...</p>
          ) : (
            <ul className="list-disc pl-5">
              {soundKits.map(kit => (
                <li key={kit.id} className="mb-1">
                  {kit.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Producers */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Producers</h2>
          {producersLoading ? (
            <p>Loading producers...</p>
          ) : (
            <ul className="list-disc pl-5">
              {producers.map(producer => (
                <li key={producer.id} className="mb-1">
                  {producer.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Genres */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Genres</h2>
          {genresLoading ? (
            <p>Loading genres...</p>
          ) : (
            <ul className="list-disc pl-5">
              {genres.map(genre => (
                <li key={genre.id} className="mb-1">
                  {genre.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Moods */}
        <div className="border rounded-lg p-4 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Moods</h2>
          {moodsLoading ? (
            <p>Loading moods...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {moods.map(mood => (
                <span 
                  key={mood.id} 
                  className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                >
                  {mood.title}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 