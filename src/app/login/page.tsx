'use client';

import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TwinViewIcon } from '@/components/icons';

export default function LoginPage() {
  const auth = getAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The AuthGuard will handle redirection
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not sign in with Google. Please try again.',
      });
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
          <Button onClick={handleGoogleSignIn} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
