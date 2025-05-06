/**
 * @name Settings
 * @file settings.tsx
 * @description template settings component
 */
"use client"


// Modules
import React, { useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
    RiCheckboxCircleFill, 
    RiCloseFill, 
    RiInformation2Line, 
    RiSettingsLine 
} from '@remixicon/react'
import { useEventListener } from 'usehooks-ts'

// Contexts
import { useTheme } from '../contexts/theme'

// Components
import Scrollbar from './scrollbar'

// Utilities
import { hasClass, removeClass } from '../utils'
import { SHOW } from '../constants/constant'
import { 
    ComponentNameTypes, 
    ComponentSkinTypes, 
    ThemeModeTypes 
} from '../types'


const Settings: React.FC = () => {

    const {
        changeComponentSkin, 
        replaceClassName,
        setTheme, 
        toggleRTL,
        headerSkin, 
        playerSkin, 
        sidebarSkin, 
        theme
    } = useTheme()
    const [isShowInfo, setIsShowInfo] = useState(false)
    const pathname = usePathname()

    const settingRef = useRef<HTMLDivElement | null>(null)
    const documentRef = useRef<Document | null>(null)

    const colors = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'indigo', 'pink', 'violet', 'magenta']
    const themeOptions = ['light', 'dark', 'system']
    const componentOptions = [
        {
            title: 'header',
            colors: colors
        },
        {
            title: 'sidebar',
            colors: colors
        },
        {
            title: 'player',
            colors: colors
        }
    ]

    useEffect(() => setIsShowInfo(!pathname.startsWith('/music')), [pathname])

    useEffect(() => {documentRef.current = document}, [])


    /**
     * 
     * Get `active` class based on component and color
     * @param component 
     * @param color 
     * @returns 
     */
    const getActive = (
        component: ComponentNameTypes, 
        color: ComponentSkinTypes
    ) => {
        if (component === 'header' && color === headerSkin) {
            return 'active'
        } else if (component === 'player' && color === playerSkin) {
            return 'active'
        } else if (component === 'sidebar' && color === sidebarSkin) {
            return 'active'
        }
    }

    /**
     * 
     * Handle DOM click event to hide settings
     * @param event 
     */
    const handleDOMClick = (event: any) => {
        const { current } = settingRef
        if (
            current && 
            !current.contains(event.target) &&
            hasClass(settingRef.current as HTMLElement, SHOW)
        ) {
            removeClass(settingRef.current as HTMLElement, SHOW)
        }
    }

    /**
     * 
     * Toggle settings sidebar
     */
    const toggleSettings = useCallback(() => 
        settingRef.current?.classList.toggle('show'), []
    )

    useEventListener('click', handleDOMClick, documentRef)


    return (
        <div id='setting' ref={settingRef}>
            <a 
                role='button' 
                id='setting_toggler' 
                aria-label='Settings'
                onClick={toggleSettings}
            >
                <RiSettingsLine />
            </a>
            
            <div className='setting__wrapper'>
                <div className='setting__head'>
                    <span className={replaceClassName('me-auto')}>Theme Settings</span>
                    <a 
                        role='button' 
                        id='setting_close' 
                        aria-label='Close settings'
                        onClick={toggleSettings}
                    >
                        <RiCloseFill />
                    </a>
                </div>
                <Scrollbar className='flex-1'>
                    <div className='setting__body'>
                        <span className='setting__title'>Theme Appearance</span>
                        <div className='setting__theme'>
                            {themeOptions.map(option => (
                                <a 
                                    key={option} 
                                    role='button' 
                                    onClick={() => setTheme(option as ThemeModeTypes)}
                                    className={classNames(
                                        'setting__option',
                                        theme === option && 'active'
                                    )}
                                >
                                    <Image
                                        src={'/images/misc/' + option + '.svg'}
                                        width={94}
                                        height={45}
                                        alt=''
                                    />
                                    <div className='setting__theme__title'>{option}</div>
                                    <RiCheckboxCircleFill 
                                        size={16} 
                                        className='ri-checkbox-circle-fill' 
                                    />
                                </a>
                            ))}
                        </div>

                        <div className='setting__rtl'>
                            <label htmlFor='rtl' className='setting__title mb-0'>Right-To-Left</label>
                            <div className={replaceClassName('ms-auto switch')}>
                                <input type='checkbox' id='rtl' className='setting__option' onChange={toggleRTL} />
                                <label htmlFor='rtl'></label>
                            </div>
                        </div>

                        <span className='setting__title'>Component Appearance</span>
                        <div className='setting__card'>
                            {componentOptions.map(component => (
                                <div key={component.title} className='setting__card__item'>
                                    <span className='setting__title'>{component.title}</span>
                                    <div className='setting__options'>
                                        {component.colors.map(color => (
                                            <a 
                                                key={color}
                                                role='button' 
                                                aria-label={'Color ' + color}
                                                onClick={() => changeComponentSkin(
                                                    component.title as ComponentNameTypes, 
                                                    color as ComponentSkinTypes
                                                )}
                                                className={classNames(
                                                    'setting__option',
                                                    'setting__option--' + color,
                                                    getActive(
                                                        component.title as ComponentNameTypes, 
                                                        color as ComponentSkinTypes
                                                    )
                                                )} 
                                                data-color-option={color}
                                            />
                                        ))}
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                </Scrollbar>
                {isShowInfo && (
                    <div className='setting__info'>
                        <span className={replaceClassName('me-2')}>
                            <RiInformation2Line />
                        </span>
                        <span className='flex-grow-1'>
                            You can observe the color change effect in the header, sidebar, and player components on the inner pages.
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}


Settings.displayName = 'Settings'
export default Settings