/**
 * @name Brand
 * @file brand.tsx
 * @description music brand component
 */
"use client"


// Modules
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { BRAND, SIDEBAR_TOGGLE } from '../constants/constant'


const Brand: React.FC = () => {

    /**
     * 
     * Handle link `onClick` event
     */
    const handleClick = () => {
        document.body.removeAttribute(SIDEBAR_TOGGLE)
    }


    return (
        <Link className="brand" href={BRAND.href} onClick={handleClick}>
            <div className="brand-logo">
                <Image 
                    src={BRAND.logo} 
                    alt={BRAND.name} 
                    width={150} // Adjust based on the original logo size
                    height={50}  // Adjust based on aspect ratio
                    priority
                />
            </div>
        </Link>
    );
    
}


Brand.displayName = 'Brand'
export default Brand