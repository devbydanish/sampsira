/**
 * @name Search
 * @file search.tsx
 * @description header search component
 */
"use client"


// Modules
import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { RiSearch2Line } from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Components
import Scrollbar from '../scrollbar'

// Utilities
import { SEARCH_RESULTS } from '@/core/constants/constant'

interface Track {
    id: number;
    attributes: {
        title: string;
        bpm: number;
        moods: string;
        keys: string;
        genre: string;
        cover: {
            data: {
                attributes: {
                    formats: {
                        small: {
                            url: string;
                        };
                    };
                    url: string;
                };
            };
        };
        producer: {
            data: {
                id: number;
                attributes: {
                    displayName: string;
                };
            };
        };
    };
}

const Search: React.FC = () => {
    
    const pathname = usePathname()
    const {replaceClassName} = useTheme()
    const searchRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState<any>({
        samples: [],
        soundKits: [],
        producers: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const locale = useTranslations()
    const sidebar = useTranslations('sidebar')

    const debounce = (func: Function, wait: number) => {
        let timeout: NodeJS.Timeout
        return (...args: any[]) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait)
        }
    }

    const fetchSearchResults = useCallback(async (query: string) => {
        if (!query) {
            setSearchResults({ samples: [], soundKits: [], producers: [] })
            return
        }

        try {
            setIsLoading(true)
            const token = localStorage.getItem('jwt')
            if (!token) return

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks?filters[title][$containsi]=${query}&populate=*`
            )

            if (response.ok) {
                const data = await response.json()
                setSearchResults({
                    samples: data.data || [],
                    soundKits: [],
                    producers: []
                })
            }
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const debouncedSearch = useCallback(
        debounce((value: string) => fetchSearchResults(value), 300),
        [fetchSearchResults]
    )

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchInput(value)
        debouncedSearch(value)
    }

    // Add/Remove DOM click event
    useEffect(() => {
        document.addEventListener('click', handleDOMClick)
        return () => document.removeEventListener('click', handleDOMClick)

    }, [isOpen])

    // Close search on route change
    useEffect(() => closeSearch, [pathname])


    /**
     * 
     * Handle `onClick` event to show search
     */
    const handleClick = () => {
        document.body.setAttribute(SEARCH_RESULTS, 'true')
        setIsOpen(true)
    }

    /**
     * 
     * Handle DOM `onClick` event to hide search
     * @param event 
     */
    const handleDOMClick = (event: any) => {
        const { current } = searchRef
        if (current && !current.contains(event.target)) closeSearch()
    }

    /**
     * 
     * Close search
     */
    const closeSearch = () => {
        if (isOpen) {
            document.body.removeAttribute(SEARCH_RESULTS)
            setIsOpen(false)
        }
    }


    return (
        <>
            {/* Search form [[ Find at scss/framework/search.scss ]] */}
            <form id='search_form' className={replaceClassName('me-3')}>
                <label htmlFor='search_input'>
                    <RiSearch2Line />
                </label>
                <input
                    id='search_input'
                    className='form-control form-control-sm'
                    placeholder='Search for samples, sound kits, producers...'
                    value={searchInput}
                    onChange={handleSearchInput}
                    onClick={handleClick}
                />
            </form>

            {/* Search form [[ Find at scss/framework/search.scss ]] */}
            <div 
                ref={searchRef}
                id='search_results' 
                className='search pb-3'
            >
                <div className='search__head'>
                    <button type='button' className='btn btn-sm btn-light-primary active'>{locale('samples')}</button>
                    <button type='button' className='btn btn-sm btn-light-primary'>{sidebar('sound_kits')}</button>
                    <button type='button' className='btn btn-sm btn-light-primary'>{sidebar('producers')}</button>
                </div>
                <Scrollbar className='flex-1'>
                    <div className='search__body'>
                        {/* Samples Section */}
                        {(isLoading || searchResults.samples.length > 0) && (
                            <div className='mb-4'>
                                <div className='mb-3'>
                                    <span className='search__title text-white'>{locale('samples')}</span>
                                </div>
                                <div className='row g-4 list'>
                                    {isLoading ? (
                                        <div className="col-12 text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : searchResults.samples.length > 0 && (
                                        searchResults.samples.map((track: Track) => (
                                            <div key={track.id} className='col-xl-3 col-md-4 col-sm-6'>
                                                <div className='list__item'>
                                                    <Link href={`/samples/${track.id}`} className='list__cover'>
                                                        <div className='ratio ratio-1x1'>
                                                            <Image
                                                                src={
                                                                    track.attributes.cover?.data?.attributes.formats?.small?.url
                                                                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${track.attributes.cover.data.attributes.formats.small.url}`
                                                                    : '/images/cover/small/default.jpg'
                                                                }
                                                                width={128}
                                                                height={128}
                                                                alt={track.attributes.title}
                                                            />
                                                        </div>
                                                    </Link>
                                                    <div className='list__content'>
                                                        <Link href={`/samples/${track.id}`} className='list__title text-truncate'>
                                                            {track.attributes.title}
                                                        </Link>
                                                        <div className='list__subtitle text-truncate'>
                                                            <Link href={`/producers/${track.attributes.producer.data.id}`}>
                                                                {track.attributes.producer.data.attributes.displayName}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Sound Kits Section */}
                        {(isLoading || searchResults.soundKits.length > 0) && (
                            <div className='mb-4'>
                                <div className='mb-3'>
                                    <span className='search__title text-white'>{sidebar('sound_kits')}</span>
                                </div>
                                <div className='row g-4 list'>
                                    {isLoading ? (
                                        <div className="col-12 text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : searchResults.soundKits.length > 0 && (
                                        searchResults.soundKits.map((kit: any) => (
                                            <div key={kit.id} className='col-xl-3 col-md-4 col-sm-6'>
                                                <div className='list__item'>
                                                    <Link href={`/sound_kits/${kit.id}`} className='list__cover'>
                                                        <div className='ratio ratio-1x1'>
                                                            <Image
                                                                src={kit.cover?.url || '/images/cover/small/default.jpg'}
                                                                width={128}
                                                                height={128}
                                                                alt={kit.title}
                                                            />
                                                        </div>
                                                    </Link>
                                                    <div className='list__content'>
                                                        <Link href={`/sound_kits/${kit.id}`} className='list__title text-truncate'>
                                                            {kit.title}
                                                        </Link>
                                                        <div className='list__subtitle text-truncate'>
                                                            <Link href={`/producers/${kit.producer.id}`}>
                                                                {kit.producer.name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Producers Section */}
                        {(isLoading || searchResults.producers.length > 0) && (
                            <div>
                                <div className='mb-3'>
                                    <span className='search__title text-white'>{sidebar('producers')}</span>
                                </div>
                                <div className='row g-4 list'>
                                    {isLoading ? (
                                        <div className="col-12 text-center">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : searchResults.producers.length > 0 && (
                                        searchResults.producers.map((producer: any) => (
                                            <div key={producer.id} className='col-xl-3 col-md-4 col-sm-6'>
                                                <div className='list__item'>
                                                    <Link href={`/producers/${producer.id}`} className='list__cover'>
                                                        <div className='ratio ratio-1x1'>
                                                            <Image
                                                                src={producer.cover || '/images/cover/large/default.jpg'}
                                                                width={128}
                                                                height={128}
                                                                alt={producer.name}
                                                            />
                                                        </div>
                                                    </Link>
                                                    <div className='list__content'>
                                                        <Link href={`/producers/${producer.id}`} className='list__title text-truncate'>
                                                            {producer.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* No results message */}
                        {!isLoading && searchInput && 
                         searchResults.samples.length === 0 && 
                         searchResults.soundKits.length === 0 && 
                         searchResults.producers.length === 0 && (
                            <div className="text-center py-4">
                                <p>No results found for "{searchInput}"</p>
                            </div>
                        )}
                    </div>
                </Scrollbar>
            </div>
        </>
    )
}


Search.displayName = 'Search'
export default Search