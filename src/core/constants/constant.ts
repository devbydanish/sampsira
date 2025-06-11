// Modules
import { 
    RiHome4Line,
    RiDiscLine,
    RiVoiceprintFill,
    RiMvLine,
    RiPieChartLine,
    RiUser3Line,
    RiSettingsLine,
    RiMoneyDollarCircleLine,
    RiGooglePlayFill,
    RiAppStoreFill,
    RiFacebookCircleLine,
    RiInstagramLine,
    RiYoutubeLine,
    RiInformationLine,
    RiMailLine,
    RiTwitterXLine,
    RiUploadLine,
    RiBarChartBoxLine,
    RiFileListLine
} from '@remixicon/react'

// Utilities
import { 
    ComponentSkinTypes, 
    LocaleTypes, 
    NavbarTypes, 
    NavLinkTypes, 
    ThemeModeTypes 
} from '../types'

// Sidebar navigation array
export const NAVBAR: NavbarTypes[] = [
    {
        name: 'home',
        href: '/',
        icon: RiHome4Line,
    },
    {
        name: 'samples',
        href: '/samples',
        icon: RiVoiceprintFill,
    },
    {
        name: 'license',
        href: '/license',
        icon: RiFileListLine,
    },
    {
        name: 'about_us',
        href: '/about',
        icon: RiInformationLine,
    },
    {
        name: 'contact_us',
        href: '/contact',
        icon: RiMailLine,
    }
]

// Top header navigation array
export const NAVBAR_LINK: NavLinkTypes[] = [
    {
        name: 'Home',
        href: '/'
    },
    {
        name: 'Pricing',
        href: '/plan',
    },
    {
        name: 'About Us',
        href: '/about'
    },
    {
        name: 'Blog',
        href: '/blog'
    },
    {
        name: 'Contact Us',
        href: '/contact'
    }
]

// Footer Legal Links
export const FOOTER_LINK: NavLinkTypes[] = [
    {
        name: 'Cookies Policy',
        href: '/cookies-policy'
    },
    {
        name: 'Privacy Policy',
        href: '/privacy-policy'
    },
    {
        name: 'Terms of Use',
        href: '/terms',
    },
    {
        name: 'License Agreements',
        href: '/blog'
    },
    {
        name: 'Refund/Cancellation Policy',
        href: '/contact'
    }
]

// Producer Dropdown Options
export const OPTIONS: NavLinkTypes[] = [
    {
        name: 'Profile',
        href: '/profile',
        icon: RiUser3Line
    },
    {
        name: 'Analytics',
        href: '/analytics',
        icon: RiPieChartLine
    },
    {
        name: 'Settings',
        href: '/settings',
        icon: RiSettingsLine
    }
]

// User Dropdown Options
export const OPTIONS_USER: NavLinkTypes[] = [
    {
        name: 'Settings',
        href: '/settings',
        icon: RiSettingsLine
    },
]

// Language dropdown options
export const LANGUAGES = [
    {
        id: 1,
        name: 'Spanish',
        checked: false
    },
    {
        id: 2,
        name: 'English',
        checked: false
    },
]

// Social links 
export const SOCIAL: NavLinkTypes[] = [
    {
        name: 'Youtube',
        icon: RiYoutubeLine,
        href: '#'
    },
    {
        name: 'Instagram',
        icon: RiInstagramLine,
        href: 'https://www.instagram.com/eccentricsounds_'
    },
    {
        name: 'Facebook',
        icon: RiFacebookCircleLine,
        href: '#'
    },
    {
        name: 'X',
        icon: RiTwitterXLine,
        href: '#'
    }
]

// Brand object
export const BRAND = {
    name: 'Sampsira',
    href: '/',
    logo: '/images/logos/logo-white.png',
    email: 'info@sampsira.com'
}

// Mobile app data
export const APP: NavLinkTypes[] = [
    {
        name: 'google_play',
        icon: RiGooglePlayFill,
        href: '#',
    },
    {
        name: 'app_store',
        icon: RiAppStoreFill,
        href: '#',
    }
]

// Chart.js tooltip config
export const CHART_TOOLTIP = {
    titleMarginBottom: 6,
    caretSize: 6,
    caretPadding: 10,
    boxWidth: 8,
    boxHeight: 8,
    boxPadding: 4,
    intersect: false,
    backgroundColor: '#131416',
    usePointStyle: true,

    padding: {
        top: 8,
        right: 12,
        bottom: 8,
        left: 12
    }
}

// Local storage keys
export const USER_KEY = 'user'
export const SONG_KEY = 'tracks'

// Attribute names
export const SIDEBAR_TOGGLE = 'data-sidebar-toggle'
export const SEARCH_RESULTS = 'data-search-results'
export const THEME = 'data-theme'

// Toggle to display theme configuration choices.
export const ENABLE_SETTINGS = true

// Enable RTL direction.
export const ENABLE_RTL = false

// Activate dark mode for the theme.
export const THEME_MODE: ThemeModeTypes = 'light'

// Components theme
export const HEADER_THEME: ComponentSkinTypes = 'orange'
export const SIDEBAR_THEME: ComponentSkinTypes = 'orange'
export const PLAYER_THEME: ComponentSkinTypes = 'orange'

// Global HTML classes
export const ACTIVE = 'active'
export const SHOW = 'show'
export const COLLAPSE = 'collapse'

// i18n configuration
export const I18N_LOCALE: LocaleTypes = 'en'
