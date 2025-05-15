// Layout
import Pricing from '@/view/layout/pricing'

// Utilities
// import { getPlans } from '@/core/utils/helper'
import type { PlanTypes } from '@/core/types/pricing'

export default async function PlanPage() {
    // const plan = await getPlans() as PlanTypes[]
    const plan = [] as PlanTypes[]
    
    return (
        <>
            <div className='hero hero-sm'>
                <div className='hero__content'>
                    <div className='container'>
                        <h1 className='hero__title mb-2'>
                            Choose Your Plan
                        </h1>
                        <p className='hero__subtitle mb-0'>
                            Get access to premium samples and features with our flexible plans
                        </p>
                    </div>
                </div>
            </div>
            <div className='under-hero container py-4'>
                <div className='section pt-2'>
                    <div className='row'>
                        <div className='col-xl-8 col-lg-10 mx-auto'>
                            <div className='text-center mb-4'>
                                <h2 className='mb-2'>Start Creating Today</h2>
                                <p className='text-muted'>
                                    Choose between our monthly subscription or one-time credit purchase
                                </p>
                            </div>
                            <Pricing data={plan} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
