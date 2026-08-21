import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  agentRules: false,
  images: supabaseHostname
    ? { remotePatterns: [{ protocol: "https", hostname: supabaseHostname }] }
    : undefined,
};

export default nextConfig;
