const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb',
        },
        turbo: {
            rules: {
                '*.svg': ['@svgr/webpack'],
            },
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'covers.openlibrary.org' },
            { protocol: 'https', hostname: 'hi0kzbfamjtwi345.public.blob.vercel-storage.com' },
        ]
    }
};