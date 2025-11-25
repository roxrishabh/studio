export function MissingApiKey() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center p-4">
      <div className="rounded-lg border-2 border-dashed border-destructive p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-destructive">Google Maps API Key Error</h2>
        <p className="mt-2 text-muted-foreground">
          The application cannot connect to Google Maps. This is likely due to one of the following reasons:
        </p>
        <ul className="mt-4 text-left text-muted-foreground list-disc list-inside space-y-2">
            <li>The <code className="font-mono text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> is missing from your <code className="font-mono text-sm">.env</code> file.</li>
            <li>The API key is incorrect or has a typo.</li>
            <li>The <strong>Maps JavaScript API</strong> is not enabled in your Google Cloud project.</li>
            <li><strong>Billing</strong> is not enabled for your Google Cloud project.</li>
            <li>The API key has restrictions (e.g., HTTP referrers) that prevent it from being used on this domain.</li>
        </ul>
        <div className="mt-6 p-4 rounded-md bg-muted text-left">
            <p className="font-semibold">Action Required:</p>
            <p className="mt-2 text-sm">
                Please check your <code className="relative rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">.env</code> file at the root of your project and ensure the following variable is set correctly:
            </p>
            <pre className="mt-2 rounded-md bg-background p-2">
              <code className="text-sm">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
              </code>
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
              If the key is correct, please verify your Google Cloud project settings. You may need to create a new, unrestricted key for testing. Remember to restart your development server after any changes.
            </p>
        </div>
      </div>
    </div>
  )
}
