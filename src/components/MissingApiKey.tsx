export function MissingApiKey() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center">
      <div className="rounded-lg border-2 border-dashed border-destructive p-8">
        <h2 className="text-2xl font-bold text-destructive">Google Maps API Key is Missing</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          The application cannot connect to Google Maps. Please add your API key to the{' '}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            .env
          </code>{' '}
          file at the root of your project.
        </p>
        <pre className="mt-4 rounded-md bg-muted p-4 text-left">
          <code className="text-sm">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
          </code>
        </pre>
        <p className="mt-4 text-xs text-muted-foreground">
          Make sure to restart the development server after adding the key.
        </p>
      </div>
    </div>
  )
}
