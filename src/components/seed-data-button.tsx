'use client';

import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { getAlerts } from '@/lib/data';
import { collection, writeBatch } from 'firebase/firestore';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

export function SeedDataButton() {
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setIsLoading(true);
    try {
      const batch = writeBatch(firestore);
      const alerts = getAlerts();
      const alertsCollection = collection(firestore, 'alerts');

      alerts.forEach((alert) => {
        const docRef = collection(firestore, 'alerts').doc(alert.id);
        batch.set(docRef, alert);
      });

      await batch.commit();

      toast({
        title: 'Success!',
        description: 'Mock data has been seeded to your Firestore database.',
      });
    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: 'There was an error seeding the data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleSeedData} disabled={isLoading}>
      {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
      Seed Data
    </Button>
  );
}
