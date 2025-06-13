/**
 * @name PasswordForm
 * @file form.tsx
 * @description forgot password form component
 */
"use client"

// Modules
import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

// Components
import Input from '@/core/components/input'
import ErrorHandler from '@/core/components/error'

// Utilities
import { EMAIL } from '@/core/constants/regex'
import { PasswordTypes } from '@/core/types'
import { forgotPassword, resetError } from '@/redux/features/userSlice'
import { RootState } from '@/redux/store'

const PasswordForm: React.FC = () => {
    const router = useRouter()
    const auth = useTranslations('auth')
    const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>()
    const { status, message, error } = useSelector((state: RootState) => state.user)
    
    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { 
            errors,
            isSubmitting
        } 
    } = useForm<PasswordTypes>()

    useEffect(() => {
        if (message) {
            toast.success(message);
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        }
        
        if (error) {
            toast.error(error);
        }
        
        return () => {
            dispatch(resetError());
        };
    }, [message, error, dispatch, router]);

    const submitForm = async (data: PasswordTypes) => {
        try {
            await dispatch(forgotPassword({ email: data.email }) as any);
        } catch (error) {
            console.error('Forgot password error:', error);
        }
    }

    return (
        <form className='mt-5' onSubmit={handleSubmit(submitForm)}>
            <div className='mb-3'>
                <Input 
                    label={auth('email')}
                    type="email"
                    id='email' 
                    className={classNames(
                        'form-control',
                        errors?.email && 'is-invalid'
                    )}
                    {...register('email', { 
                        required: "Email is required", 
                        pattern: { 
                            value: EMAIL, 
                            message: "Invalid email format" 
                        } 
                    })}
                />
                {<ErrorHandler root={errors?.email as any} />}
            </div>
            <button 
                type='submit' 
                disabled={status === 'loading'}
                className={classNames(
                    'btn btn-primary w-100 btn-loading',
                    status === 'loading' && 'active'
                )}
            >
                {auth('submit')}
            </button>
        </form>
    )
}

PasswordForm.displayName = 'PasswordForm'
export default PasswordForm