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
import { generateOtp, registerUser, resetError, verifyOtp } from '@/redux/features/userSlice'
import { RootState } from '@/redux/store'

// Components
import ErrorHandler from '@/core/components/error'
import Input from '@/core/components/input'
import Button from '@/core/components/bootstrap'
import GoogleButton from '@/view/auth/google-button'
import OtpInput from '@/core/components/shared/OtpInput'

// Constants
import { PASSWORD } from '@/core/constants/regex'
import { USER_KEY } from '@/core/constants/constant'
import { RegisterTypes } from '@/core/types'

const RegisterForm: React.FC = () => {
    const router = useRouter()
    const [, saveUser] = useLocalStorage<any>(USER_KEY, null)
    const {replaceClassName} = useTheme()
    const { signInWithGoogle } = useAuthentication()
    const auth = useTranslations('auth')
    const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>()
    const { isAuthenticated, subscriptionActive, error, message } = useSelector((state: RootState) => state.user)
    const [signupview, setSignupView] = React.useState(false)
    const [flag, setFlag] = React.useState("")

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
        watch,
        setValue
    } = useForm<RegisterTypes>({
        defaultValues: {
            agreed: true,
        }
    })

    const email = watch('email')
    const password = watch('password')
    const [username, setUsername] = React.useState('');

    React.useEffect(() => {
        const generateUsername = () => {
            const firstName = watch('firstName') || '';
            const lastName = watch('lastName') || '';
            const generatedUsername = (firstName + lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
            setUsername(generatedUsername);
            setValue('username', generatedUsername);
        };

        generateUsername();
    }, [watch('firstName'), watch('lastName'), setValue]);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/")
        }
    }, [router, isAuthenticated])

    useEffect(() => {
        if (message === "OTP verified") {
            const data = {
                username,
                firstName: watch('firstName'),
                lastName: watch('lastName'),
                email,
                password,
                city: watch('city'),
                state: watch('state'),
                role: 'user'
            }
            dispatch(registerUser(data) as any)
            setTimeout(() => {
                dispatch(resetError() as any)
            }, 1000)
        }
    }, [dispatch, email, password, watch, username, message])

    const submitForm = async (data: RegisterTypes) => {
        setSignupView(true)
        try {
            const validateUser = await fetch(`/api/user/validate?username=${username}&email=${email}`)
            const result = await validateUser.json()
            
            if (result.message === "User already exists") {
                toast.error("El correo electrónico que ingesaste ya está registrado")
                setUsername("")
                setValue('email', '')
                setValue('firstName', '')
                setValue('lastName', '')
                setSignupView(false)
                return
            }
            
            setFlag("")
            dispatch(generateOtp({ email }) as any)
            
        } catch (error) {
            console.error('Registration error:', error)
            setSignupView(false)
        }
    }

    const handleResendOtp = () => {
        dispatch(generateOtp({ email }) as any)
    }

    const handleVerifyOtp = async (otp: string) => {
        const otpInt = parseInt(otp)
        dispatch(verifyOtp({ email, otp: otpInt }) as any)
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="">
                    {signupview && flag !== "" && (
                        <div className="alert alert-danger text-center" role="alert">
                            {flag}
                        </div>
                    )}
                    {signupview && message !== "" ? (
                        <div className="mt-5">
                            <OtpInput
                                onVerify={handleVerifyOtp}
                                resendOtp={handleResendOtp}
                                error={error}
                                message={message}
                            />
                        </div>
                    ) : (
                        <form className='mt-2' onSubmit={handleSubmit(submitForm)}>
                            <div className="mb-3">
                                <Link href="/auth/register-producer" className="d-block mb-2">
                                    Register as a Producer
                                </Link>
                            </div>
                            <div className='mb-3'>
                                <button type='button' className='btn btn-white w-100' onClick={signInWithGoogle}>
                                    <span className='btn__wrap'>
                                        <RiGoogleFill />
                                        <span className={replaceClassName('ms-2')}>
                                            Register with Google
                                        </span>
                                    </span>
                                </button>
                            </div>
                            <div className='mb-3'>
                                <div className='auth__or mx-auto fw-medium'></div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-md-6'>
                                    <Input
                                        label={auth('first_name')}
                                        id='firstName'
                                        className={classNames(
                                            'form-control',
                                            errors?.firstName && 'is-invalid'
                                        )}
                                        {...register('firstName', { required: "First name is required" })}
                                    />
                                    {<ErrorHandler root={errors?.firstName as any} />}
                                </div>
                                <div className='col-md-6'>
                                    <Input
                                        label={auth('last_name')}
                                        id='lastName'
                                        className={classNames(
                                            'form-control',
                                            errors?.lastName && 'is-invalid'
                                        )}
                                        {...register('lastName', { required: "Last name is required" })}
                                    />
                                    {<ErrorHandler root={errors?.lastName as any} />}
                                </div>
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="username" className="form-label fw-medium">
                                    {auth('username')}
                                </label>
                                <input
                                    type="text"
                                    id='username'
                                    className={classNames(
                                        'form-control',
                                        errors?.username && 'is-invalid'
                                    )}
                                    {...register('username', { required: "Username is required" })}
                                />
                                {<ErrorHandler root={errors?.username as any} />}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="email" className="form-label fw-medium">
                                    {auth('email')}
                                </label>
                                <input
                                    type="email"
                                    id='email'
                                    className={classNames(
                                        'form-control',
                                        errors?.email && 'is-invalid'
                                    )}
                                    {...register('email', {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {<ErrorHandler root={errors?.email as any} />}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="password" className="form-label fw-medium">
                                    Password <span className="base2">*</span>
                                </label>
                                <input
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
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
                                            message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
                                        }
                                    })}
                                />
                                {<ErrorHandler root={errors?.password as any} />}
                            </div>
                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <label htmlFor="city" className="form-label fw-medium">
                                        {auth('city')}
                                    </label>
                                    <input
                                        type="text"
                                        id='city'
                                        className={classNames(
                                            'form-control',
                                            errors?.city && 'is-invalid'
                                        )}
                                        {...register('city', { required: "City is required" })}
                                    />
                                    {<ErrorHandler root={errors?.city as any} />}
                                </div>
                                <div className='col-md-6'>
                                    <label htmlFor="state" className="form-label fw-medium">
                                        {auth('state')}
                                    </label>
                                    <input
                                        type="text"
                                        id='state'
                                        className={classNames(
                                            'form-control',
                                            errors?.state && 'is-invalid'
                                        )}
                                        {...register('state', { required: "State is required" })}
                                    />
                                    {<ErrorHandler root={errors?.state as any} />}
                                </div>
                            </div>
                            <div className='mb-3'>
                                <div className='form-check mb-0'>
                                    <input
                                        className={classNames(
                                            'form-check-input',
                                            errors?.agreed && 'is-invalid'
                                        )}
                                        type='checkbox'
                                        id='agree'
                                        {...register('agreed', { required: "You must agree to the terms and conditions" })}
                                    />
                                    <label className='form-check-label' htmlFor='agree'>
                                        {auth('agree')} <Link href='/'>Terms &amp; Condition</Link>
                                    </label>
                                    {<ErrorHandler root={errors?.agreed as any} />}
                                </div>
                            </div>
                            <div className='mb-3'>
                                <button
                                    type='submit'
                                    className={classNames(
                                        'btn btn-primary w-100 btn-loading text-white',
                                        isSubmitting && 'active'
                                    )}
                                    disabled={isSubmitting}
                                >
                                    {auth('register')}
                                </button>
                            </div>

                            <p>{auth('register_text')}
                                <Link href='/auth/login' className='fw-medium mx-2'>{auth('login')}</Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

RegisterForm.displayName = 'RegisterForm'
export default RegisterForm
