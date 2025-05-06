/**
 * @name Carousel
 * @file carousel.tsx
 * @description use component to customize swiper slider
 */
"use client"


// Modules
import React, { createElement, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide, SwiperProps, SwiperClass } from 'swiper/react'
import { A11y, Autoplay, Grid, Navigation, Pagination } from 'swiper/modules'

// Contexts
import { useTheme } from '../contexts/theme'

export interface CarouselProps {
    autoplay?: boolean
    gap?: number
    grid?: boolean
    navigation?: boolean
    pagination?: boolean
    slideView?: number
    data: any[]
    Component: React.ElementType
    childProps?: any
    onAfterInit?: (swiper: SwiperClass) => void
}

const propTypes = {
    /**
     * Set Swiper {autoplay} option,
     */
    autoplay: PropTypes.bool,

    /**
     * Set {spaceBetween} to Swiper in desktop
     * 
     * @default 24
     */
    gap: PropTypes.number,

    /**
     * Set grid layout to Swiper in desktop
     */
    grid: PropTypes.bool,

    /**
     * Set {navigation} to Swiper
     */
    navigation: PropTypes.bool,

    /**
     * Set {pagination} to Swiper
     */
    pagination: PropTypes.bool,

    /**
     * Set {slidesPerView} to Swiper
     * 
     * @default 1
     */
    slideView: PropTypes.number,

    /**
     * Set data of array for Swiper slide view
     */
    data: PropTypes.array.isRequired,

    /**
     * Component to set inside Swiper slide
     */
    Component: PropTypes.elementType.isRequired,

    /**
     * Set child component props
     */
    childProps: PropTypes.any,

    /**
     * Event will be fired after swiper.update() call
     */
    onAfterInit: PropTypes.func
}


const Carousel: React.FC<CarouselProps> = (
    {
        autoplay,
        gap = 24,
        grid,
        navigation,
        pagination,
        slideView = 1,
        data,
        Component,
        childProps,
        onAfterInit
    }
) => {

    const {rtl} = useTheme()
    const [direction, setDirection] = useState<'rtl' | 'ltr'>()
    const next = useRef<HTMLDivElement | null>(null)
    const prev = useRef<HTMLDivElement | null>(null)

    // Set carousel slides
    const desktopSlides = slideView
    const tabletLandscapeSlides = desktopSlides >= 5 
        ? Math.round(desktopSlides / 1.5) 
        : desktopSlides === 4 
        ? Math.round(desktopSlides / 2)
        : desktopSlides
    const mobileLandscapeSlides = desktopSlides > 4 ? 3 : 2
    const mobilePortraitSlides = desktopSlides > 4 ? 2 : 1

    // Set carousel spacing
    const desktopGap = gap
    const mobileGap = 16

    // Calculate number of rows to set grid view
    const rows = data.reduce((all, one, i) => {
        const ch = Math.floor(i/desktopSlides) 
        all[ch] = [].concat((all[ch]||[]),one) 
        return all
     }, []).length

    // Carousel options
    const options: SwiperProps = {
        speed: 500,
        slidesPerView: mobilePortraitSlides,
        slidesPerGroup: 1,
        spaceBetween: mobileGap,

        breakpoints: {
            480: { slidesPerView: mobileLandscapeSlides },
            768: { slidesPerView: tabletLandscapeSlides },
            1200: { 
                slidesPerView: desktopSlides,
                spaceBetween: desktopGap,
            }
        }
    }

    useEffect(() => setDirection(rtl ? 'rtl' : 'ltr'), [rtl])

    /**
     * 
     * Event before swiper init to set navigation ref
     * @param swiper 
     */
    const onBeforeInit = (swiper: SwiperClass) => {
        const navigation = swiper.params.navigation
        if (navigation && typeof navigation !== 'boolean') {
            navigation.prevEl = prev.current
            navigation.nextEl = next.current
        }
    }

    // Set autoplay option
    if (autoplay) {
        options.autoplay = {
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        }
    }

    // Set grid layout for desktop view
    if (grid && options.breakpoints) {
        options.breakpoints[1200].grid = {
            rows: rows,
            fill: 'row'
        }
    }

    // Set swiper pagination option
    if (pagination) {
        options.pagination = {
            clickable: true,
            dynamicBullets: true
        }
    }


    return (
        <div className='swiper-carousel'>
            <Swiper 
                key={direction}
                dir={direction}
                modules={[A11y, Autoplay, Grid, Navigation, Pagination]} 
                onBeforeInit={onBeforeInit}
                onAfterInit={onAfterInit}
                {...options}
            >
                {data.map((slide, index) => 
                    <SwiperSlide key={index}>
                        {createElement(Component, {
                            data: slide,
                            ...childProps
                        })}
                    </SwiperSlide>
                )}
            </Swiper>

            {/* Swiper controls */}
            {navigation && (
                <>
                    <div 
                        ref={prev}
                        className='swiper-button-prev btn-default rounded-pill'
                    />
                    <div 
                        ref={next}
                        className='swiper-button-next btn-default rounded-pill'
                    />
                </>
            )}
        </div>
    )
}


Carousel.propTypes = propTypes as any
Carousel.displayName = 'Carousel'

export default Carousel