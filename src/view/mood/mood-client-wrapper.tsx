"use client"

import React from 'react'
import { useMoods, useTracks } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'
import TrackCard from '@/core/components/card/track'
import { MoodTypes, InfoType } from '@/core/types'

interface Props {
  slug: string
}

const MoodClientWrapper: React.FC<Props> = ({ slug }) => {
  const { moods, loading: moodsLoading, error: moodsError } = useMoods();
  const { tracks, loading: tracksLoading, error: tracksError } = useTracks();
  
  const loading = moodsLoading || tracksLoading;
  const error = moodsError || tracksError;
  
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

  const mood = moods.find((m: MoodTypes) => m.title?.toLowerCase().replace(/\s+/g, '-') === slug || m.id === slug);
  const moodTracks = tracks.filter((track: any) => {
    if (!track.moods) return false;
    if (Array.isArray(track.moods)) {
      return track.moods.some((m: any) => {
        if (typeof m === 'string') {
          return m.toLowerCase().replace(/\s+/g, '-') === slug;
        }
        return (m.name?.toLowerCase().replace(/\s+/g, '-') === slug) || (m.id === slug);
      });
    }
    if (typeof track.moods === 'string') {
      return track.moods.toLowerCase().replace(/\s+/g, '-') === slug;
    }
    return false;
  });

  // If no mood found, still allow showing tracks by slug
  if (!mood) {
    const moodTracks = tracks.filter((track: any) => 
      !track.moods ? false :
      Array.isArray(track.moods) ? track.moods.some((m: any) => {
        if (typeof m === 'string') {
          return m.toLowerCase().replace(/\s+/g, '-') === slug;
        }
        return (m.name?.toLowerCase().replace(/\s+/g, '-') === slug) || (m.id === slug);
      }) :
      typeof track.moods === 'string' ? track.moods.toLowerCase().replace(/\s+/g, '-') === slug :
      false
    );
    return (
      <div className="container pt-5 mt-5">
        <div className="section">
          <h3>{slug.replace(/-/g, ' ').toUpperCase()}</h3>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
            {moodTracks.map((track: any) => (
              <div key={track.id} className="col">
                <TrackCard data={track} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='container pt-5 mt-5'>
        <section className='section'>
          <div className='section__head'>
            <h3 className='mb-0'>{mood.title}</h3>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
            {moodTracks.map((track: any) => (
              <div key={track.id} className="col">
                <TrackCard data={track} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default MoodClientWrapper;
