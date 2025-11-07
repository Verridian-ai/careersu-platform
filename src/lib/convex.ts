/**
 * Convex Client Configuration
 * Initialize and export Convex client for the application
 */

import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Missing VITE_CONVEX_URL environment variable. Please add it to your .env file."
  );
}

export const convex = new ConvexReactClient(convexUrl);
