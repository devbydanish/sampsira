/**
 * 
 * @file index.ts
 * @description utility function
 */

// Module
import moment from 'moment'

// Utilities
import { SIDEBAR_TOGGLE } from '../constants/constant'
import { InfoType, ThemeModeTypes } from '../types'


/**
 * Check for string value
 * @param str 
 * @returns 
 */
export const isString = (str: any): boolean => {
    return (typeof str === 'string' || new String(str)) ? true : false
}

/**
 * Convert string into number
 * @param str 
 * @returns
 */
export const getInt = (str: any): number => {
    return isString(str) ? parseInt(str, 10) : str
}

/**
 * Convert string into float number
 * @param str 
 * @returns
 */
export const getFloat = (str: any): number => {
    return isString(str) ? parseFloat(str) : str
}

/**
 * Formate remote date into local date
 * @param str 
 * @returns
 */
export const localDate = (str: string): string => {
    return str ? moment(str, 'MM/DD/YYYY').format('ll') : str
}

/**
 * Remove HTML tags from string
 * @param str 
 * @returns
 */
export const removeHtml = (str: string): string => {
    return str.replace(/<\/?[^>]+(>|$)/g, '')
}

/**
 * Check element has class
 * @param el 
 * @param className 
 * @returns
 */
export const hasClass = (el: HTMLElement, className: string) => {
    return el.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className)
}

/**
 * Add class on element
 * @param el 
 * @param className 
 */
export const addClass = (el: HTMLElement, className: string) => {
    if (!hasClass(el, className) ) 
        el.className += (el.className ? ' ' : '') + className
}

/**
 * Remove class from element
 * @param el 
 * @param className 
 */
export const removeClass = (el: HTMLElement, className: any): void => {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className = el.className.replace(reg, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

/**
 * Toggle sidebar on button click
 * @param event 
 */
export const toggleSidebar = (event: any): void => {
    const target = event.currentTarget as HTMLElement
    const body = document.body

    if (body.hasAttribute(SIDEBAR_TOGGLE)) {
        removeClass(target, 'active')
        body.removeAttribute(SIDEBAR_TOGGLE)

    } else {
        addClass(target, 'active')
        body.setAttribute(SIDEBAR_TOGGLE, 'true')
    }
}

/**
 * Get suitable producer name for player
 * @param data 
 * @returns
 */
export const getPersonName = (data: InfoType[]): string => {
    return data?.map((d: { name: string }) => d.name).join(', ')
}

/**
 * Get person data from api data
 * @param data 
 * @returns 
 */
export const getPersonInfo = (data: any): InfoType[] => {
    let list = [] as InfoType[]
    if (data) {
        list = data.map((item: any) => {
            item.id = getInt(item.id)
            item.name = item.name
            return item
        })
    }

    return list
}

/**
 * Get the reverse prefix base on string.
 * Ex. (ms-1 to me-1), (me-1 to ms-1), (ps-1 to pe-1), (pe-1 to ps-1)
 * 
 * @param name 
 * @returns 
 */
export const getReversePrefix = (name: string) => {
    const list = name.split('-')
    const prefix = list[0]

    const replace = prefix.endsWith('e') 
        ? prefix.replace('e', 's') 
        : prefix.replace('s', 'e')

    list[0] = list[0].replace(prefix, replace)
    return list.join('-')
}

/**
 * Get the reverse suffix base on string.
 * Ex. (text-start to text-end), (text-end to text-start)
 * 
 * @param name 
 * @returns 
 */
export const getReverseSuffix = (name: string) => {
    const replace = name.endsWith('start')
        ? name.replace('start', 'end') 
        : name.replace('end', 'start')

    name = name.replace(name, replace)
    return name
}

/**
 * Check theme mode
 * @param theme 
 * @returns 
 */
export const isDark = (theme: ThemeModeTypes) => {
    return (theme === 'dark' ||  (
        theme === 'system'
        && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches
    ))
}

/**
 * Set timeout
 * @param ms 
 * @returns 
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Title function
 * @param locale 
 * @param name 
 * @returns
 */
export const title = (locale: any, name: string) => {
    return locale.markup(name, {
        primary: (chunks: any) => `<span class='text-primary'>${chunks}</span>`
    })
}

export const capitalize = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


// Export Utils class
const Utils = {}
export default Object.assign(Utils, {
    isString,
    getInt,
    getFloat,
    localDate,
    removeHtml,
    hasClass,
    addClass,
    removeClass,
    toggleSidebar,
    getPersonName,
    getPersonInfo,
    getReversePrefix,
    getReverseSuffix,
    isDark,
    delay,
    title,
    /**
     * Capitalize first letter of a string
     * @param str
     * @returns
     */
    capitalize: (str: string): string => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
})