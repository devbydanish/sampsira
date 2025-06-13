"use client"

import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

// Components
import Input from '@/core/components/input'
import ErrorHandler from '@/core/components/error'

// Utilities
import { PASSWORD } from '@/core/constants/regex'
import { resetError } from '@/redux/features/userSlice'
import { RootState } from '@/redux/store'

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

const ResetPasswordForm: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const auth = useTranslations('auth')
    const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>()
    const { status, message, error } = useSelector((state: RootState) => state.user)
    
    const { 
        register, 
        handleSubmit,
        watch,
        formState: { 
            errors,
            isSubmitting
        } 
    } = useForm<ResetPasswordFormData>()

    const password = watch('password')

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

    const submitForm = async (data: ResetPasswordFormData) => {
        try {
            const code = searchParams.get('code');
            if (!code) {
                toast.error('Reset code is missing. Please use the link from your email.');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    password: data.password,
                    passwordConfirmation: data.confirmPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Password has been reset successfully');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                toast.error(result.error?.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('Something went wrong. Please try again later');
        }
    }

    return (
        <form className='mt-5' onSubmit={handleSubmit(submitForm)}>
            <div className='mb-3'>
                <Input 
                    label="New Password"
                    type="password"
                    id='password' 
                    className={classNames(
                        'form-control',
                        errors?.password && 'is-invalid'
                    )}
                    {...register('password', { 
                        required: "Password is required",
                        minLength: {
                            value: 12,
                            message: "Password must be at least 12 characters"
                        },
                        pattern: {
                            value: PASSWORD,
                            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
                        }
                    })}
                />
                {<ErrorHandler root={errors?.password as any} />}
            </div>
            <div className='mb-3'>
                <Input 
                    label="Confirm Password"
                    type="password"
                    id='confirmPassword' 
                    className={classNames(
                        'form-control',
                        errors?.confirmPassword && 'is-invalid'
                    )}
                    {...register('confirmPassword', { 
                        required: "Please confirm your password",
                        validate: value => 
                            value === password || "Passwords do not match"
                    })}
                />
                {<ErrorHandler root={errors?.confirmPassword as any} />}
            </div>
            <button 
                type='submit' 
                disabled={status === 'loading'}
                className={classNames(
                    'btn btn-primary w-100 btn-loading',
                    status === 'loading' && 'active'
                )}
            >
                Reset Password
            </button>
        </form>
    )
}

ResetPasswordForm.displayName = 'ResetPasswordForm'
export default ResetPasswordForm 