import ReportsClient from "./reports-client";
import { getSensors } from "@/lib/data";

export default function ReportsPage() {
  const sensors = getSensors();
  return <ReportsClient sensors={sensors} />;
}
