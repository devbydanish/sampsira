/**
 * @name LoginForm
 * @file form.tsx
 * @description login form component
 */
"use client"

import React, { useEffect } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { RiGoogleFill } from '@remixicon/react'
import { useLocalStorage } from 'usehooks-ts'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

// Contexts and State
import { useTheme } from '@/core/contexts/theme'
import { useAuthentication } from '@/core/contexts/authentication'
import { loginUser, resetError } from '@/redux/features/userSlice'
import { RootState } from '@/redux/store'

// Components
import Input from '@/core/components/input'
import ErrorHandler from '@/core/components/error'

// Constants
import { PASSWORD } from '@/core/constants/regex'
import { USER_KEY } from '@/core/constants/constant'
import { LoginTypes } from '@/core/types'

const LoginForm: React.FC = () => {
    
    const router = useRouter()
    const [, saveUser] = useLocalStorage<any>(USER_KEY, null)
    const {replaceClassName} = useTheme()
    const { signInWithGoogle } = useAuthentication()
    const auth = useTranslations('auth')
    const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>()
    const { isAuthenticated, subscriptionActive, error } = useSelector((state: RootState) => state.user)
    
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm<LoginTypes>()

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [router, isAuthenticated])

    useEffect(() => {
        if (error) {
            if (error.includes('locked')) {
                toast.error('Tu cuenta está bloqueada. Inténtelo de nuevo más tarde o presione ¿olvidó su contraseña?.')
            } else if (error.includes('Invalid')) {
                toast.error("El usuario o la contraseña esta incorrecto. Intente de nuevo.")
            } else {
                toast.error(error)
            }
        }
        dispatch(resetError() as any)
    }, [dispatch, error])
    
    const submitForm = async (data: LoginTypes) => {
        try {
            dispatch(loginUser({ email: data.email, password: data.password }) as any)
        } catch (error) {
            console.error('Sign-in error:', error)
        }
    }

    return (
        <form className='mt-4' onSubmit={handleSubmit(submitForm)}>
            <div className='mb-3'>
                <button type='button' className='btn btn-white w-100' onClick={signInWithGoogle}>
                    <span className='btn__wrap'>
                        <RiGoogleFill />
                        <span className={replaceClassName('ms-2')}>
                            Login with Google
                        </span>
                    </span>
                </button>
            </div>
            <div className='mb-3'>
                <div className='auth__or mx-auto fw-medium'></div>
            </div>
            <div className='mb-2'>
                <Input 
                    label="Email"
                    type="email"
                    id='email' 
                    className={classNames(
                        'form-control',
                        errors?.email && 'is-invalid'
                    )}
                    {...register('email', { 
                        required: true, 
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })}
                />
                {<ErrorHandler root={errors?.email as any} />}
            </div>
            <div className='mb-2'>
                <Input 
                    label={auth('password')}
                    id='password' 
                    type='password'
                    className={classNames(
                        'form-control',
                        errors?.password && 'is-invalid'
                    )}
                    {...register('password', { 
                        required: true, 
                        pattern: { value: PASSWORD, message: 'password' } 
                    })}
                />
                {<ErrorHandler root={errors?.password as any} />}
            </div>
            <div className={replaceClassName('mb-3 text-end')}>
                <Link 
                    href='/auth/forgot' 
                    className='link-primary fw-medium'
                >
                    {auth('forgot_password')}
                </Link>
            </div>
            <div className='mb-3'>
                <button 
                    type='submit' 
                    disabled={isSubmitting}
                    className={classNames(
                        'btn btn-primary w-100 btn-loading',
                        isSubmitting && 'active'
                    )}
                >
                    {auth('login')}
                </button>
            </div>
            <p>{auth('login_text')} 
                <Link href='/auth/register' className='fw-medium mx-2'>
                    {auth('register')}
                </Link>
            </p>
        </form>
    )
}

LoginForm.displayName = 'LoginForm'
export default LoginForm