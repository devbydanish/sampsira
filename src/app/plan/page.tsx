'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/core/contexts/authentication';

const mockPlans = [
    {
        id: 'monthly-subscription',
        name: 'Subscription',
        subtitle: 'Subscribe for monthly access',
        price: 10,
        stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_MONTHLY_SUBSCRIPTION!,
        features: [
            { id: '1', name: '50 Credits', icon: 'coin' },
            { id: '2', name: 'Access to All Premium Samples', icon: 'samples' },
            { id: '3', name: 'Basic Support (2-3 Business Days)', icon: 'support' },
            { id: '4', name: 'License Approval (2-3 Business Days)', icon: 'license' },
            { id: '5', name: 'Credits Rollover With An Active Plan', icon: 'timer' },
            { id: '6', name: 'Download Master WAV Files + Stems', icon: 'file' },
            { id: '7', name: 'Option to Purchase More Credits', icon: 'credits' },
        ]
    }
];

export default function PlanPage() {
    const router = useRouter();
    const { currentUser, isLoading } = useAuthentication();

    useEffect(() => {
        if (!isLoading && currentUser?.isSubscribed && currentUser?.subscriptionStatus === 'active') {
            router.replace('/settings?tab=subscription');
        }
    }, [currentUser, isLoading, router]);

    const Pricing = require('@/view/layout/pricing').default;

    return (
        <>
            <div className='under-hero container' style={{ marginTop: '100px' }}>
                <div className='section pt-2'>
                    <div className='row'>
                        <div className='col-xl-8 col-lg-10 mx-auto'>
                            <Pricing data={mockPlans} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
