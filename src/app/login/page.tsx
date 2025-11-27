'use client';

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TwinViewIcon } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = getAuth();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleAuthAction = async (
    action: 'signIn' | 'signUp',
    data: LoginFormValues
  ) => {
    setIsLoading(true);
    setAuthError(null);
    const { email, password } = data;
    try {
      if (action === 'signUp') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // The AuthGuard will handle redirection
    } catch (error: any) {
      console.error(`Error during ${action}:`, error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError(error.message);
      } else if (error.code === 'auth/email-already-in-use') {
         form.setError('email', {
          type: 'manual',
          message: 'This email is already in use. Please sign in.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: error.message || `Could not ${action}. Please try again.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TwinViewIcon className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">
            Welcome to TwinView
          </CardTitle>
          <CardDescription>
            Sign in or create an account to access your city's digital twin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authorization Error</AlertTitle>
              <AlertDescription>
                The domain of this application is not authorized to use
                Firebase Authentication.
                <Link
                  href="/auth-domain-troubleshoot"
                  className="underline font-bold ml-1"
                >
                  Click here for instructions on how to fix this.
                </Link>
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={form.handleSubmit((data) =>
                handleAuthAction('signIn', data)
              )}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader className="animate-spin" />}
              Sign In
            </Button>
            <Button
              onClick={form.handleSubmit((data) =>
                handleAuthAction('signUp', data)
              )}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Loader className="animate-spin" />}
              Sign Up
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            className="w-full"
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                <path
                  fill="currentColor"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.62-4.8 1.62-4.32 0-7.78-3.57-7.78-7.9s3.46-7.9 7.78-7.9c2.44 0 4.13.93 5.37 2.1.94.94 1.5 2.44 1.5 4.13v.14h-6.88z"
                />
              </svg>
            )}
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
