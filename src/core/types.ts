export type IdTypes = string | number

export type LocaleTypes = 'en' | 'es'

/**
 * Google Sign-In Types
 */
export interface GoogleUser {
    sub: string
    name: string
    picture: string
    token: string
    email: string
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    prompt: () => Promise<GoogleUser>
                    initialize: (config: { client_id: string }) => void
                }
            }
        }
    }
}

export type ParamsTypes = {
    params: { slug: IdTypes }
}

export type InfoType = {
    id: IdTypes
    name: string
}

export type PersonTypes = InfoType & {
    cover: string
}

export type SocialMediaAccountType = {
    platform: 'instagram' | 'facebook' | 'youtube' | 'tiktok'
    connected: boolean
    username?: string
    profileUrl?: string
    accessToken?: string
}

export type CardNameTypes = 'sound_kit'
| 'avatar'
| 'mood'
| 'genre'
| 'track'
| 'producer'

/**
 * Theme types
 */
export type ThemeModeTypes = 'light' | 'dark' | 'system'
export type ComponentNameTypes = 'header' | 'sidebar' | 'player'
export type ComponentSkinTypes = 'red' 
| 'green' 
| 'blue' 
| 'orange' 
| 'yellow' 
| 'purple' 
| 'indigo'
| 'pink' 
| 'violet' 
| 'magenta'

/**
 * Form data types
 */
export type LoginTypes = {
    email: string
    password: string
}

export type RegisterTypes = {
    firstName: string
    lastName: string
    email: string
    confirmEmail: string
    gender: 'male' | 'female'
    city: string
    state: string
    password: string
    cPassword: string
    agreed: boolean
    username: string;
}

export type ProducerRegisterTypes = RegisterTypes & {
    producerName: string
}

export type PasswordTypes = {
    email: string
}

export type ContactTypes = {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
}

export type CurrentUserTypes = PersonTypes & {
    isProducer: boolean
    jwt: string
    username?: string
    email: string
    balance: number
    firstName: string
    lastName: string
    displayName?: string
    credits: number
    sub_credits?: number
    bio?: string
    socialAccounts?: {
        instagram?: SocialMediaAccountType
        facebook?: SocialMediaAccountType
        youtube?: SocialMediaAccountType
        tiktok?: SocialMediaAccountType
    }
}

export type CommentTypes = {
    id: IdTypes
    name: string
    email: string
    ratings: string
    comment?: string
}

export type ProfileTypes = {
    image?: string
    firstName: string
    lastName: string
    username: string
    displayName: string
    bio?: string
    connectedAccounts?: {
        instagram?: SocialMediaAccountType
        facebook?: SocialMediaAccountType
        youtube?: SocialMediaAccountType
        tiktok?: SocialMediaAccountType
    }
}

/**
 * Email template types
 */
export type EmailTemplateNameTypes = 'inquiry' | 'forgot'

export type EmailTemplateTypes = {
    recipient?: string
    subject: string
    Component: EmailTemplateNameTypes
}

/**
 * Navigation types
 */
export type NavLinkTypes = {
    name: string
    href: string
    icon?: any
    fragment?: string
    producerOnly?: boolean
}

export type NavHeadTypes = {
    title: string;
    producerOnly?: boolean
}

export type NavbarTypes = NavLinkTypes | NavHeadTypes


/**
 * Track types
 */
export type TrackTypes = {
    id: IdTypes
    title: string
    cover: string
    type: string
    src: string
    date: string
    thumb: string
    duration: string
    href: string
    producers: InfoType[]
    Producers?: InfoType[]
    genre: InfoType[]
    keys?: string[]
    bpm?: number
    moods?: string[]
    categories: InfoType[]
    sound_kit?: InfoType
    rating?: number
    played?: number
    downloads?: string | number
}

/**
 * Producer types
 */
export type ProducerTypes = PersonTypes & {
    totalSoundKits?: number
    displayName?: string;
    totalTracks?: number
    rating?: number
    likes?: number
    description?: string
    bio?: string
    href: string
    type: string
    tracks?: any[]
    soundKits?: SoundKitTypes[]
    isProducer?: boolean
    socialAccounts?: {
        instagram?: { connected: boolean; username: string };
        facebook?: { connected: boolean; username: string };
        youtube?: { connected: boolean; username: string };
        tiktok?: { connected: boolean; username: string };
    }
}

/**
 * Sound Kits types
 */
export type SoundKitTypes = PersonTypes & {
    title: string;
    rating?: number
    slug: string
    like?: boolean
    premium?: boolean
    likes?: number
    downloads?: string | number
    thumb: string
    duration: string
    href: string
    date: string
    company: string
    type: string
    Producers: InfoType[]
    keys?: string[]
    moods?: string[]
    tracks: TrackTypes[]
}

/**
 * Blog types
 */
export type BlogTypes = {
    id: IdTypes
    title: string
    image: string
    date: string
    author: string
}

/**
 * Genre types
 */
export type GenreTypes = {
    id: IdTypes
    title: string
    cover: string
    tracks: TrackTypes[]
    type: string
    href: string
}

/**
* 
 * Mood types
 */
export type MoodTypes = {
    id: IdTypes
    title: string
    cover: string
    tracks: TrackTypes[]
    type: string
    href: string
}

/**
 * Plan types
 */
export type FeatureTypes = {
    id: IdTypes
    title: string
}

export type PlanTypes = FeatureTypes & {
    icon: string
    price: number
    subscribe: boolean
    features: FeatureTypes[]
}