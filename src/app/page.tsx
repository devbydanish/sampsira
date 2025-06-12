// Components
import HomeClientWrapper from '@/view/layout/home-client-wrapper'


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
