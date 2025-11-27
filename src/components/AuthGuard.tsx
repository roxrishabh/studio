'use client';

import { useUser } from '@/firebase/auth/use-user';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { Skeleton } from './ui/skeleton';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (user && pathname === '/login') {
        router.push('/');
      }
      if (!user && pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="space-y-4 max-w-lg w-full p-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!user && pathname !== '/login') {
    // This will be quickly replaced by the redirect, but prevents flashing the page
    return null;
  }
  
  if (user && pathname === '/login') {
    // This will be quickly replaced by the redirect
    return null;
  }

  return <>{children}</>;
}
