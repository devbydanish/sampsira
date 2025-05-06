"use client"

import React from 'react'
import { useSoundKits } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'
import SoundKits from './sound-kits'

const SoundKitsClientWrapper: React.FC = () => {
  const { soundKits, loading, error } = useSoundKits();
  
  if (loading) {
    return <div className="container py-5 text-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return <SoundKits soundKits={soundKits} />;
};

export default SoundKitsClientWrapper; 