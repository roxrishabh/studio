
'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Check, Clipboard } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

export default function AuthDomainTroubleshootPage() {
    const { user } = useUser();
    const router = useRouter();
    const [hostname, setHostname] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();
    const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);
    
    useEffect(() => {
        setHostname(window.location.hostname);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(hostname).then(() => {
            setIsCopied(true);
            toast({
                title: 'Copied!',
                description: 'Hostname copied to clipboard.',
            });
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const firebaseConsoleUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/authentication/providers`;

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Authorize Your Domain</CardTitle>
                    <CardDescription>To enable Google Sign-In, you need to add your application's domain to the list of authorized domains in your Firebase project.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold">Step 1: Copy your domain hostname</h3>
                        <p className="text-sm text-muted-foreground">This is the unique domain for your development environment.</p>
                        <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
                            <p className="font-mono text-sm flex-grow">{hostname}</p>
                            <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy hostname">
                                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Step 2: Go to Firebase Console</h3>
                        <p className="text-sm text-muted-foreground">Click the button below to open the Authentication settings for your project in a new tab.</p>
                        <Button asChild>
                            <a href={firebaseConsoleUrl} target="_blank" rel="noopener noreferrer">
                                Open Firebase Console
                            </a>
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">Step 3: Add the domain</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>In the Firebase Console, find the "Sign-in method" tab.</li>
                            <li>Scroll down to the "Authorized domains" section and click <strong>Add domain</strong>.</li>
                            <li>Paste the hostname you copied in Step 1 into the dialog box and click <strong>Add</strong>.</li>
                        </ol>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold">Step 4: Try signing in again</h3>
                        <p className="text-sm text-muted-foreground">Once you've added the domain, come back to this page and try signing in again.</p>
                         <Button asChild variant="outline">
                            <a href="/login">Back to Login</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
