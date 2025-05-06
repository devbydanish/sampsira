"use client"

import React from 'react'
import { useGenres } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'
import TrackList from '@/core/components/list'

interface Props {
  slug: string
}

const GenreClientWrapper: React.FC<Props> = ({ slug }) => {
  const { genres, loading, error } = useGenres();
  
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

  const genre = genres.find(g => g.id === slug);

  if (!genre) {
    return (
      <div className="under-hero container">
        <div className="section">
          <h3>Genre not found</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className='hero' 
        style={{backgroundImage: 'url(' + genre.cover + ')'}} 
      />
        
      <div className='under-hero container'>
        <section className='section'>
          <div className='section__head'>
            <h3 className='mb-0'>{genre.title}</h3>
          </div>

          <div className='list'>
            <div className='row'>
              {genre.tracks.map((track, index) => (
                <div key={index} className='col-xl-6'>
                  <TrackList
                    data={track}
                    duration
                    dropdown
                    playlist
                    queue
                    play
                    link
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GenreClientWrapper; 