
// Modules
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { RiHome4Line } from '@remixicon/react'

// Components
import PasswordForm from './form'

// Utilities
import { title } from '@/core/utils'


export default async function ForgotPage() {

    const auth = await getTranslations('auth')

	
	return (
		<>
			<div className='d-flex align-items-center justify-content-between mb-2'>
                <h4 
                    className='mb-0 text-dark'
                    dangerouslySetInnerHTML={{__html: title(auth, 'forgot_password_title')}}
                />
            </div>
            <p className='fs-6'>
                {auth('forgot_password_description')}
            </p>
            <PasswordForm />
		</>
	)
}
