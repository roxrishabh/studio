"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

export function Providers({ children }: { children: React.ReactNode }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      // Return children directly if no api key is provided
      // This will result in a different error, but will remove the ApiTargetBlockedMapError
      return <>{children}</>;
    }

    return (
        <APIProvider apiKey={apiKey}>
            {children}
        </APIProvider>
    )
}
