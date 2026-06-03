import type { ElectricVehicle, EVFilters, FilterBounds } from "../types/ev";

interface FilterPanelProps {
  vehicles: ElectricVehicle[];
  filters: EVFilters;
  bounds: FilterBounds;
  onChange: (filters: EVFilters) => void;
  onReset: () => void;
}

const unique = (vehicles: ElectricVehicle[], key: keyof ElectricVehicle) =>
  Array.from(new Set(vehicles.map((vehicle) => String(vehicle[key]))))
    .filter(Boolean)
    .sort();

export function FilterPanel({
  vehicles,
  filters,
  bounds,
  onChange,
  onReset,
}: FilterPanelProps) {
  const setFilter = <Key extends keyof EVFilters>(
    key: Key,
    value: EVFilters[Key],
  ) => onChange({ ...filters, [key]: value });

  return (
    <aside className="panel filter-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Refine market</p>
          <h2>Filters</h2>
        </div>
        <button className="text-button" onClick={onReset} type="button">
          Reset filters
        </button>
      </div>

      <FilterSelect
        label="Brand"
        value={filters.brand}
        options={unique(vehicles, "brand")}
        onChange={(value) => setFilter("brand", value)}
      />
      <FilterSelect
        label="Battery type"
        value={filters.batteryType}
        options={unique(vehicles, "batteryType")}
        onChange={(value) => setFilter("batteryType", value)}
      />
      <FilterSelect
        label="Drivetrain"
        value={filters.drivetrain}
        options={unique(vehicles, "drivetrain")}
        onChange={(value) => setFilter("drivetrain", value)}
      />
      <FilterSelect
        label="Body type"
        value={filters.carBodyType}
        options={unique(vehicles, "carBodyType")}
        onChange={(value) => setFilter("carBodyType", value)}
      />

      <RangePair
        label="Range"
        unit="km"
        min={filters.minRangeKm}
        max={filters.maxRangeKm}
        bounds={[bounds.minRangeKm, bounds.maxRangeKm]}
        onMinChange={(value) => setFilter("minRangeKm", value)}
        onMaxChange={(value) => setFilter("maxRangeKm", value)}
      />
      <RangePair
        label="Battery capacity"
        unit="kWh"
        min={filters.minBatteryCapacityKWh}
        max={filters.maxBatteryCapacityKWh}
        bounds={[bounds.minBatteryCapacityKWh, bounds.maxBatteryCapacityKWh]}
        onMinChange={(value) => setFilter("minBatteryCapacityKWh", value)}
        onMaxChange={(value) => setFilter("maxBatteryCapacityKWh", value)}
      />
    </aside>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

interface RangePairProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  bounds: [number, number];
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

function RangePair({
  label,
  unit,
  min,
  max,
  bounds,
  onMinChange,
  onMaxChange,
}: RangePairProps) {
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      <div className="number-pair">
        <label>
          <span>Min</span>
          <input
            max={max}
            min={bounds[0]}
            onChange={(event) => onMinChange(Number(event.target.value))}
            type="number"
            value={min}
          />
        </label>
        <label>
          <span>Max</span>
          <input
            max={bounds[1]}
            min={min}
            onChange={(event) => onMaxChange(Number(event.target.value))}
            type="number"
            value={max}
          />
        </label>
      </div>
      <small>{unit}</small>
    </fieldset>
  );
}
