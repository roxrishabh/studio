'use client';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TwinViewIcon } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const auth = getAuth();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The AuthGuard will handle redirection
    } catch (error: any) {
      console.error('Error during Google sign-in:', error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError(error.message);
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Could not sign in with Google. Please try again.',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <TwinViewIcon className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Welcome to TwinView</CardTitle>
          <CardDescription>Sign in to access your city's digital twin.</CardDescription>
        </CardHeader>
        <CardContent>
          {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Authorization Error</AlertTitle>
                <AlertDescription>
                  The domain of this application is not authorized to use Firebase Authentication.
                  <Link href="/auth-domain-troubleshoot" className="underline font-bold ml-1">
                    Click here for instructions on how to fix this.
                  </Link>
                </AlertDescription>
              </Alert>
          )}
          <Button onClick={handleGoogleSignIn} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
