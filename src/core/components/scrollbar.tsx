/**
 * @name Scrollbar
 * @file scrollbar.tsx
 * @description react-custom-scrollbars-2 scrollbar component
 */
"use client"


// Modules
import React from 'react'
import { Scrollbars, ScrollbarProps } from 'react-custom-scrollbars-2'

// Contexts
import { useTheme } from '../contexts/theme'

// Hooks
import useCSSVar from '../hooks/useCSSVar'


const Scrollbar: React.FC<ScrollbarProps> = (props) => {

    const {theme, rtl} = useTheme()
    const thumbColor = (theme === 'dark') ? '#474761' : useCSSVar('gray-400')
    const trackStyles = rtl ? {left: 2} : {right: 2}


    /**
     * 
     * Get scrollbar margin based on text direction
     * @param style 
     * @returns 
     */
    const getViewMargin = (style: React.CSSProperties) => {
        const {marginRight} = style        
        return rtl 
            ? {marginLeft: marginRight, marginRight: 0} 
            : {marginRight: marginRight}
    }


    return (
        <Scrollbars
            universal={true}
            renderView={({ style, ...props }) =>
                <div {...props} style={{ 
                    ...style,
                    ...getViewMargin(style)
                }} />
            }
            renderTrackHorizontal={({ style, ...props }) =>
                <div {...props} style={{ 
                    ...style,
                    height: 4,
                    left: 0,
                    width: '100%',
                    bottom: 0,
                }} />
            }
            renderThumbHorizontal={({ style, ...props }) =>
                <div {...props} style={{
                    backgroundColor: thumbColor
                }} />
            }
            renderTrackVertical={({ style, ...props }) =>
                <div {...props} style={{ 
                    ...style,
                    ...trackStyles,
                    width: 4,
                    height: '100%',
                    top: 0,
                    borderRadius: 4
                }} />
            }
            renderThumbVertical={({ style, ...props }) =>
                <div {...props} style={{
                    backgroundColor: thumbColor
                }} />
            }
            {...props}
        />
    )
}


Scrollbar.displayName = 'Scrollbar'
export default Scrollbar