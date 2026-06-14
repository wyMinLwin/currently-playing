import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Allow tunneled dev hosts (e.g. ngrok) to load client JS/HMR, otherwise the
  // page renders but never hydrates and nothing is interactive.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.io"],
};

export default nextConfig;
