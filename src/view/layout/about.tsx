/**
 * @name About
 * @file about.tsx
 * @description about page component
 */
"use client"


// Modules
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { 
	RiFacebookCircleLine, 
	RiFileList3Line, 
	RiHeadphoneLine, 
	RiInstagramLine, 
	RiTwitterXLine, 
	RiVipCrownLine 
} from '@remixicon/react'

// Contexts
import { useTheme } from '@/core/contexts/theme'

// Utilities
import { title } from '@/core/utils'


const About: React.FC = () => {

    const {replaceClassName} = useTheme()
	const aboutPage = useTranslations('about_page')


    return (
        <>
            {/* Main section [[ Find at scss/framework/section.scss ]] */}
			<div className='main-section pb-0'>
				<div className='container'>
					<div className='col-xl-9 col-lg-10'>
						<h1 
							className='mb-0'
							dangerouslySetInnerHTML={{__html: title(aboutPage, 'title')}}
						/>
					</div>
				</div>
			</div>

			{/* Main section [[ Find at scss/framework/section.scss ]] */}
			<div className='main-section'>
				<div className='container'>
					<div className='row g-5'>
						<div className='col-lg-5'>
							<Image
								src='/images/background/about.jpg'
								width={960}
								height={1024}
								className='img-fluid'
								alt='About image'
							/>
						</div>
						<div className='col-lg-7 fs-5'>
							<div className={replaceClassName('pe-5')}>
								<h2 
									className='my-4'
									dangerouslySetInnerHTML={{__html: title(aboutPage, 'story_title')}}
								/>
								<p>{aboutPage('story_description')}</p>
							</div>
							<div className='ratio ratio-16x9 mt-5'>
								<iframe src='https://www.youtube.com/embed/7e90gBu4pas' title='Working at Envato' allow='accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture'></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main section [[ Find at scss/framework/section.scss ]] */}
			<div className='main-section bg-light'>
				<div className='container text-center'>
					<h2 
						className='mb-5'
						dangerouslySetInnerHTML={{__html: title(aboutPage, 'works_title')}}
					/>
					<div className='row g-5 fs-6'>
						<div className='col-lg-4 col-sm-6'>
							<div className='px-xl-3'>
								<RiFileList3Line size={32} style={{color: 'var(--bs-pink)'}} />
								<h3 className='h4 mt-4'>{aboutPage('works_1_title')}</h3>
								<p>{aboutPage('works_1_description')}</p>
							</div>
						</div>
						<div className='col-lg-4 col-sm-6'>
							<div className='px-xl-3'>
								<RiVipCrownLine size={32} style={{color: 'var(--bs-purple)'}} />
								<h3 className='h4 mt-4'>{aboutPage('works_2_title')}</h3>
								<p>{aboutPage('works_2_description')}</p>
							</div>
						</div>
						<div className='col-lg-4 col-sm-6'>
							<div className='px-xl-3'>
								<RiHeadphoneLine size={32} style={{color: 'var(--bs-indigo)'}} />
								<h3 className='h4 mt-4'>{aboutPage('works_3_title')}</h3>
								<p>{aboutPage('works_3_description')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main section [[ Find at scss/framework/section.scss ]] */}
			<div className='main-section'>
				<div className='container'>
					<div className='col-xl-6 col-lg-8 mx-auto text-center fs-5 mb-5'>
						<h2 dangerouslySetInnerHTML={{__html: title(aboutPage, 'team_title')}} />
						<p>{aboutPage('team_description')}</p>
					</div>
					<div className='row g-5 justify-content-center'>

						<div className='col-xl-2 col-lg-3 col-sm-4 col-6'>
							{/* Avatar [[ Find at scss/components/avatar.scss ]] */}
							<div className='avatar avatar--xxl d-block text-center'>
								<div className='avatar__image mx-auto'>
									<Image 
										src='/images/users/thumb.jpg' 
										width={128}
										height={128}
										alt='Arebica Luna'
									/>
								</div>
								<div className='h5 mt-3'>Olive Yew</div>
								<p>Founder</p>
								<ul className='social justify-content-center'>
									<li>
										<Link href='#' aria-label='Facebook' target='_blank'>
											<RiFacebookCircleLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='X' target='_blank'>
											<RiTwitterXLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='Instagram' target='_blank'>
											<RiInstagramLine size={20} />
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className='col-xl-2 col-lg-3 col-sm-4 col-6'>
							{/* Avatar [[ Find at scss/components/avatar.scss ]] */}
							<div className='avatar avatar--xxl d-block text-center'>
								<div className='avatar__image mx-auto'>
									<Image 
										src='/images/users/thumb-2.jpg' 
										width={128}
										height={128}
										alt='Aida Bugg'
									/>
								</div>
								<div className='h5 mt-3'>Aida Bugg</div>
								<p>Co-founder</p>
								<ul className='social justify-content-center'>
									<li>
										<Link href='#' aria-label='Facebook' target='_blank'>
											<RiFacebookCircleLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='X' target='_blank'>
											<RiTwitterXLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='Instagram' target='_blank'>
											<RiInstagramLine size={20} />
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className='col-xl-2 col-lg-3 col-sm-4 col-6'>
							{/* Avatar [[ Find at scss/components/avatar.scss ]] */}
							<div className='avatar avatar--xxl d-block text-center'>
								<div className='avatar__image mx-auto'>
									<Image 
										src='/images/users/thumb-3.jpg' 
										width={128}
										height={128}
										alt='Teri Dactyl'
									/>
								</div>
								<div className='h5 mt-3'>Teri Dactyl</div>
								<p>Account manager</p>
								<ul className='social justify-content-center'>
									<li>
										<Link href='#' aria-label='Facebook' target='_blank'>
											<RiFacebookCircleLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='X' target='_blank'>
											<RiTwitterXLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='Instagram' target='_blank'>
											<RiInstagramLine size={20} />
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className='col-xl-2 col-lg-3 col-sm-4 col-6'>
							{/* Avatar [[ Find at scss/components/avatar.scss ]] */}
							<div className='avatar avatar--xxl d-block text-center'>
								<div className='avatar__image mx-auto'>
									<Image 
										src='/images/users/thumb-4.jpg' 
										width={128}
										height={128}
										alt='Peg Legge'
									/>
								</div>
								<div className='h5 mt-3'>Peg Legge</div>
								<p>Team leader</p>
								<ul className='social justify-content-center'>
									<li>
										<Link href='#' aria-label='Facebook' target='_blank'>
											<RiFacebookCircleLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='X' target='_blank'>
											<RiTwitterXLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='Instagram' target='_blank'>
											<RiInstagramLine size={20} />
										</Link>
									</li>
								</ul>
							</div>
						</div>

						<div className='col-xl-2 col-lg-3 col-sm-4 col-6'>
							{/* Avatar [[ Find at scss/components/avatar.scss ]] */}
							<div className='avatar avatar--xxl d-block text-center'>
								<div className='avatar__image mx-auto'>
									<Image 
										src='/images/users/thumb-5.jpg' 
										width={128}
										height={128}
										alt='Allie Grater'
									/>
								</div>
								<div className='h5 mt-3'>Allie Grater</div>
								<p>Business manager</p>
								<ul className='social justify-content-center'>
									<li>
										<Link href='#' aria-label='Facebook' target='_blank'>
											<RiFacebookCircleLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='X' target='_blank'>
											<RiTwitterXLine size={20} />
										</Link>
									</li>
									<li>
										<Link href='#' aria-label='Instagram' target='_blank'>
											<RiInstagramLine size={20} />
										</Link>
									</li>
								</ul>
							</div>
						</div>

					</div>
				</div>
			</div>
		</>
    )
}


About.displayName = 'About'
export default About