
// Modules
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { RiHome4Line } from '@remixicon/react'

// Components
import LoginForm from './form'

// Utilities
import { BRAND } from '@/core/constants/constant'


export default async function LoginPage() {

    const auth = await getTranslations('auth')

	
	return (
		<>
            <div 
                className='d-flex align-items-center justify-content-center mb-2'
            >
                <h4 className='mb-0 text-dark'>
                    {auth('login_title') + ' '} <span className='text-primary'>{BRAND.name}</span>
                </h4>
            </div>
            <p className='fs-6'>
                {auth('login_description')}
            </p>
            <LoginForm />
		</>
	)
}
