/**
 * @name Tab
 * @file tab.tsx
 * @description tab component
 */
"use client"


// Modules
import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'

// Context
import { useTheme } from '../contexts/theme'

// Utilities
import { delay } from '../utils'

interface TabProps 
extends React.HTMLAttributes<Omit<HTMLUListElement, 'role'>> {
    children: React.ReactNode
}


const Tab: React.FC<TabProps> = (
    {
        children, 
        className,
        ...props
    }
) => {

    const {rtl} = useTheme()
    const tabRef = useRef<HTMLDivElement | null>(null)
    const lineRef = useRef<HTMLSpanElement | null>(null)

    useEffect(() => {
        const {current} = tabRef
        delay(1).then(() => {
            if (current) {
                const el = current.querySelector('.nav-link.active')
                const handler = (event: MouseEvent) => 
                    setLineProps(event.currentTarget as HTMLElement)
                    
                setLineProps(el as HTMLElement)
    
                const links = current.querySelectorAll('[data-bs-toggle="tab"]')
                Array.from(links).forEach((link: any) => {
                    link.addEventListener('shown.bs.tab', handler)
                    return () => link.removeEventListener('shown.bs.tab', handler)
                })
            }
        })
        
    }, [rtl])


    /**
     * 
     * Set active tab line indicator
     * @param el 
     */
    const setLineProps = (el: HTMLElement) => {
        const {current} = lineRef
        
        if (current) {
            current.style.left = el.offsetLeft + 'px'
            current.style.width = el.clientWidth + 'px'
        }
    }


    return (
        // Mat tabs [[ Find at scss/components/nav.scss ]]
        <div ref={tabRef} className={classNames('mat-tabs', className)}>
            <ul 
                className='nav nav-tabs' 
                role='tablist' 
                {...props}
            >
                {children}
            </ul>
        </div>        
    )
}


Tab.displayName = 'Tab'
export default Tab