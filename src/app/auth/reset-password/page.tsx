import { getTranslations } from 'next-intl/server'
import ResetPasswordForm from './form'

export default async function ResetPasswordPage() {
    const auth = await getTranslations('auth')

    return (
        <>
            <div className='d-flex align-items-center justify-content-between mb-2'>
                <h4 
                    className='mb-0 text-dark'
                >
                    Reset Password
                </h4>
            </div>
            <p className='fs-6'>
                Enter your new password below
            </p>
            <ResetPasswordForm />
        </>
    )
} 