
"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { ThemeProvider } from "next-themes";
import { MissingApiKey } from "@/components/MissingApiKey";

export function Providers({ children }: { children: React.ReactNode }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      // If the API key is not set, we can't render the map.
      // We will show a helpful error message to the user.
      return <MissingApiKey />;
    }

    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <APIProvider apiKey={apiKey}>
            {children}
        </APIProvider>
      </ThemeProvider>
    )
}
