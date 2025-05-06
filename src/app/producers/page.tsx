
// Modules
import { getTranslations } from 'next-intl/server'

// Components
import Section from '@/view/layout/section'

// Utilities
import { title } from '@/core/utils'
import { getProducers } from '@/core/utils/helper'
import { ProducerTypes } from '@/core/types'


export default async function ProducerPage() {

    const Producers = await getProducers() as ProducerTypes[]
    const locale = await getTranslations()
    
	
	return (
		<>
            {/* Hero [[ Find at scss/framework/hero.scss ]] */}
			<div 
                className='hero' 
                style={{backgroundImage: 'url(/images/banner/Producers.jpg)'}}
            />

            {/* Under hero [[ Find at scss/framework/hero.scss ]] */}
            <div className='under-hero container'>
                <Section 
                    title={title(locale, 'feature_Producers_title')}
                    data={Producers}
                    card='avatar'
                    slideView={6}
                    pagination
                    autoplay
                />

                <Section 
                    title={title(locale, 'top_Producers_title')}
                    data={Producers}
                    card='producer'
                    slideView={5}
                    grid
                    navigation
                    autoplay
                />
            </div>
		</>
	)
}
