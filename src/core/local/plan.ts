import { getFloat } from '../utils';
import { PlanTypes, PlanFeature } from '../types/pricing';

const getFeatureIcon = (feature: string): string => {
    const iconMap: { [key: string]: string } = {
        'download': 'download',
        'vip': 'vip',
        'analytics': 'analytics',
        'support': 'support',
        'credits': 'credits',
        'samples': 'samples',
        'license': 'license'
    };

    // Try to match feature name with icon key
    const matchedIcon = Object.keys(iconMap).find(key => 
        feature.toLowerCase().includes(key)
    );

    return matchedIcon ? iconMap[matchedIcon] : 'download';
};

/**
 * Convert plan data for local use
 * @param data 
 * @returns 
 */
export default function planToLocal(data: any): PlanTypes {
    // Determine if this is a subscription or credit plan
    const isSubscription = data.id === 'monthly-subscription';

    const features: PlanFeature[] = (data.features || []).map((item: any): PlanFeature => ({
        id: item.id.toString(),
        name: item.name || item.title,
        icon: getFeatureIcon(item.name || item.title)
    }));

    const basePlan = {
        id: data.id,
        name: data.name || '',
        subtitle: data.subtitle,
        price: getFloat(data.price),
        icon: data.icon,
        features,
        stripeProductId: data.stripeProductId || `prod_${data.id}`,
    };

    if (isSubscription) {
        return {
            ...basePlan,
            id: 'monthly-subscription',
            interval: 'month'
        };
    }

    // Credit plan - ensure it has credits- prefix
    return {
        ...basePlan,
        id: data.id.startsWith('credits-') ? data.id : `credits-${data.id}`
    };
}