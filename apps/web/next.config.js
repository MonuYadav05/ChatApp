/** @type {import('next').NextConfig} */
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), "../../packages/database/.env") });

const nextConfig = {
    reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,  // Ensure DATABASE_URL is available
  },
};

export default nextConfig;
