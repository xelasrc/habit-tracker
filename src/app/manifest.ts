import type { MetadataRoute } from "next";

// Required under output: "export" -- manifest.ts compiles to a route
// handler, and static export needs every route explicitly opted into
// static generation rather than relying on the (server-only) default.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Habit Tracker",
    short_name: "Habits",
    description: "Track daily routines and the habits in them.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
