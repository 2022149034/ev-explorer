import type { ElectricVehicle, FilterBounds } from "../types/ev";

function splitCSVRow(row: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < row.length; index += 1) {
    const character = row[index];

    if (character === '"') {
      if (quoted && row[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

export function parseNullableNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().replace(/,/g, "");
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

const textValue = (value: string | undefined, fallback = "Unknown") => {
  const trimmed = value?.trim();
  return trimmed || fallback;
};

export function parseEVData(csv: string): ElectricVehicle[] {
  const [headerRow, ...rows] = csv.trim().split(/\r?\n/);
  const headers = splitCSVRow(headerRow);

  return rows
    .map((row) => {
      const columns = splitCSVRow(row);
      const entry = Object.fromEntries(
        headers.map((header, index) => [header, columns[index] ?? ""]),
      );
      const brand = textValue(entry.brand);
      const model = textValue(entry.model, "Unnamed model");

      return {
        id: `${brand}-${model}`,
        brand,
        model,
        topSpeedKmh: parseNullableNumber(entry.top_speed_kmh),
        batteryCapacityKWh: parseNullableNumber(entry.battery_capacity_kWh),
        batteryType: textValue(entry.battery_type),
        numberOfCells: parseNullableNumber(entry.number_of_cells),
        torqueNm: parseNullableNumber(entry.torque_nm),
        efficiencyWhPerKm: parseNullableNumber(entry.efficiency_wh_per_km),
        rangeKm: parseNullableNumber(entry.range_km),
        acceleration0100S: parseNullableNumber(entry.acceleration_0_100_s),
        fastChargingPowerKwDc: parseNullableNumber(entry.fast_charging_power_kw_dc),
        fastChargePort: textValue(entry.fast_charge_port),
        towingCapacityKg: parseNullableNumber(entry.towing_capacity_kg),
        cargoVolumeL: parseNullableNumber(entry.cargo_volume_l),
        seats: parseNullableNumber(entry.seats),
        drivetrain: textValue(entry.drivetrain),
        segment: textValue(entry.segment),
        lengthMm: parseNullableNumber(entry.length_mm),
        widthMm: parseNullableNumber(entry.width_mm),
        heightMm: parseNullableNumber(entry.height_mm),
        carBodyType: textValue(entry.car_body_type),
        sourceUrl: textValue(entry.source_url, ""),
      } satisfies ElectricVehicle;
    })
    .filter((vehicle) => vehicle.brand !== "Unknown");
}

const valuesFor = (
  vehicles: ElectricVehicle[],
  selector: (vehicle: ElectricVehicle) => number | null,
) =>
  vehicles.map(selector).filter((value): value is number => value !== null);

export function getFilterBounds(vehicles: ElectricVehicle[]): FilterBounds {
  const ranges = valuesFor(vehicles, (vehicle) => vehicle.rangeKm);
  const batteries = valuesFor(vehicles, (vehicle) => vehicle.batteryCapacityKWh);
  return {
    minRangeKm: Math.floor(Math.min(...ranges)),
    maxRangeKm: Math.ceil(Math.max(...ranges)),
    minBatteryCapacityKWh: Math.floor(Math.min(...batteries)),
    maxBatteryCapacityKWh: Math.ceil(Math.max(...batteries)),
  };
}
