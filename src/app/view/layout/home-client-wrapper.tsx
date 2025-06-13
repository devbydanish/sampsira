"use client"

import React, { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { setEmailVerified } from '@/redux/features/userSlice'

const HomeClientWrapper = () => {
    const searchParams = useSearchParams()
    const dispatch = useDispatch()
    const router = useRouter()

    useEffect(() => {
        // Check if email has been verified after registration
        const emailVerified = searchParams.get('emailverified');
        if (emailVerified === 'true') {
            dispatch(setEmailVerified());
            toast.success("Your email has been verified successfully!");
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        }
    }, [searchParams, dispatch, router]);

    return (
        <div className="under-hero container">
            {/* Your existing home page content */}
        </div>
    )
}

export default HomeClientWrapper 