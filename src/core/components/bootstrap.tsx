/**
 * @name Bootstrap
 * @file bootstrap.tsx
 * @description importing bootstrap javascript
 */
"use client"


// Modules
import React, { useEffect } from 'react'


const Bootstrap: React.FC = () => {

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])

    return null
}


Bootstrap.displayName = 'Bootstrap'
export default Bootstrap