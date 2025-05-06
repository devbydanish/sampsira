// Components
import HomeClientWrapper from '@/view/layout/home-client-wrapper'

// Utilities
import {
	getSoundKits,
	getProducers,
	getTracks
} from '@/core/utils/helper'
import Sidebar from '@/core/components/sidebar'


export default function HomePage() {
	return (
        <>
			{/* Hero [[ Find at scss/framework/hero.scss ]] */}
			<div 
				className='hero' 
				style={{backgroundImage: 'url(/images/banner/home.jpg)'}}
			/>

			{/* Under hero [[ Find at scss/framework/hero.scss ]] */}
			<HomeClientWrapper />
		</>
	)
}
