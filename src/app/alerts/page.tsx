import { getAlerts, getSensors } from "@/lib/data";
import AlertsClient from "./alerts-client";

export default function AlertsPage() {
  const alerts = getAlerts();
  const sensors = getSensors();

  return <AlertsClient alerts={alerts} sensors={sensors} />;
}
