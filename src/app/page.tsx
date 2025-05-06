// Components
import Home from '@/view/layout/home'

// Utilities
import {
	getSoundKits,
	getProducers,
	getTracks
} from '@/core/utils/helper'
import Sidebar from '@/core/components/sidebar'


export default async function HomePage() {

	const [
		soundKits,
		Producers,
		tracks
	] = await Promise.all([
		getSoundKits(),
		getProducers(),
		getTracks()
	])

	
	return (
        <>
			{/* Hero [[ Find at scss/framework/hero.scss ]] */}
			<div 
				className='hero' 
				style={{backgroundImage: 'url(/images/banner/home.jpg)'}}
			/>

			{/* Under hero [[ Find at scss/framework/hero.scss ]] */}
			<Home
				soundKits={soundKits}
				Producers={Producers}
				tracks={tracks}
			/>
		</>
	)
}
