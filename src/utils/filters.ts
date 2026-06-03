import type { ElectricVehicle, EVFilters, FilterBounds } from "../types/ev";

export function createDefaultFilters(bounds: FilterBounds): EVFilters {
  return {
    brand: "",
    batteryType: "",
    drivetrain: "",
    carBodyType: "",
    ...bounds,
  };
}

export function filterVehicles(
  vehicles: ElectricVehicle[],
  filters: EVFilters,
) {
  return vehicles.filter(
    (vehicle) =>
      (!filters.brand || vehicle.brand === filters.brand) &&
      (!filters.batteryType || vehicle.batteryType === filters.batteryType) &&
      (!filters.drivetrain || vehicle.drivetrain === filters.drivetrain) &&
      (!filters.carBodyType || vehicle.carBodyType === filters.carBodyType) &&
      vehicle.rangeKm !== null &&
      vehicle.rangeKm >= filters.minRangeKm &&
      vehicle.rangeKm <= filters.maxRangeKm &&
      vehicle.batteryCapacityKWh !== null &&
      vehicle.batteryCapacityKWh >= filters.minBatteryCapacityKWh &&
      vehicle.batteryCapacityKWh <= filters.maxBatteryCapacityKWh,
  );
}
