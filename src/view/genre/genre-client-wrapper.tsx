"use client"

import React from 'react'
import { useGenres, useTracks } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'
import TrackCard from '@/core/components/card/track'
import { GenreTypes, InfoType } from '@/core/types'

interface Props {
  slug: string
}

const GenreClientWrapper: React.FC<Props> = ({ slug }) => {
  const { genres, loading: genresLoading, error: genresError } = useGenres();
  const { tracks, loading: tracksLoading, error: tracksError } = useTracks();
  
  const loading = genresLoading || tracksLoading;
  const error = genresError || tracksError;
  
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

  const genre = genres.find((g: GenreTypes) => g.title?.toLowerCase().replace(/\s+/g, '-') === slug || g.id === slug);
  const genreTracks = tracks.filter((track: any) => {
    if (!track.genre) return false;
    if (Array.isArray(track.genre)) {
      return track.genre.some((g: any) => {
        if (typeof g === 'string') {
          return g.toLowerCase().replace(/\s+/g, '-') === slug;
        }
        return (g.name?.toLowerCase().replace(/\s+/g, '-') === slug) || (g.id === slug);
      });
    }
    if (typeof track.genre === 'string') {
      return track.genre.toLowerCase().replace(/\s+/g, '-') === slug;
    }
    return false;
  });

  // If no genre found, still allow showing tracks by slug
  if (!genre) {
    const genreTracks = tracks.filter((track: any) => 
      !track.genre ? false :
      Array.isArray(track.genre) ? track.genre.some((g: any) => {
        if (typeof g === 'string') {
          return g.toLowerCase().replace(/\s+/g, '-') === slug;
        }
        return (g.name?.toLowerCase().replace(/\s+/g, '-') === slug) || (g.id === slug);
      }) :
      typeof track.genre === 'string' ? track.genre.toLowerCase().replace(/\s+/g, '-') === slug :
      false
    );
    return (
      <div className="container pt-5 mt-5">
        <div className="section">
          <h3>{slug.replace(/-/g, ' ').toUpperCase()}</h3>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
            {genreTracks.map((track: any) => (
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
            <h3 className='mb-0'>{genre.title}</h3>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
            {genreTracks.map((track: any) => (
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

export default GenreClientWrapper;
