/**
 * @name Blog
 * @file blog.tsx
 * @description music landing page blog section component
 */
"use client"


// Modules
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

// Components
import BlogCard from '@/core/components/card/blog'

// Utilities
import { title } from '@/core/utils'


const Blog: React.FC = () => {

    const homePage = useTranslations('home_page')


    return (
        // Main section [[ Find at scss/framework/section.scss ]]
        <section className='main-section'>
            <div className='container'>
                <div className='d-sm-flex align-items-center justify-content-between text-center mb-5'>
                    <h2 
                        className='mb-4 mb-sm-0'
                        dangerouslySetInnerHTML={{__html: title(homePage, 'blog_title')}} 
                    />
                    <Link href='/blog' className='btn btn-outline-primary'>{homePage('blog_button')}</Link>
                </div>
                <div className='row g-4 g-md-5'>
                    <div className='col-lg-4 col-sm-6'>
                        <BlogCard 
                            data={{
                                id: 1,
                                title: 'Nihil quaerat asperiores repudiandae expedita libero cupiditate.',
                                author: 'Admin',
                                date: 'Jun 20, 2022',
                                image: '/images/background/horizontal/4.jpg'
                            }}
                        />
                    </div>
                    <div className='col-lg-4 col-sm-6'>
                        <BlogCard 
                            data={{
                                id: 2,
                                title: 'Doloribus repudiandae possimus. Quia dolorum voluptatum dignissimos.',
                                author: 'Admin',
                                date: 'Jun 20, 2022',
                                image: '/images/background/horizontal/5.jpg'
                            }}
                        />
                    </div>
                    <div className='col-lg-4 col-sm-6'>
                        <BlogCard 
                            data={{
                                id: 2,
                                title: 'Molestias id porro incidunt aliquid dolor esse obcaecati maiores quas.',
                                author: 'Admin',
                                date: 'Jun 20, 2022',
                                image: '/images/background/horizontal/6.jpg'
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}


Blog.displayName = 'Blog'
export default Blog