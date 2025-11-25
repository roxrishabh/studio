'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, type Query, type DocumentData } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export function useCollection<T>(query: Query<T, DocumentData> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as T[];
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Error in useCollection:", err);
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query?.path?.segments.join('/') || 'unknown path',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
}
