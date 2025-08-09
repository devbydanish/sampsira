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
    const { isAuthenticated, subscriptionActive, error, status } = useSelector((state: RootState) => state.user)
    
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
            console.log('User is authenticated:', isAuthenticated)
            router.push('/')
        }
    }, [router, isAuthenticated])

    useEffect(() => {
        if (error) {
            if (error.includes('locked')) {
                toast.error('You account is blocked. Try again later or press forgot your password?')
            } else if (error.includes('Invalid')) {
                toast.error("The username or password is incorrect. Try again.")
            } else {
                toast.error(error)
            }
        }
    }, [error])
    
    const submitForm = async (data: LoginTypes) => {
        dispatch(loginUser({ email: data.email, password: data.password }) as any)
    }

    return (
        <form className='mt-5' onSubmit={handleSubmit(submitForm)}>
            {error && (
                <div className="alert alert-danger mb-4 p-3 rounded" role="alert">
                    {error.includes('locked')
                        ? 'You account is blocked. Try again later or press forgot your password?'
                        : error.includes('Invalid')
                        ? "The username or password is incorrect. Try again."
                        : error
                    }
                </div>
            )}
            <div className='mb-5'>
                {/* <button type='button' className='btn btn-white w-100' onClick={signInWithGoogle}>
                    <span className='btn__wrap'>
                        <RiGoogleFill />
                        <span className={replaceClassName('ms-2')}>
                            Login with Google
                        </span>
                    </span>
                </button> */}
            </div>
            <div className='mb-4'>
                <div className='auth__or mx-auto fw-medium'></div>
            </div>
            <div className='mb-3'>
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
            <div className='mb-3'>
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
            <div className={replaceClassName('mb-4 text-end')}>
                <Link 
                    href='/auth/forgot' 
                    className='link-primary fw-medium'
                >
                    {auth('forgot_password')}
                </Link>
            </div>
            <div className='mb-5'>
                <button 
                    type='submit' 
                    disabled={status === 'loading'}
                    className={classNames(
                        'btn btn-primary w-100 btn-loading text-white',
                        status === 'loading' && 'active'
                    )}
                >
                    {auth('login')}
                </button>
            </div>
            <p>{auth('login_text')} <br />
                <Link href='/auth/register' className='fw-medium'>
                    {auth('register')}
                </Link>
            </p>
        </form>
    )
}

LoginForm.displayName = 'LoginForm'
export default LoginForm