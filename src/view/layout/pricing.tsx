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
    RiPriceTag3Line,
    RiTimer2Line,
    RiFileMusicLine,
    RiMoneyDollarCircleLine
} from '@remixicon/react';
import { useTranslations } from 'next-intl';
import { loadStripe } from '@stripe/stripe-js';

// Contexts
import { useTheme } from '@/core/contexts/theme';
import { useAuthentication } from '@/core/contexts/authentication';

// Utils
import { getStripeErrorMessage } from '@/utils/stripe-helpers';
import { initiatePurchase } from '@/utils/purchase';

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
        'timer': <RiTimer2Line {...iconProps} />,
        'file': <RiFileMusicLine {...iconProps} />,
        'coin': <RiMoneyDollarCircleLine {...iconProps} />,

    };

    return iconMap[iconName as keyof typeof iconMap] || <RiDownloadLine {...iconProps} />;
};

const PlanCard: React.FC<{plan: Plan; onPurchase: (id: string, isSubscription: boolean) => void; onManage: () => void}> = ({ plan, onPurchase, onManage }) => {
    const pricing = useTranslations('pricing');
    const { currentUser } = useAuthentication();
    const isSubscription = plan.id === 'monthly-subscription' || plan.id === 'yearly-subscription';
    const isYearly = plan.id === 'yearly-subscription';
    const hasActiveSubscription = currentUser?.isSubscribed && currentUser?.subscriptionStatus === 'active';

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
                    <p className='text-muted mb-4'>
                        {isYearly ? pricing('yearly_access') : isSubscription ? pricing('monthly_access') : pricing('pay_as_you_go')}
                    </p>
                    
                    <div className='price-tag mb-4 pb-2 border-bottom'>
                        <span className='amount display-5 fw-bold'>${Math.floor(plan.price)}</span>
                        {isSubscription && (
                            <span className='period text-muted ms-2'>/{isYearly ? pricing('year') : pricing('month')}</span>
                        )}
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

                {isSubscription && hasActiveSubscription ? (
                    <button
                        type='button'
                        className='btn btn-outline-primary w-100 py-3'
                        onClick={onManage}
                    >
                        {pricing('subscribe')}
                    </button>
                ) : (
                    <button
                        type='button'
                        className='btn btn-primary w-100 py-3 text-white'
                        onClick={() => onPurchase(plan.stripeProductId, isSubscription)}
                    >
                        {isSubscription ? pricing('subscribe') : pricing('buyCredits')}
                    </button>
                )}
            </div>
        </div>
    );
};

const Pricing: React.FC<Props> = ({data}) => {
    const pricing = useTranslations('pricing');
    const header = useTranslations('header');
    const { currentUser } = useAuthentication();

    const handleManageSubscription = async () => {
        try {
            const response = await fetch('/api/create-portal-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({
                    customerId: currentUser?.stripeCustomerId
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create portal session');
            }
            
            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Error creating portal session:', error);
            alert('Failed to access billing portal. Please try again.');
        }
    };

    const handlePurchase = async (stripeProductId: string, isSubscription: boolean = false) => {
        await initiatePurchase(stripeProductId, isSubscription, localStorage.getItem('jwt') || undefined);
    };

    // Create a yearly plan based on the monthly subscription plan but with its own features
    const createYearlyPlan = (monthlyPlan: Plan): Plan | null => {
        if (!monthlyPlan) return null;
        
        // Calculate yearly price (monthly price * 10 to give a 2-month discount)
        const monthlyPrice = monthlyPlan.price;
        const yearlyPrice = monthlyPrice * 10;
        
        // Create custom features for the yearly plan
        const yearlyFeatures = [
            {
                id: 'yearly-credits',
                name: '600 credits',
                icon: 'credits'
            },
            {
                id: 'everything-monthly',
                name: 'Everything on the Monthly Plan',
                icon: 'vip'
            },
            // Add any additional yearly-specific features here
        ];
        
        return {
            ...monthlyPlan,
            id: 'yearly-subscription',
            name: monthlyPlan.name.replace('Monthly', 'Yearly'),
            price: yearlyPrice,
            features: yearlyFeatures,
            // Using the specific yearly subscription product ID
            stripeProductId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_YEARLY_SUBSCRIPTION || ''
        };
    };

    const subscriptionPlans = data.filter(plan => plan.id === 'monthly-subscription');
    const yearlyPlan = createYearlyPlan(subscriptionPlans[0]);
    const creditPlans = data.filter(plan => typeof plan.id === 'string' && plan.id.startsWith('credits-'));

    return (
        <div className='plan py-5'>
            <div className='container-lg'>
                <div className='text-center mb-5'>
                    <h2 className='h1 mb-3'>{header('pricing')}</h2>
                    <p className='text-muted fs-5'>{pricing('plan_subtitle')}</p>
                </div>
                <div className='row justify-content-center align-items-stretch g-5'>
                    {subscriptionPlans.length > 0 && (
                        <>
                            <div className='col-12 col-lg-6'>
                                <PlanCard 
                                    key={subscriptionPlans[0].id} 
                                    plan={subscriptionPlans[0]} 
                                    onPurchase={handlePurchase}
                                    onManage={handleManageSubscription}
                                />
                            </div>
                            {yearlyPlan && (
                                <div className='col-12 col-lg-6'>
                                    <PlanCard 
                                        key={yearlyPlan.id} 
                                        plan={yearlyPlan} 
                                        onPurchase={handlePurchase}
                                        onManage={handleManageSubscription}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* <div className='col-12 col-lg-6'>
                        {creditPlans.map(plan => (
                            <PlanCard 
                                key={plan.id} 
                                plan={plan} 
                                onPurchase={handlePurchase}
                                onManage={handleManageSubscription}
                            />
                        ))}
                    </div> */}
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
