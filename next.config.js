/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure to enable built-in JSX transformation for React 19
  compiler: {
    // Use React's new JSX transform
    styledComponents: true
  },
  // Handle redirects
  async redirects() {
    return [
      {
        source: '/create-agent',
        destination: '/new-agent',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
