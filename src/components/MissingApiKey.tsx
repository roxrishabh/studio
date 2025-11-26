
export function MissingApiKey() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center p-4">
      <div className="rounded-lg border-2 border-dashed border-destructive p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-destructive">Google Maps API Error</h2>
        <p className="mt-2 text-muted-foreground">
          The application is configured to load Google Maps, but it failed to initialize. This is usually due to an API key configuration issue in your Google Cloud project.
        </p>
        <ul className="mt-4 text-left text-muted-foreground list-disc list-inside space-y-2">
            <li>The <code className="font-mono text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> may be incorrect or belong to a different project.</li>
            <li>The <strong>Maps JavaScript API</strong> might not be enabled for your project. You can enable it in the Google Cloud Console.</li>
            <li><strong>Billing</strong> might not be enabled for the Google Cloud project.</li>
            <li>The API key might have restrictions that prevent it from being used on this domain.</li>
        </ul>
        <div className="mt-6 p-4 rounded-md bg-muted text-left">
            <p className="font-semibold">Action Required:</p>
            <p className="mt-2 text-sm">
                To enable maps, please ensure your API key is correct and that the "Maps JavaScript API" is enabled for your project. Add the key and the enabled flag to your <code className="relative rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">.env</code> file.
            </p>
            <pre className="mt-2 rounded-md bg-background p-2">
              <code className="text-sm">
                {`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
NEXT_PUBLIC_GOOGLE_MAPS_API_ENABLED="true"`}
              </code>
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
             Remember to restart your development server after making changes to the `.env` file.
            </p>
        </div>
      </div>
    </div>
  )
}
