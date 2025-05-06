
// Modules
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { RiHome4Line } from '@remixicon/react'

// Components
import RegisterProducerForm from './form'

// Utilities
import { BRAND } from '@/core/constants/constant'


export default async function RegisterPage() {

    const auth = await getTranslations('auth')
	
	return (
		<>
			<div 
                className='d-flex align-items-center justify-content-between mb-2'
            >
                <h4 className='mb-0 text-dark'>
                    {auth('register_producer_title') + ' '} <span className='text-primary'>Producer</span>
                </h4>
            </div>
            <p 
                className='fs-6'
                dangerouslySetInnerHTML={{__html: 
                    auth('register_1_description') + ' ' + BRAND.name + ' ' + auth('register_2_description')
                }}
            />
            <RegisterProducerForm />
		</>
	)
}
