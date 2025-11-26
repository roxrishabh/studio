
import { AlertTriangle } from 'lucide-react';

export function MissingApiKey() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <div className="rounded-lg border-2 border-dashed border-destructive p-8 max-w-2xl w-full text-center">
            <div className="flex justify-center">
                <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-destructive mb-2">Google Maps API Key Error</h1>
            <p className="text-destructive/80 mb-6">
                The Google Maps component could not be loaded. This is likely due to one of the following issues with your API key:
            </p>
            <ul className="text-left list-disc list-inside space-y-2 text-muted-foreground">
                <li>The <strong>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</strong> is missing from your <code>.env</code> file.</li>
                <li>The key is incorrect or has a typo.</li>
                <li>The <strong>"Maps JavaScript API"</strong> is not enabled in your Google Cloud project.</li>
                <li>Billing is not enabled for your Google Cloud project.</li>
                <li>The API key has HTTP referrer restrictions that block your current domain.</li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
                Please check your API key and Google Cloud project settings, then restart the application.
            </p>
        </div>
    </div>
  );
}
