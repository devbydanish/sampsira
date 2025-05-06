"use client"

import React from 'react'
import Home from './home'
import { useTracks, useSoundKits, useProducers } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'

const HomeClientWrapper: React.FC = () => {
  const { tracks, loading: tracksLoading, error: tracksError } = useTracks();
  const { soundKits, loading: soundKitsLoading, error: soundKitsError } = useSoundKits();
  const { producers, loading: producersLoading, error: producersError } = useProducers();
  const isLoading = tracksLoading || soundKitsLoading || producersLoading;
  const hasError = tracksError || soundKitsError || producersError;

  console.log('Tracks:', tracks);

  if (isLoading) {
    return <div className="container py-5 text-center"><LoadingSpinner /></div>;
  }

  if (hasError) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {tracksError || soundKitsError || producersError}
        </div>
      </div>
    );
  }

  return (
    <Home
      soundKits={soundKits}
      Producers={producers}
      tracks={tracks}
    />
  );
};

export default HomeClientWrapper; 