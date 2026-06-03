import type { ElectricVehicle } from "../types/ev";

interface SummaryCardsProps {
  vehicles: ElectricVehicle[];
  total: number;
}

const average = (values: Array<number | null>) => {
  const validValues = values.filter((value): value is number => value !== null);
  return validValues.length
    ? Math.round(
        validValues.reduce((total, value) => total + value, 0) /
          validValues.length,
      )
    : 0;
};

export function SummaryCards({ vehicles, total }: SummaryCardsProps) {
  const longestRange = Math.max(
    0,
    ...vehicles
      .map((vehicle) => vehicle.rangeKm)
      .filter((value): value is number => value !== null),
  );

  return (
    <section className="summary-grid" aria-label="Dataset summary">
      <SummaryCard
        label="Visible models"
        value={vehicles.length}
        note={`of ${total} vehicles`}
      />
      <SummaryCard
        label="Longest range"
        value={`${longestRange} km`}
        note="among filtered vehicles"
      />
      <SummaryCard
        label="Average battery"
        value={`${average(vehicles.map((vehicle) => vehicle.batteryCapacityKWh))} kWh`}
        note="usable capacity"
      />
      <SummaryCard
        label="Average efficiency"
        value={`${average(vehicles.map((vehicle) => vehicle.efficiencyWhPerKm))} Wh/km`}
        note="lower is better"
      />
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  note: string;
}

function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <article className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
