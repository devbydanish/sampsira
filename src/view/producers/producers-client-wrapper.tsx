"use client"

import React from 'react'
import { useProducers } from '@/redux/hooks'
import LoadingSpinner from '@/core/components/loading-spinner'
import Section from '@/view/layout/section'
import { title } from '@/core/utils'
import { useTranslations } from 'next-intl'

const ProducersClientWrapper: React.FC = () => {
  const { producers, loading, error } = useProducers();
  const locale = useTranslations();
  
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

  return (
    <>
      {/* Hero [[ Find at scss/framework/hero.scss ]] */}
      <div 
        className='hero' 
        style={{backgroundImage: 'url(/images/banner/Producers.jpg)'}}
      />

      {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
      <div className='under-hero container'>
        <Section 
          title={title(locale, 'feature_Producers_title')}
          data={producers}
          card='avatar'
          slideView={6}
          pagination
          autoplay
        />

        <Section 
          title={title(locale, 'top_Producers_title')}
          data={producers}
          card='producer'
          slideView={5}
          grid
          navigation
          autoplay
        />
      </div>
    </>
  );
};

export default ProducersClientWrapper; 