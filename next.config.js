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
    images: {
        // only the hostname (no port)
        domains: ['127.0.0.1'],
        // if you want to allow any port on localhost, you could instead use:
        // remotePatterns: [
        //   {
        //     protocol: 'http',
        //     hostname: 'localhost',
        //     port: '1338',    // optional
        //     pathname: '/uploads/**',
        //   },
        // ],
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
