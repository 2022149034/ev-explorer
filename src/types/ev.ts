export interface ElectricVehicle {
  id: string;
  brand: string;
  model: string;
  topSpeedKmh: number | null;
  batteryCapacityKWh: number | null;
  batteryType: string;
  numberOfCells: number | null;
  torqueNm: number | null;
  efficiencyWhPerKm: number | null;
  rangeKm: number | null;
  acceleration0100S: number | null;
  fastChargingPowerKwDc: number | null;
  fastChargePort: string;
  towingCapacityKg: number | null;
  cargoVolumeL: number | null;
  seats: number | null;
  drivetrain: string;
  segment: string;
  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  carBodyType: string;
  sourceUrl: string;
}

export type NumericMetricKey =
  | "topSpeedKmh"
  | "batteryCapacityKWh"
  | "numberOfCells"
  | "torqueNm"
  | "efficiencyWhPerKm"
  | "rangeKm"
  | "acceleration0100S"
  | "fastChargingPowerKwDc"
  | "towingCapacityKg"
  | "cargoVolumeL"
  | "seats"
  | "lengthMm"
  | "widthMm"
  | "heightMm";

export type CategoricalMetricKey =
  | "brand"
  | "batteryType"
  | "fastChargePort"
  | "drivetrain"
  | "segment"
  | "carBodyType";

export interface ChartConfig {
  xKey: NumericMetricKey;
  yKey: NumericMetricKey;
  colorKey: CategoricalMetricKey;
  sizeKey: NumericMetricKey;
  xLabel: string;
  yLabel: string;
  title: string;
  description: string;
  bestRegion: string;
  reverseX?: boolean;
}

export interface EVFilters {
  brand: string;
  batteryType: string;
  drivetrain: string;
  carBodyType: string;
  minRangeKm: number;
  maxRangeKm: number;
  minBatteryCapacityKWh: number;
  maxBatteryCapacityKWh: number;
}

export interface FilterBounds {
  minRangeKm: number;
  maxRangeKm: number;
  minBatteryCapacityKWh: number;
  maxBatteryCapacityKWh: number;
}

export interface BuyerPersona {
  id: "city" | "long-distance" | "family" | "performance";
  title: string;
  subtitle: string;
  painPoints: string[];
  chart: ChartConfig;
}

export interface AnalysisView {
  id: "battery-range" | "charging-range" | "efficiency-range" | "performance";
  title: string;
  purpose: string;
  interpretation: string;
  chart: ChartConfig;
}

export interface CustomEV {
  id: string;
  customName: string;
  rangeKm: number | null;
  batteryCapacityKWh: number | null;
  efficiencyWhPerKm: number | null;
  fastChargingPowerKwDc: number | null;
  acceleration0100S: number | null;
  torqueNm: number | null;
  topSpeedKmh: number | null;
  seats: number | null;
  cargoVolumeL: number | null;
  drivetrain: string;
  carBodyType: string;
}
