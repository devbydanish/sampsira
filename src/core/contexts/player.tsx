"use client"

import React, { createContext, useContext, useRef, useState } from 'react'
import { TrackTypes } from '@/core/types'
import { enqueueSnackbar } from 'notistack'

interface PlayerContextType {
    tracks: any[];
    songSize: number;
    isPlaying: boolean;
    activeSong: {
        href?: string;
        title?: string;
        type?: string;
        Producers?: Array<{
            id: string;
            name: string;
        }>;
    };
    activeTrack?: {
        id?: string | number;
        type?: string;
    };
    playAll: (playlist: TrackTypes[]) => void;
    playPause: (track: TrackTypes) => void;
    setPlayerStatus: () => void;
    audioRef: React.RefObject<HTMLAudioElement>;
    handleMediaClick: (play?: boolean) => void;
    addSong: (song: any, playlist?: any) => void;
    removeSong: (id: number) => void;
    isQueueSong: (src: string) => boolean;
    isInQueue: (id: number) => boolean;
    playSong: (song: any) => Promise<void>;
    mediaSession: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

// Constants
const ARTWORK_SIZES = ['96x96', '128x128', '192x192', '256x256', '384x384', '512x512']
const SONGS: string[] = []
const MEDIA_CONTROLS = {
    playPause: false,
    nextPrev: false
}

// Initialize Amplitude
declare global {
    interface Window { 
        Amplitude: any;
        MediaMetadata: any;
    }
}

const Amplitude = typeof window !== 'undefined' ? window.Amplitude : null

export interface PlayerProviderProps {
    children: React.ReactNode;
}

/**
 * Player Context Provider
 */
const PlayerProvider = ({ children }: PlayerProviderProps) => {
    const [activeSong, setActiveSong] = useState<any>([])
    const [tracks, setTracks] = useState<any[]>([])
    const [songSize, setSongSize] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [activeTrack, setActiveTrack] = useState<{ id?: string | number; type?: string }>({})

    const audioRef = useRef<HTMLAudioElement | null>(null)

    const playAll = (playlist: TrackTypes[]) => {
        // Implementation for playing all tracks
        console.log('Playing all tracks', playlist)
    }

    const playPause = (track: TrackTypes) => {
        console.log('PlayPause called with track:', track);
        console.log('Current activeTrack:', activeTrack);
        console.log('Current isPlaying:', isPlaying);

        if (activeTrack?.id === track.id) {
            // If it's the same track, toggle play/pause
            handleMediaClick(!isPlaying);
        } else {
            // If it's a new track, update activeTrack and play it
            setActiveTrack(track);
            playSong(track);
        }
    }

    const setPlayerStatus = () => {
        handleMediaClick(!isPlaying);
    }

    // Queue add tracks in player
    const addSong = (song: any, playlist?: any) => {
        try {
            if (!isQueueSong(song.src)) {
                SONGS.push(song.src)
                setSongSize(tracks => tracks + 1)
                setTracks((prevTracks: any) => [...prevTracks, song])
            }
        } catch (error) {
            console.error('Error adding song:', error)
        }
    }

    const removeSong = (id: number) => {
        setSongSize(tracks => tracks - 1)
        setTracks((prevTracks: any[]) => prevTracks.filter(song => song.id !== id))

        // Remove song in Amplitude
        Amplitude?.removeSong(id)
    }

    // Queue check song in player
    const isQueueSong = (src: string) => {
        return SONGS.includes(src)
    }

    // Play song
    const playSong = async (song: any) => {
        try {
            // Create audio element if needed
            if (!audioRef.current) {
                audioRef.current = new Audio()
            }

            // Get the audio URL
            const audioUrl = song.src;
            if (!audioUrl) {
                throw new Error('No audio URL provided');
            }

            console.log('Playing audio from URL:', audioUrl);

            // Set audio source
            audioRef.current.src = audioUrl;
            
            // Set accept header for audio/mpeg
            if (audioRef.current instanceof HTMLAudioElement) {
                const audioElement = audioRef.current as HTMLAudioElement & { mozSetup?: (channels: number, sampleRate: number) => void };
                if (typeof audioElement.mozSetup === 'function') {
                    audioElement.mozSetup(2, 44100); // For Firefox legacy support
                }
            }
            
            // Load and play
            await audioRef.current.load();
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Audio started playing successfully');
                    setIsPlaying(true);
                    setActiveSong(song);
                    setActiveTrack(song);
                }).catch(error => {
                    console.error('Error playing audio:', error);
                    setIsPlaying(false);
                });
            }

            // Add to queue
            addSong(song);

        } catch (error) {
            console.error('Error playing song:', error);
            setActiveSong(song);
            setIsPlaying(false);
        }
    }

    // Handle media click
    const handleMediaClick = (play?: boolean) => {
        try {
            if (audioRef.current) {
                if (play) {
                    const playPromise = audioRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            setIsPlaying(true);
                        }).catch(error => {
                            console.error('Error playing audio:', error);
                            setIsPlaying(false);
                        });
                    }
                } else {
                    audioRef.current.pause();
                    setIsPlaying(false);
                }
            }
        } catch (error) {
            console.error('Error handling media click:', error);
            setIsPlaying(false);
        }
    }

    // Check song in queue
    const isInQueue = (id: number) => {
        const SONG = tracks.find((song: any) => song.id === id)
        return !!SONG;
    }

    // Initialize browser media features
    const mediaSession = () => {  
        const nextTrack = () => SONGS.length >= 2 
            ? Amplitude?.next(Amplitude.getActivePlaylist() || '')
            : enqueueSnackbar('Song lineup is empty')
        
        const prevTrack = () => SONGS.length >= 2 
            ? Amplitude?.prev(Amplitude.getActivePlaylist() || '')
            : enqueueSnackbar('Song lineup is empty')

        if ('mediaSession' in navigator) {
            const MEDIA = navigator.mediaSession
            // Set song meta on notification
            MEDIA.metadata = new window.MediaMetadata({
                title: activeSong.title,
                artist: activeSong.Producers
                    ? activeSong.Producers?.map((producer: { name: string }) => producer.name).join(',')
                    : '',
                album: activeSong.sound_kit ? activeSong.sound_kit?.name : '',
                artwork: ARTWORK_SIZES.map(size => ({
                    src: activeSong.cover,
                    sizes: size,
                    type: 'image/png'
                }))
            })
    
            if (SONGS.length >= 1 && !MEDIA_CONTROLS.playPause) {
                MEDIA_CONTROLS.playPause = true
                MEDIA.setActionHandler('play', () => handleMediaClick(true))
                MEDIA.setActionHandler('pause', () => handleMediaClick())
            }
        
            if (SONGS.length >= 2 && !MEDIA_CONTROLS.nextPrev) {
                MEDIA_CONTROLS.nextPrev = true
                MEDIA.setActionHandler('previoustrack', prevTrack)
                MEDIA.setActionHandler('nexttrack', nextTrack)
            }
        }
    }

    // Context value
    const value: PlayerContextType = {
        tracks,
        songSize,
        isPlaying,
        activeSong,
        activeTrack,
        audioRef,
        handleMediaClick,
        addSong,
        removeSong,
        isQueueSong,
        isInQueue,
        playSong,
        mediaSession,
        playAll,
        playPause,
        setPlayerStatus
    }

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider')
    }
    return context
}

export { PlayerProvider as default }
