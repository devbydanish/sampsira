/**
  * @name RegisterProducerForm
  * @file form.tsx
  * @description register producer form component
  */
"use client"

// Modules
import React, { useEffect } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { RiGoogleFill } from '@remixicon/react'
import { useLocalStorage } from 'usehooks-ts'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

// Contexts
import { useTheme } from '@/core/contexts/theme'
import { useAuthentication } from '@/core/contexts/authentication'
import { registerProducer, resetError, setEmailVerified } from '@/redux/features/userSlice'
import { RootState } from '@/redux/store'

// Components
import Input from '@/core/components/input'
import ErrorHandler from '@/core/components/error'

// Utilities
import { PASSWORD } from '@/core/constants/regex'
import { USER_KEY } from '@/core/constants/constant'
import { ProducerRegisterTypes } from '@/core/types'

const RegisterProducerForm: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [, saveUser] = useLocalStorage<any>(USER_KEY, null)
    const {replaceClassName} = useTheme()
    const { signInWithGoogle } = useAuthentication()
    const auth = useTranslations('auth')
    const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>()
    const { isAuthenticated, regStatus, message, registerError } = useSelector((state: RootState) => state.user)
    
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
        watch,
        setValue
    } = useForm<ProducerRegisterTypes>({
        defaultValues: {
            agreed: true,
        }
    })

    const email = watch('email')
    const password = watch('password')
    const [username, setUsername] = React.useState('');

    React.useEffect(() => {
        const generateUsername = () => {
            const producerName = watch('producerName') || '';
            const generatedUsername = producerName.toLowerCase().replace(/[^a-z0-9]/g, '');
            setUsername(generatedUsername);
            setValue('username', generatedUsername);
        };

        generateUsername();
    }, [watch('producerName'), setValue]);
    
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/")
        }
    }, [router, isAuthenticated])

    useEffect(() => {
        if (message) {
            toast.success(message);
            
            router.push('/')
        }
        
        if (registerError) {
            toast.error(registerError);
        }
        
        return () => {
            dispatch(resetError());
        };
    }, [message, registerError, regStatus, dispatch, router]);

    /**
     * Handle form `onSubmit` event
     * @param data
     */
    const submitForm = async (data: ProducerRegisterTypes) => {
        try {
            const validateUser = await fetch(`/api/user/validate?username=${username}&email=${email}`)
            const result = await validateUser.json()
            
            if (result.message === "User already exists") {
                toast.error("El correo electrónico que ingesaste ya está registrado")
                return
            }
            
            const userData = {
                username,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                producerName: data.producerName,
                city: data.city,
                state: data.state,
                role: 'producer'
            }
            
            await dispatch(registerProducer(userData) as any);
            
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('Registration failed. Please try again.')
        }
    }

    const onSubmit = handleSubmit(async (data) => {
        await submitForm(data);
    });

    return (
        <form className='mt-5' onSubmit={onSubmit}>
            <div className="mb-4">
                <Link href="/auth/register" className="d-block mb-2">
                    {auth('register_user')}
                </Link>
            </div>
            {/* <div className='mb-5'>
                <button type='button' className='btn btn-white w-100' onClick={signInWithGoogle}>
                    <span className='btn__wrap'>
                        <RiGoogleFill />
                        <span className={replaceClassName('ms-2')}>
                            Register with Google
                        </span>
                    </span>
                </button>
            </div> */}
            <div className='mb-4'>
                <div className='auth__or mx-auto fw-medium'></div>
            </div>
            <div className='row mb-3'>
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
                <Input
                    label={auth('producer_name')}
                    id='producerName'
                    className={classNames(
                        'form-control',
                        errors?.producerName && 'is-invalid'
                    )}
                    {...register('producerName', { required: "Producer name is required" })}
                />
                {<ErrorHandler root={errors?.producerName as any} />}
            </div>
            <div className='mb-3'>
                <Input
                    label={auth('username')}
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
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })}
                />
                {<ErrorHandler root={errors?.email as any} />}
            </div>
            <div className='mb-3'>
                <Input
                    label={auth('confirm_email')}
                    type="email"
                    id='confirmEmail'
                    className={classNames(
                        'form-control',
                        errors?.confirmEmail && 'is-invalid'
                    )}
                    {...register('confirmEmail', {
                        required: "Confirm email is required",
                        validate: value => value === email || "Emails do not match"
                    })}
                />
                {<ErrorHandler root={errors?.confirmEmail as any} />}
            </div>
            <div className='mb-3'>
                <Input
                    label="Password"
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

            <div className='mb-4'>
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
            <div className='mb-5'>
                <button
                    type='submit'
                    className={classNames(
                        'btn btn-primary w-100 text-white',
                        (isSubmitting || regStatus === 'loading') && 'btn-loading'
                    )}
                    disabled={isSubmitting || regStatus === 'loading'}
                >
                    {auth('register')}
                </button>
            </div>
            <p>{auth('register_text')} <br />
                <Link href='/auth/login' className='fw-medium'>{auth('login')}</Link>
            </p>
        </form>
    )
}

RegisterProducerForm.displayName = 'RegisterProducerForm'
export default RegisterProducerForm