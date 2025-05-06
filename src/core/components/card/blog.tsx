/**
 * @name BlogCard
 * @file blog.tsx
 * @description blog card component
 */
"use client"


// Modules
import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

// Utilities
import { BlogTypes } from '@/core/types'

interface Props {
    data: BlogTypes
}

const propTypes = {
    /**
     * Set event data
     */
    data: PropTypes.any.isRequired
}


const BlogCard: React.FC<Props> = ({data}) => {

    return (
        // Cover [[ Find at scss/components/cover.scss ]]
        <div className='cover cover--round title-line-animation'>
            <Link href={'/blog/' + data.id} className='cover__image'>
                <div className='ratio ratio-16x9'>
                    <Image 
                        src={data.image}
                        width={540}
                        height={320}
                        alt='Blog cover'
                    />
                </div>
            </Link>
            <div className='cover__foot mt-3 px-2'>
                <span className='cover__subtitle fw-medium mb-2'>{data.author} - {data.date}</span>
                <div className='h5'>
                    <Link href={'/blog/' + data.id} className='cover__title'>{data.title}</Link>
                </div>
            </div>
        </div>
    )
}


BlogCard.propTypes = propTypes as any
BlogCard.displayName = 'BlogCard'

export default BlogCard