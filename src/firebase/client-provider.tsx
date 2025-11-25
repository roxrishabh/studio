'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { initializeFirebase } from '@/firebase/index';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';


export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebase, setFirebase] = useState<ReturnType<typeof initializeFirebase> | null>(null);

  useEffect(() => {
    const app = initializeFirebase();
    setFirebase(app);
  }, []);

  if (!firebase) {
    // You can render a loading state here if needed
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebase.firebaseApp}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
