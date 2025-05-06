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


const Search: React.FC = () => {
    
    const pathname = usePathname()
    const {replaceClassName} = useTheme()
    const searchRef = useRef<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState<any>({
        tracks: [],
        producers: [],
        albums: []
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
            setSearchResults({ tracks: [], producers: [], albums: [] })
            return
        }

        try {
            setIsLoading(true)
            const token = localStorage.getItem('jwt')
            if (!token) return

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tracks/search?q=${query}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            )

            if (response.ok) {
                const data = await response.json()
                setSearchResults({
                    tracks: data.tracks || [],
                    producers: data.producers || [],
                    albums: data.albums || []
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
                    placeholder='Search by title, genre, mood, etc...'
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
                    <button type='button' className='btn btn-sm btn-light-primary active'>{locale('trending')}</button>
                    <button type='button' className='btn btn-sm btn-light-primary'>{sidebar('producers')}</button>
                    <button type='button' className='btn btn-sm btn-light-primary'>{locale('tracks')}</button>
                    <button type='button' className='btn btn-sm btn-light-primary'>{sidebar('albums')}</button>
                </div>
                <Scrollbar className='flex-1'>
                    <div className='search__body'>
                        <div className='mb-4'>
                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                <span className='search__title'>{sidebar('producers')}</span>
                                <Link href='/music/producers' className='btn btn-link'>{locale('view_all')}</Link>
                            </div>
                            <div className='row g-4 list'>
                                {isLoading ? (
                                    <div className="col-12 text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : searchResults.producers.length > 0 ? (
                                    searchResults.producers.map((producer: any) => (
                                        <div key={producer.id} className='col-xl-3 col-md-4 col-sm-6'>
                                            <div className='list__item'>
                                                <Link href={`/music/producers/${producer.id}`} className='list__cover'>
                                                    <div className='ratio ratio-1x1'>
                                                        <Image
                                                            src={producer.avatar || '/images/cover/large/default.jpg'}
                                                            width={128}
                                                            height={128}
                                                            alt={producer.name}
                                                        />
                                                    </div>
                                                </Link>
                                                <div className='list__content'>
                                                    <Link href={`/music/producers/${producer.id}`} className='list__title text-truncate'>
                                                        {producer.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : searchInput && (
                                    <div className="col-12 text-center">
                                        <p>No producers found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='mb-4'>
                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                <span className='search__title'>{locale('tracks')}</span>
                                <Link href='/music/track' className='btn btn-link'>{locale('view_all')}</Link>
                            </div>
                            <div className='row g-4 list'>
                                {isLoading ? (
                                    <div className="col-12 text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : searchResults.tracks.length > 0 ? (
                                    searchResults.tracks.map((track: any) => (
                                        <div key={track.id} className='col-xl-3 col-md-4 col-sm-6'>
                                            <div className='list__item'>
                                                <Link href={`/music/track/${track.id}`} className='list__cover'>
                                                    <div className='ratio ratio-1x1'>
                                                        <Image
                                                            src={track.cover?.url || '/images/cover/small/default.jpg'}
                                                            width={128}
                                                            height={128}
                                                            alt={track.title}
                                                        />
                                                    </div>
                                                </Link>
                                                <div className='list__content'>
                                                    <Link href={`/music/track/${track.id}`} className='list__title text-truncate'>
                                                        {track.title}
                                                    </Link>
                                                    <div className='list__subtitle text-truncate'>
                                                        <Link href={`/music/producers/${track.producer.id}`}>
                                                            {track.producer.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : searchInput && (
                                    <div className="col-12 text-center">
                                        <p>No tracks found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                <span className='search__title'>{sidebar('albums')}</span>
                                <Link href='/music/album' className='btn btn-link'>{locale('view_all')}</Link>
                            </div>
                            <div className='row g-4 list'>
                                {isLoading ? (
                                    <div className="col-12 text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : searchResults.albums.length > 0 ? (
                                    searchResults.albums.map((album: any) => (
                                        <div key={album.id} className='col-xl-3 col-md-4 col-sm-6'>
                                            <div className='list__item'>
                                                <Link href={`/music/album/${album.id}`} className='list__cover'>
                                                    <div className='ratio ratio-1x1'>
                                                        <Image
                                                            src={album.cover?.url || '/images/cover/small/default.jpg'}
                                                            width={128}
                                                            height={128}
                                                            alt={album.title}
                                                        />
                                                    </div>
                                                </Link>
                                                <div className='list__content'>
                                                    <Link href={`/music/album/${album.id}`} className='list__title text-truncate'>
                                                        {album.title}
                                                    </Link>
                                                    <div className='list__subtitle text-truncate'>
                                                        <Link href={`/music/producers/${album.producer.id}`}>
                                                            {album.producer.name}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : searchInput && (
                                    <div className="col-12 text-center">
                                        <p>No albums found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Scrollbar>
            </div>
        </>
    )
}


Search.displayName = 'Search'
export default Search