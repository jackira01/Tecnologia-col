import withFlowbiteReact from "flowbite-react/plugin/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  turbopack: {},
  // Suprimir warning de deprecación de url.parse() de dependencias
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [
        { module: /node_modules/ },
      ];
    }
    return config;
  },
};

export default withFlowbiteReact(nextConfig);