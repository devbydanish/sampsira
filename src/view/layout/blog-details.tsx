/**
 * @name BlogDetails
 * @file blog-details.tsx
 * @description blog details page component
 */
"use client"


// Modules
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
    RiArrowLeftLine, 
    RiArrowLeftSLine, 
    RiArrowRightLine, 
    RiArrowRightSLine,
    RiFacebookCircleLine, 
    RiInstagramLine, 
    RiTwitterXFill 
} from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'


const BlogDetails: React.FC = () => {

    const {rtl, replaceClassName} = useTheme()
    const ArrowComponent = rtl ? RiArrowRightSLine : RiArrowLeftSLine
    const PrevArrowComponent = rtl ? RiArrowRightLine : RiArrowLeftLine
    const NextArrowComponent = rtl ? RiArrowLeftLine : RiArrowRightLine


    return (
        // Main section [[ Find at scss/framework/section.scss ]]
        <section className='main-section'>
            <div className='container'>
                <div className='col-xl-8 col-lg-10 mx-auto'>
                    <div className='px-md-5 px-sm-4 mb-5'>
                        <Link href='/blog' className='d-inline-flex align-items-center mb-3'>
                            <ArrowComponent />
                            <span className={replaceClassName('ps-1 fw-medium')}>Back to Blog page</span>
                        </Link>
                        <h1 className='mb-4'>Nihil quaerat asperiores repudiandae expedita libero cupiditate.</h1>
                        <p className='fw-medium mb-4'>
                            <Link href='#' style={{color: 'inherit'}}>Music</Link>{' '}
                            | Jun 20, 2022 | 2 Min read
                        </p>
                        <div className='d-sm-flex align-items-center justify-content-between'>
                            <div className='avatar avatar--lg mb-4 mb-sm-0'>
                                <div className='avatar__image'>
                                    <Image 
                                        src='/images/users/thumb.jpg' 
                                        width={128}
                                        height={128}
                                        alt='user' 
                                    />
                                </div>
                                <div className='avatar__content'>
                                    <span className='avatar__title'>Super admin</span>
                                </div>
                            </div>
                            <div className='d-flex align-items-center'>
                                <span className='fw-semibold'>Share article:</span>
                                <ul className={replaceClassName('social align-items-center ms-2')}>
                                    <li>
                                        <Link href='#' className='d-flex' aria-label='Facebook'>
                                            <RiFacebookCircleLine size={16} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='#' className='d-flex' aria-label='X'>
                                            <RiTwitterXFill size={16} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='#' className='d-flex' aria-label='Instagram'>
                                            <RiInstagramLine size={16} />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='blog-hero'>
                        <Image 
                            src='/images/background/horizontal/3.jpg' 
                            className='img-fluid w-100' 
                            width={540}
                            height={320}
                            alt='Blog cover' 
                        />
                    </div>
                    <div className='px-md-5 px-sm-4 mt-5'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi deserunt laborum voluptatem iste sunt. Consectetur aperiam in officiis illo nesciunt laborum maiores quae distinctio labore! Soluta vitae tempora id architecto?</p>
                        <p>Accusantium molestias a nam molestiae voluptatibus voluptas sunt quia adipisci dolor delectus. Maxime illo sapiente, ipsa aliquid illum excepturi eos quibusdam, nihil numquam nemo error molestias a. Consequuntur aliquid delectus esse sint, iure quisquam. Distinctio qui animi culpa commodi. Autem, rerum sint.</p>
                        <h2>Incidunt nisi magni numquam.</h2>
                        <p>Fuga ipsum dolorem aliquid, veritatis repellat quos enim corrupti reprehenderit. Quia perspiciatis quas eveniet ab nam corporis, vero soluta sapiente repellendus velit cupiditate fuga mollitia perferendis asperiores? A quisquam nisi suscipit blanditiis:</p>
                        <ul>
                            <li>Lorem ipsum dolor sit amet consectetur adipisicing elit,</li>
                            <li>Totam, facilis quos, iusto hic facere,</li>
                            <li>Molestiae necessitatibus culpa omnis quas aliquid vero ducimus,</li>
                            <li>Est officia vel. Dolorem quae debitis autem.</li>
                        </ul>
                        <p>Reiciendis neque recusandae non quidem sint expedita quis sunt ipsum quisquam aperiam quo atque sequi, accusantium magni unde obcaecati ut mollitia enim aliquid dolorem! Hic, excepturi! Ratione, eaque repellendus, mollitia aut neque nisi veritatis voluptates facere minus earum ducimus ad tempore a ex omnis iusto qui. Quisquam tempora labore excepturi minus id iusto inventore possimus, sapiente et ullam.</p>
                        <h2>Saepe dignissimos.</h2>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet aperiam modi doloremque, optio, vero odio quam, nobis itaque saepe numquam quas. Labore a provident sunt error, repellendus exercitationem in omnis.</p>
                        <p>Quo, illum commodi voluptatem earum deserunt recusandae amet blanditiis pariatur totam repudiandae similique distinctio nesciunt. Dolores quaerat voluptatem ut in eaque qui, rerum, veniam ipsam maxime ipsum a aliquam ratione consequuntur odit distinctio, est illum amet id rem minus! Enim rerum ex aperiam optio debitis nobis!</p>
                        <p>Consectetur officiis illo eveniet sint maiores omnis nulla, veniam quisquam, quibusdam iure ratione dolore et non vel hic. Facere molestias unde tempora aspernatur numquam alias, odit, rerum pariatur illum sunt iusto laboriosam veritatis voluptates totam porro architecto corrupti reprehenderit delectus ducimus maxime impedit! Laudantium fuga veritatis voluptates optio, facere dicta rem quibusdam, reprehenderit voluptatem quaerat dolorum. In dolor commodi aliquid pariatur ullam sint ipsam unde.</p>
                    </div>
                    <div className='d-flex align-items-center justify-content-center mt-5 fs-6'>
                        <Link 
                            href='#' 
                            className={replaceClassName(
                                'd-inline-flex align-items-center me-4'
                            )}
                        >
                            <PrevArrowComponent size={20} />
                            <span className={replaceClassName('ps-1 fw-medium')}>Prev</span>
                        </Link>
                        <Link href='#' className='d-inline-flex align-items-center'>
                            <span className={replaceClassName('pe-1 fw-medium')}>Next</span>
                            <NextArrowComponent size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}


BlogDetails.displayName = 'BlogDetails'
export default BlogDetails