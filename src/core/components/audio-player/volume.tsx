/**
 * @name Volume
 * @file volume.tsx
 * @description audio player volume component
 */
"use client"


// Modules
import React, { useEffect, useState } from 'react'
import { 
    RiVolumeDownFill, 
    RiVolumeMuteFill, 
    RiVolumeUpFill
} from '@remixicon/react'

// Context
import { useTheme } from '@/core/contexts/theme'

// Hooks
import useCSSVar from '@/core/hooks/useCSSVar'

// Utilities
import { getInt, isDark } from '@/core/utils'


const Volume: React.FC = () => {

    const {theme} = useTheme()
    const darkColor = useCSSVar('dark-rgb')

    const [volume, setVolume] = useState('50')
    const [gradient, setGradient] = useState<string>()
    const value = getInt(volume)

    useEffect(() => {
        const color = isDark(theme) ? '255, 255, 255' : darkColor
        setGradient(
            `linear-gradient(to right, rgb(${color}) 0%, 
            rgb(${color}) ${value}%, rgba(${color}, 0.2) ${value}%, 
            rgba(${color}, 0.2) 100%)`
        )

    }, [theme, volume])


    return (
        <div className='player-volume dropdown d-none d-md-inline-flex'>
            <button 
                className='btn btn-icon' 
                data-bs-toggle='dropdown'
                data-bs-auto-close='outside' 
                aria-label='Volume' 
                aria-expanded='false'
            >
                {(value === 0)
                    ? (<RiVolumeMuteFill size={20} />) 
                    : (value > 0 && value < 70)
                    ? (<RiVolumeDownFill size={20} />)
                    : (<RiVolumeUpFill size={20} />)
                }
            </button>
            <div className='dropdown-menu'>
                <input 
                    type='range' 
                    className='amplitude-volume-slider' 
                    value={volume}
                    min='0' 
                    max='100' 
                    onChange={(e) => setVolume(e.target.value)}
                    aria-label='Volume slider'
                    style={{background: gradient}}
                />
            </div>
        </div>
    )
}


Volume.displayName = 'Volume'
export default Volume