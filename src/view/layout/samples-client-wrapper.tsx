"use client"

import React from 'react'
import Samples from './samples'
import { useTracks, useSoundKits, useGenres, useMoods } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'

const SamplesClientWrapper: React.FC = () => {
  const { tracks, loading: tracksLoading, error: tracksError } = useTracks();
  const { soundKits, loading: soundKitsLoading, error: soundKitsError } = useSoundKits();
  // const { genres, loading: genresLoading, error: genresError } = useGenres();
  // const { moods, loading: moodsLoading, error: moodsError } = useMoods();

  const genres = [{
    "id": 1,
    "title": "Hip Hop",
    "cover": "/images/cover/medium/1.jpg",
    "type": "genre",
    "href": "/genre/hip-hop",
    "tracks": []
  }];
  const moods = [{
    "id": 1,
    "title": "Chill",
    "cover": "/images/cover/medium/1.jpg",
    "type": "mood",
    "href": "/mood/chill",
    "tracks": []
  }];
  

  const isLoading = tracksLoading || soundKitsLoading //|| genresLoading || moodsLoading;
  const hasError = tracksError || soundKitsError //|| genresError || moodsError;

  if (isLoading) {
    return <div className="container py-5 text-center"><LoadingSpinner /></div>;
  }

  if (hasError) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {tracksError || soundKitsError} //|| genresError || moodsError
        </div>
      </div>
    );
  }

  return (
    <Samples
      genres={genres}
      moods={moods}
      tracks={tracks}
      soundKits={soundKits}
    />
  );
};

export default SamplesClientWrapper; 