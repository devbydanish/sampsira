import Pricing from '@/view/layout/pricing'
import type { PlanTypes } from '@/core/types/pricing'

const mockPlans: PlanTypes[] = [
    {
        id: 'monthly-subscription',
        name: 'Subscription',
        subtitle: 'Subscribe for unlimited access',
        price: 10,
        stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_MONTHLY_SUBSCRIPTION!,
        features: [
            { id: '1', name: 'Download 100 Samples Monthly', icon: 'download' },
            { id: '2', name: 'Access to All Premium Samples', icon: 'vip' },
            { id: '3', name: 'Priority Support', icon: 'support' },
            { id: '4', name: 'Commercial License', icon: 'license' }
        ]
    },
    {
        id: 'credits-100',
        name: 'Purchase Credits',
        subtitle: 'Pay as you go',
        price: 15,
        stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_CREDITS!,
        features: [
            { id: '1', name: '100 Credits', icon: 'credits' },
            { id: '2', name: 'Access to All Samples', icon: 'samples' },
            { id: '3', name: 'Basic Support', icon: 'support' },
            { id: '4', name: 'Commercial License', icon: 'license' }
        ]
    }
]

export default async function PlanPage() {
    
    return (
        <>
            <div className='under-hero container py-4' style={{ marginTop: '100px' }}>
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
