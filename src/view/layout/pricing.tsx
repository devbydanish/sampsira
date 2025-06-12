'use client';

import React from 'react';
import PropTypes from 'prop-types';
import {
    RiVipCrownLine,
    RiDownloadLine,
    RiBarChartLine,
    RiCustomerServiceLine,
    RiCoinsLine,
    RiMusicLine,
    RiPriceTag3Line
} from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { loadStripe } from '@stripe/stripe-js';

// Contexts
import { useTheme } from '@/core/contexts/theme';

// Utils
import { getStripeErrorMessage } from '@/utils/stripe-helpers';

// Utilities
import type { Plan, PlanTypes } from '@/core/types/pricing';

interface Props {
    data: PlanTypes[];
    userPlan?: boolean;
    showLink?: boolean;
}

interface FeatureIconProps {
    iconName: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ iconName }) => {
    const iconProps = {
        className: 'feature-icon',
        size: 20,
    };

    const iconMap = {
        'download': <RiDownloadLine {...iconProps} />,
        'vip': <RiVipCrownLine {...iconProps} />,
        'analytics': <RiBarChartLine {...iconProps} />,
        'support': <RiCustomerServiceLine {...iconProps} />,
        'credits': <RiCoinsLine {...iconProps} />,
        'samples': <RiMusicLine {...iconProps} />,
        'license': <RiPriceTag3Line {...iconProps} />,
    };

    return iconMap[iconName as keyof typeof iconMap] || <RiDownloadLine {...iconProps} />;
};

const PlanCard: React.FC<{plan: Plan; onPurchase: (id: string, isSubscription: boolean) => void}> = ({ plan, onPurchase }) => {
    const pricing = useTranslations('pricing');
    const isSubscription = plan.id === 'monthly-subscription';

    return (
        <div className='card h-100 shadow border-0' style={{ borderRadius: '12px', maxWidth: '500px', margin: '0 auto' }}>
            <div className='card-body d-flex flex-column p-5'>
                <div className='text-center mb-4'>
                    {isSubscription ?
                        <RiVipCrownLine size={40} className="text-primary mb-3" />
                        :
                        <RiCoinsLine size={40} className="text-primary mb-3" />
                    }
                    <h3 className='plan-title text-black mb-2 fw-bold' dangerouslySetInnerHTML={{ __html: plan.name }} />
                    <p className='text-muted mb-4'>{isSubscription ? pricing('unlimited_access') : pricing('pay_as_you_go')}</p>
                    
                    <div className='price-tag mb-4 pb-2 border-bottom'>
                        <span className='amount display-5 fw-bold'>${plan.price}</span>
                        {isSubscription && <span className='period text-muted ms-2'>/{pricing('month')}</span>}
                    </div>
                </div>

                <div className='card-features flex-grow-1 mb-4'>
                    {plan.features.map(feature => (
                        <div key={feature.id} className='feature-item py-2 d-flex align-items-center'>
                            <FeatureIcon iconName={feature.icon || 'download'} />
                            <span className="ms-4 text-secondary">{feature.name}</span>
                        </div>
                    ))}
                </div>

                <button
                    type='button'
                    className='btn btn-primary w-100 py-3'
                    onClick={() => onPurchase(plan.stripeProductId, isSubscription)}
                >
                    {isSubscription ? pricing('subscribe') : pricing('buyCredits')}
                </button>
            </div>
        </div>
    );
};

const Pricing: React.FC<Props> = ({data}) => {
    const pricing = useTranslations('pricing');
    const handlePurchase = async (stripeProductId: string, isSubscription: boolean = false) => {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (!stripe) {
            console.error('Failed to load Stripe');
            alert('Payment system is currently unavailable. Please try again later.');
            return;
        }
        
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    priceId: stripeProductId,
                    isSubscription,
                    mode: isSubscription ? 'subscription' : 'payment'
                }),
            });
            
            const session = await response.json();
            if (session.error) {
                console.error('Session Error:', session.error);
                const userMessage = session.error.includes('Authentication') 
                    ? 'Please log in to continue with your purchase.'
                    : 'Unable to create payment session. Please try again.';
                alert(userMessage);
                return;
            }

            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });
            
            if (result.error) {
                console.error('Stripe Error:', result.error);
                const errorMessage = result.error.code 
                    ? getStripeErrorMessage(result.error.code)
                    : 'Payment failed. Please try again.';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    const subscriptionPlans = data.filter(plan => plan.id === 'monthly-subscription');
    const creditPlans = data.filter(plan => typeof plan.id === 'string' && plan.id.startsWith('credits-'));

    return (
        <div className='plan py-5'>
            <div className='container-lg'>
                <div className='text-center mb-5'>
                    <h2 className='h1 mb-3'>{pricing('plan_subtitle')}</h2>
                    <p className='text-muted fs-5'>{pricing('pay_as_you_go')}</p>
                </div>
                <div className='row justify-content-center align-items-stretch g-5'>
                    <div className='col-12 col-lg-6'>
                        {subscriptionPlans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} onPurchase={handlePurchase} />
                        ))}
                    </div>

                    <div className='col-12 col-lg-6'>
                        {creditPlans.map(plan => (
                            <PlanCard key={plan.id} plan={plan} onPurchase={handlePurchase} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

Pricing.propTypes = {
    data: PropTypes.array.isRequired,
    userPlan: PropTypes.bool,
    showLink: PropTypes.bool
};

Pricing.displayName = 'Pricing';

export default Pricing;
