/**
 * @name Loading
 * @file loading.tsx
 * @description page loader component
 */
"use client"


// Modules
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// Utilities
import { delay } from '../utils'


const Loading: React.FC = () => {
    
    const pathname = usePathname()

    const [isLoading, setIsLoading] = useState(true)
    const [lastPath, setLastPath] = useState('')

    useEffect(() => {
        if (lastPath !== pathname) {
            setLastPath(pathname)
            setIsLoading(true)
            delay(1000).then(() => {
                setIsLoading(false)
            })
        }
    }, [pathname])
    
    
	return (
		isLoading && (
            // loader [[ Find at scss/framework/loader.scss ]]
            <div id='loader'>
                <div className='loader'>
                    <div className='loader__eq mx-auto'>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span className='loader__text mt-2'>Loading</span>
                </div>
            </div>
        )
	)
}


Loading.displayName = 'Loading'
export default Loading