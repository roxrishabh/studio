"use client";

import { getSensors } from "@/lib/data";
import AlertsClient from "./alerts-client";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, orderBy } from "firebase/firestore";
import { useFirestore, useMemoFirebase } from "@/firebase";
import type { Alert } from "@/lib/types";

export default function AlertsPage() {
  const sensors = getSensors();
  const firestore = useFirestore();

  const alertsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const alertsCollection = collection(firestore, 'alerts');
    return query(alertsCollection, orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: alerts, loading } = useCollection<Alert>(alertsQuery);

  return <AlertsClient alerts={alerts} sensors={sensors} loading={loading} />;
}
