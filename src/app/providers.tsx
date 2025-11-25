"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { MissingApiKey } from "@/components/MissingApiKey";

export function Providers({ children }: { children: React.ReactNode }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const apiEnabled = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_ENABLED === 'true';

    if (!apiKey || !apiEnabled) {
        return <MissingApiKey />;
    }

    return (
        <APIProvider apiKey={apiKey}>
            {children}
        </APIProvider>
    )
}
