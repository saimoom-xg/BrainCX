/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VAPI_PUBLIC_KEY: process.env.VAPI_PUBLIC_KEY,
    NEXT_PUBLIC_VAPI_ASSISTANT_ID: process.env.VAPI_ASSISTANT_ID,
  },
};

export default nextConfig;