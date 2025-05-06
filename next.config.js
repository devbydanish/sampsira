/** @type {import('next').NextConfig} */

const path = require('path')
const createNextIntlPlugin = require('next-intl/plugin') 
const withNextIntl = createNextIntlPlugin()

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'assets')]
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true
    },
    async redirects() {
        return [
            {
                source: '/auth',
                destination: '/auth/login',
                permanent: true,
            },
        ]
    },
}

module.exports = withNextIntl(nextConfig)
