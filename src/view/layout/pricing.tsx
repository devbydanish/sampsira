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
        <div className='card plan__col'>
            <div className='card-body'>
                <div className='plan-header'>
                    {isSubscription ? <RiVipCrownLine size={32} className="text-primary" /> : <RiCoinsLine size={32} className="text-primary" />}
                    <h3 className='plan-title' dangerouslySetInnerHTML={{ __html: plan.name }} />
                </div>

                <p className='text-muted'>{plan.subtitle || pricing('plan_subtitle')}</p>

                <div className='price-tag'>
                    <span className='amount'>${plan.price}</span>
                    {isSubscription && <span className='period'>/{pricing('month')}</span>}
                </div>

                <div className='card-features'>
                    {plan.features.map(feature => (
                        <div key={feature.id} className='feature-item'>
                            <FeatureIcon iconName={feature.icon || 'download'} />
                            <span>{feature.name}</span>
                        </div>
                    ))}
                </div>

                <button
                    type='button'
                    className='btn btn-primary w-100'
                    onClick={() => onPurchase(plan.stripeProductId, isSubscription)}
                >
                    {isSubscription ? pricing('subscribe') : pricing('buyCredits')}
                </button>
            </div>
        </div>
    );
};

const Pricing: React.FC<Props> = ({data}) => {
    const handlePurchase = async (stripeProductId: string, isSubscription: boolean = false) => {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        if (!stripe) {
            console.error('Failed to load Stripe');
            return;
        }
        
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                return;
            }

            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });
            
            if (result.error) {
                console.error('Stripe Error:', result.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const subscriptionPlans = data.filter(plan => plan.id === 'monthly-subscription');
    const creditPlans = data.filter(plan => typeof plan.id === 'string' && plan.id.startsWith('credits-'));

    return (
        <div className='plan bg-light'>
            <div className='plan__data d-flex flex-md-row flex-column'>
                <div className='col-md-6 col-12 pe-md-3'>
                    <h4 className='mb-4 text-black'>
                        <RiVipCrownLine className='text-primary me-2' size={24} />
                        Monthly Subscription
                        <small className='d-block text-muted fs-6 mt-1'>
                            Subscribe for premium features & monthly credits
                        </small>
                    </h4>
                    {subscriptionPlans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} onPurchase={handlePurchase} />
                    ))}
                </div>

                <div className='col-md-6 col-12 ps-md-3 mt-md-0 mt-4'>
                    <h4 className='mb-4 text-black'>
                        <RiCoinsLine className='text-primary me-2' size={24} />
                        Purchase Credits
                        <small className='d-block text-muted fs-6 mt-1'>
                            Purchase credits to download samples
                        </small>
                    </h4>
                    {creditPlans.map(plan => (
                        <PlanCard key={plan.id} plan={plan} onPurchase={handlePurchase} />
                    ))}
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
