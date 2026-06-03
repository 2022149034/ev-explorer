import { useEffect, useState } from "react";
import type { ElectricVehicle } from "../types/ev";
import { parseEVData } from "../utils/dataCleaning";

export function useEVData() {
  const [vehicles, setVehicles] = useState<ElectricVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/electric_vehicles_spec_2025.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load EV data (${response.status})`);
        }

        return response.text();
      })
      .then((csv) => setVehicles(parseEVData(csv)))
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Unknown data error");
      })
      .finally(() => setLoading(false));
  }, []);

  return { vehicles, loading, error };
}
