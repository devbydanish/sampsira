interface GoogleUser {
    sub: string
    name: string
    picture: string
    token: string
}

interface GoogleAccountsIdentity {
    id: {
        prompt: () => Promise<GoogleUser>
        initialize: (config: { client_id: string }) => void
    }
}

declare global {
    interface Window {
        google?: {
            accounts: GoogleAccountsIdentity
        }
    }
}