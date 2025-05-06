/**
 * 
 * @file icon.ts
 * @description convert icon name {string} to react element.
 */

// Modules
import { createElement } from 'react'
import * as Icons from '@remixicon/react'


/**
 * 
 * Convert icon name to lib compatible
 * 
 * @example 
 * 'ri-arrow-top-line' to 'RiArrowTopLine'
 * 
 * @param name 
 * @returns 
 */
function iconName(name: string) {
    name = name.toLowerCase()
    return name.replace(/(^|\/|-)(\S)/g, s => s.toUpperCase()).replace(/-/g, '')
}

/**
 * 
 * Get react element from icon name
 * 
 * @example 
 * 'ri-arrow-top-line' to '<RiArrowTopLine />'
 * 
 * @param name 
 * @param size 
 * @returns 
 */
export default function IconEl(name: string, size: number = 24) {
    name = iconName(name)
    return createElement(Icons[name as keyof typeof Icons], {size: size})
}