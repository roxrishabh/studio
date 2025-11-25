'use client';
import React from 'react';

// A utility hook to memoize Firestore queries.
export const useMemoFirebase = <T>(factory: () => T | null, deps: any[]): T | null => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useMemo(factory, deps);
};
