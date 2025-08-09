export type RoleType = 'Producer' | 'Admin' | 'User';

export interface Role {
    id: number;
    name: string;
    type: RoleType;
}

export interface SocialAccount {
    username: string;
    connected: boolean;
}

export interface SocialAccounts {
    instagram?: SocialAccount;
    youtube?: SocialAccount;
    tiktok?: SocialAccount;
}

export interface RoleFlags {
    isAdmin: boolean;
    isProducer: boolean;
}

export interface InfoType {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    subscribedTill: string;
    bio?: string;
    cover?: string;
}

interface BaseUserTypes extends InfoType {
    username: string;
    loginAttempts?: number;
    lockUntil?: string;
    role?: Role;
    producerName?: string;
    location?: string;
    socialAccounts?: SocialAccounts;
    credits?: number;
    sub_credits?: number;
}

export interface CurrentUserTypes extends BaseUserTypes, RoleFlags {}

export interface LoginTypes {
    email: string;
    password: string;
}

export interface RegisterTypes {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    confirmEmail: string;
    password: string;
    city: string;
    state: string;
    agreed: boolean;
}

export interface OtpTypes {
    email: string;
    otp: number;
}

export interface NavLinkTypes {
    name: string;
    href: string;
    icon?: any;
}

export interface NavbarTypes extends NavLinkTypes {
    producerOnly?: boolean;
    title?: boolean;
}

// Export other types from their respective files
export * from './pricing';

// Legacy type exports for backward compatibility
export interface FeatureTypes {
    id: string | number;
    name: string;
    title?: string;
}

export interface EventTypes {
    id: number;
    attendees: Array<{
        id: number;
        name: string;
        cover?: string;
    }>;
    totalAttendee?: number;
}

export type { BaseUserTypes };