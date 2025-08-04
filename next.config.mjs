/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
        ],
    },
    // Disable ESLint during build to avoid parser issues
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Disable TypeScript checking during build (we'll check it separately)
    typescript: {
        ignoreBuildErrors: true,
    },
    // Ensure proper server configuration for Render
    output: 'standalone',
};

export default nextConfig;
