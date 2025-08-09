"use client"

// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { SwiperClass } from 'swiper/react'

// Components
import Carousel, { CarouselProps } from '@/core/components/carousel'
import TrackCard from '@/core/components/card/track'
import AvatarCard from '@/core/components/card/avatar'
import CollectionCard from '@/core/components/card/collection'

// Utilities
import { CardNameTypes } from '@/core/types'

interface Props 
extends Omit<CarouselProps, 'Component'> {
    card: CardNameTypes,
    href?: string,
    subtitle?: string,
    title: string,
    isNewReleases?: boolean,
}

const propTypes = {
    /**
     * Set card component base on name
     */
    card: PropTypes.string.isRequired,

    /**
     * Set section link
     */
    href: PropTypes.string,

    /**
     * Set section subtitle
     */
    subtitle: PropTypes.string,

    /**
     * Set section title
     */
    title: PropTypes.string.isRequired,

    /**
     * Indicate if this section is New Releases
     */
    isNewReleases: PropTypes.bool,
}

const Section: React.FC<Props> = ({
    card,
    data,
    href,
    subtitle,
    slideView,
    title,
    isNewReleases = false,
    ...props
}) => {
    
    const locale = useTranslations()
    let cardType = null
    let cardProps = null

    const sectionHead = () => {
        return (
            href ? (
                <>
                    <div className='flex-grow-1'>
                        {subtitle && (
                            <span className='section__subtitle'>{subtitle}</span>
                        )}
                        <h3 className='mb-0' dangerouslySetInnerHTML={{__html: title}} />
                    </div>
                </>
            ) : (
                <>
                    {subtitle && (
                        <span className='section__subtitle'>{subtitle}</span>
                    )}
                    <h3 className='mb-0' dangerouslySetInnerHTML={{__html: title}} />
                </>
            )
        )
    }

    const handleAfterInit = (swiper: SwiperClass) => {
        if (!swiper.slides || swiper.slides.length === 0) return;
        
        const slide = swiper.slides[0];
        if (!slide) return;

        const { height } = slide.getBoundingClientRect();
        const foot = slide.querySelector('.cover__foot');
        
        if (foot) {
            const footHeight = foot.getBoundingClientRect().height || 0
            const percentage = Math.round(((height - footHeight) / height) * 100)
            const { parentElement } = swiper.el
            if (parentElement) {
                parentElement.style.setProperty(
                    '--swiper-carousel-navigation-top', 
                    percentage / 2 + '%'
                )
            }
        }
    }

    // Set card component element & props.
    if (card === 'avatar') {
        cardType = AvatarCard

    } else if (card === 'genre') {
        cardType = CollectionCard

    } else if (card === 'sound_kit') {
        cardType = TrackCard
        cardProps = {
            dropdown: false,
            link: true,
            like: true,
            play: false,
            playlist: true,
            queue: false
        }
    } else {
        cardType = TrackCard
        cardProps = {
            dropdown: card !== 'producer',
            link: card === 'producer',
            like: true,
            play: card === 'track',
            playlist: card === 'track',
            queue: card === 'track',
            newRelease: isNewReleases
        }
    }

    return (
        // Section [[ Find at scss/framework/section.scss ]]
        <section className='section'>
            <div className='section__head'>{sectionHead()}</div>
            <Carousel 
                data={data}
                Component={cardType}
                childProps={cardProps}
                slideView={slideView}
                onAfterInit={handleAfterInit}
                {...props}
            />
        </section>
    )
}

Section.propTypes = propTypes as any
Section.displayName = 'Section'

export default Section