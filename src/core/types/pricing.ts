export interface PlanFeature {
    id: string | number;
    name: string;
    icon?: string;
}

export interface Plan {
    id: string;
    name: string;
    price: number;
    subtitle?: string;
    icon?: string;
    interval?: 'month' | 'year';
    features: PlanFeature[];
    stripeProductId: string;
}

export type PlanTypes = Plan;

export interface PricingProps {
    currentPlan?: string;
    onSelect?: (plan: Plan) => void;
}

export interface StripePriceData {
    priceId: string;
    amount: number;
    interval?: string;
    currency: string;
}

export interface StripeProductData {
    id: string;
    name: string;
    prices: StripePriceData[];
    metadata: {
        features?: string;
        credits?: string;
    };
}