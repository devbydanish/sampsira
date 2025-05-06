/**
 * @name Theme
 * @file theme.tsx
 * @description use to change theme skins & direction
 */
"use client"


// Modules
import React, { 
    createContext,
    useContext, 
    useEffect, 
    useMemo, 
    useState 
} from 'react'
import classNames from 'classnames'

// Utilities
import { getReversePrefix, getReverseSuffix, isDark } from '../utils'
import { 
    ENABLE_RTL,
    HEADER_THEME,
    PLAYER_THEME,
    SIDEBAR_THEME,
    THEME,
    THEME_MODE
} from '../constants/constant'
import { 
    ComponentNameTypes, 
    ComponentSkinTypes, 
    ThemeModeTypes 
} from '../types'
import { setLocale } from '@/locales'

interface ThemeContextProps {

    /**
     * 
     * Toggle RTL direction `onClick`
     */
    toggleRTL: () => void

    /**
     * 
     * Set theme mode {light|dark|system}
     * @param mode 
     */
    setTheme: (mode: ThemeModeTypes) => void

    /**
     * 
     * Replace class name based on text direction.
     * @param className 
     * @returns 
     */
    replaceClassName: (className: string) => string

    /**
     * 
     * Change component skin 
     * @param componentName 
     * @param color 
     */
    changeComponentSkin: (
        componentName: ComponentNameTypes, 
        color: ComponentSkinTypes
    ) => void

    /**
     * 
     * Header component skin
     * Options {red|green|blue|orange|yellow|purple|indigo|pink|violet|magenta}
     * 
     * @default 'blue'
     */
    headerSkin: ComponentSkinTypes

    /**
     * 
     * Player component skin
     * Options {red|green|blue|orange|yellow|purple|indigo|pink|violet|magenta}
     * 
     * @default 'blue'
     */
    playerSkin: ComponentSkinTypes

    /**
     * 
     * Sidebar component skin
     * Options {red|green|blue|orange|yellow|purple|indigo|pink|violet|magenta}
     * 
     * @default 'blue'
     */
    sidebarSkin: ComponentSkinTypes

    /**
     * 
     * Template theme
     * Options {light|dark|system}
     * 
     * @default 'light'
     */
    theme: ThemeModeTypes

    /**
     * 
     * Text direction
     * 
     * @default false
     */
    rtl: boolean
}

const ThemeContext = createContext({} as ThemeContextProps)

interface ThemeProps {
    children: React.ReactNode
}


const Theme: React.FC<ThemeProps> = (props) => {
    
    const [themeMode, setThemeMode] = useState<ThemeModeTypes>(THEME_MODE)
    const [headerSkin, setHeaderSkin] = useState<ComponentSkinTypes>(HEADER_THEME)
    const [playerSkin, setPlayerSkin] = useState<ComponentSkinTypes>(PLAYER_THEME)
    const [sidebarSkin, setSidebarSkin] = useState<ComponentSkinTypes>(SIDEBAR_THEME)
    const [isRTL, setIsRTL] = useState<boolean>(ENABLE_RTL)
    
    // Change theme
    useEffect(() => {
        isDark(themeMode) 
            ? document.body.setAttribute(THEME, 'dark')
            : document.body.removeAttribute(THEME)

    }, [themeMode])
    
    // Change text direction
    useEffect(() => {
        if (isRTL) {
            document.documentElement.setAttribute('dir', 'rtl')
            setLocale('ar')

        } else {
            document.documentElement.removeAttribute('dir')
            setLocale('en')
        }

    }, [isRTL])


    const setTheme = (mode: ThemeModeTypes) => setThemeMode(mode)

    const changeComponentSkin = (
        componentName: ComponentNameTypes, 
        color: ComponentSkinTypes
    ) => {
        switch (componentName) {
            case 'header':
                setHeaderSkin(color)
                break

            case 'sidebar':
                setSidebarSkin(color)
                break

            case 'player':
                setPlayerSkin(color)
                break
        
            default:
                break
        }
    }

    const replaceClassName = (className: string) => {
        const classList = className.split(' ')
        const prefixList = ['ms', 'me', 'ps', 'pe']
        const suffixList = ['start', 'end']

        if (isRTL) {
            classList.forEach((cl, index) => {
                const isPrefix = prefixList.some(prefix =>  cl.startsWith(prefix))
                const isSuffix = suffixList.some(suffix =>  cl.endsWith(suffix))

                classList[index] = isPrefix 
                    ? getReversePrefix(cl)
                    : isSuffix
                    ? getReverseSuffix(cl)
                    : cl
            })
        }

        return classNames(classList)
    }

    const context = useMemo(() => ({
        toggleRTL() {
            setIsRTL(prev => !prev)
        },
        replaceClassName,
        changeComponentSkin,
        setTheme,
        headerSkin,
        playerSkin,
        sidebarSkin,
        theme: themeMode,
        rtl: isRTL,

    }), [themeMode, headerSkin, sidebarSkin, playerSkin, isRTL])


    return <ThemeContext.Provider value={context} {...props} />
}


Theme.displayName = 'Theme'
export default Theme


/**
 * 
 * Theme context hook
 * @returns 
 */
export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a Theme')
    }

    return context
}