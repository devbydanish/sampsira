/**
 * @name PasswordForm
 * @file form.tsx
 * @description forgot password form component
 */
"use client"


// Modules
import React from 'react'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

// Components
import Input from '@/core/components/input'
import ErrorHandler from '@/core/components/error'

// Utilities
import { postData } from '@/core/utils/api-call'
import { EMAIL } from '@/core/constants/regex'
import { SUCCESSFUL } from '@/core/constants/codes'
import { EmailTemplateTypes, PasswordTypes } from '@/core/types'


const PasswordForm: React.FC = () => {
    
    const { enqueueSnackbar } = useSnackbar()
    const auth = useTranslations('auth')
    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { 
            errors,
            isSubmitting
        } 
    } = useForm<PasswordTypes>()


    const submitForm = async (data: PasswordTypes) => {
        const email: PasswordTypes & EmailTemplateTypes = data as any
        email.Component = 'forgot'
        email.subject = 'Reset your password'
        email.recipient = data.email
        
        await postData('/api/send-mail', email).then(result => {
            if (result.status === SUCCESSFUL) {
                reset()
                enqueueSnackbar('Sent mail successfully')
            }
        })
    }


    return (
        <form className='mt-5' onSubmit={handleSubmit(submitForm)}>
            <div className='mb-3'>
                <Input 
                    label={auth('email')}
                    id='password' 
                    className={classNames(
                        'form-control',
                        errors?.email && 'is-invalid'
                    )}
                    {...register('email', { 
                        required: true, 
                        pattern: { value: EMAIL, message: 'email' } 
                    })}
                />
                {<ErrorHandler root={errors?.email as any} />}
            </div>
            <button 
                type='submit' 
                disabled={isSubmitting}
                className={classNames(
                    'btn btn-primary w-100 btn-loading',
                    isSubmitting && 'active'
                )}
            >
                {auth('submit')}
            </button>
        </form>
    )
}


PasswordForm.displayName = 'PasswordForm'
export default PasswordForm