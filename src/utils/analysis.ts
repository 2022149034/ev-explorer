import type { CustomEV, ElectricVehicle, NumericMetricKey } from "../types/ev";

export interface PercentileResult {
  label: string;
  value: number | null;
  unit: string;
  percentile: number | null;
  better: "higher" | "lower";
}

export interface SimilarVehicle {
  vehicle: ElectricVehicle;
  score: number;
}

const analysisFields: NumericMetricKey[] = [
  "rangeKm",
  "batteryCapacityKWh",
  "efficiencyWhPerKm",
  "fastChargingPowerKwDc",
  "acceleration0100S",
  "torqueNm",
  "topSpeedKmh",
  "seats",
  "cargoVolumeL",
];

export const customValue = (custom: CustomEV, key: NumericMetricKey) => {
  const values: Partial<Record<NumericMetricKey, number | null>> = {
    rangeKm: custom.rangeKm,
    batteryCapacityKWh: custom.batteryCapacityKWh,
    efficiencyWhPerKm: custom.efficiencyWhPerKm,
    fastChargingPowerKwDc: custom.fastChargingPowerKwDc,
    acceleration0100S: custom.acceleration0100S,
    torqueNm: custom.torqueNm,
    topSpeedKmh: custom.topSpeedKmh,
    seats: custom.seats,
    cargoVolumeL: custom.cargoVolumeL,
  };

  return values[key] ?? null;
};

const validValues = (vehicles: ElectricVehicle[], key: NumericMetricKey) =>
  vehicles
    .map((vehicle) => vehicle[key])
    .filter((value): value is number => value !== null);

function percentile(
  vehicles: ElectricVehicle[],
  key: NumericMetricKey,
  value: number | null,
  better: "higher" | "lower",
) {
  const values = validValues(vehicles, key);
  if (value === null || values.length === 0) return null;

  const rank =
    better === "higher"
      ? values.filter((candidate) => candidate <= value).length
      : values.filter((candidate) => candidate >= value).length;

  return Math.round((rank / values.length) * 100);
}

export function getPercentiles(
  vehicles: ElectricVehicle[],
  custom: CustomEV,
): PercentileResult[] {
  return [
    {
      label: "Range percentile",
      value: custom.rangeKm,
      unit: "km",
      better: "higher",
      percentile: percentile(vehicles, "rangeKm", custom.rangeKm, "higher"),
    },
    {
      label: "Fast charging percentile",
      value: custom.fastChargingPowerKwDc,
      unit: "kW",
      better: "higher",
      percentile: percentile(
        vehicles,
        "fastChargingPowerKwDc",
        custom.fastChargingPowerKwDc,
        "higher",
      ),
    },
    {
      label: "Acceleration percentile",
      value: custom.acceleration0100S,
      unit: "s",
      better: "lower",
      percentile: percentile(
        vehicles,
        "acceleration0100S",
        custom.acceleration0100S,
        "lower",
      ),
    },
    {
      label: "Efficiency percentile",
      value: custom.efficiencyWhPerKm,
      unit: "Wh/km",
      better: "lower",
      percentile: percentile(
        vehicles,
        "efficiencyWhPerKm",
        custom.efficiencyWhPerKm,
        "lower",
      ),
    },
    {
      label: "Torque percentile",
      value: custom.torqueNm,
      unit: "Nm",
      better: "higher",
      percentile: percentile(vehicles, "torqueNm", custom.torqueNm, "higher"),
    },
  ];
}

export function getSimilarVehicles(
  vehicles: ElectricVehicle[],
  custom: CustomEV,
) {
  const domains = new Map(
    analysisFields.map((key) => {
      const values = validValues(vehicles, key);
      return [key, [Math.min(...values), Math.max(...values)] as [number, number]];
    }),
  );

  return vehicles
    .map((vehicle): SimilarVehicle | null => {
      const distances = analysisFields
        .map((key) => {
          const customMetric = customValue(custom, key);
          const vehicleMetric = vehicle[key];
          const domain = domains.get(key);
          if (customMetric === null || vehicleMetric === null || !domain) {
            return null;
          }

          const span = domain[1] - domain[0] || 1;
          return Math.pow((customMetric - vehicleMetric) / span, 2);
        })
        .filter((value): value is number => value !== null);

      if (!distances.length) return null;

      return {
        vehicle,
        score: Math.sqrt(
          distances.reduce((total, value) => total + value, 0) / distances.length,
        ),
      };
    })
    .filter((item): item is SimilarVehicle => item !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
}
