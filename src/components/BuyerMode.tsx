import { useMemo, useState } from "react";
import type { BuyerPersona, ElectricVehicle, EVFilters, FilterBounds } from "../types/ev";
import { createDefaultFilters, filterVehicles } from "../utils/filters";
import { DetailPanel } from "./DetailPanel";
import { FilterPanel } from "./FilterPanel";
import { ScatterPlot } from "./ScatterPlot";

interface BuyerModeProps {
  vehicles: ElectricVehicle[];
  bounds: FilterBounds;
  personas: BuyerPersona[];
  selectedPersona: BuyerPersona | null;
  onSelectPersona: (persona: BuyerPersona | null) => void;
}

export function BuyerMode({
  vehicles,
  bounds,
  personas,
  selectedPersona,
  onSelectPersona,
}: BuyerModeProps) {
  const [filters, setFilters] = useState<EVFilters>(() => createDefaultFilters(bounds));
  const [selectedVehicle, setSelectedVehicle] = useState<ElectricVehicle | null>(null);
  const filteredVehicles = useMemo(
    () => filterVehicles(vehicles, filters),
    [filters, vehicles],
  );

  if (!selectedPersona) {
    return null;
  }

  return (
    <section className="buyer-view">
      <div className="toolbar">
        <button
          className="secondary-button"
          onClick={() => {
            setSelectedVehicle(null);
            onSelectPersona(null);
          }}
          type="button"
        >
          Back to persona selection
        </button>
        <div className="persona-tabs" aria-label="Switch buyer persona">
          {personas.map((persona) => (
            <button
              className={persona.id === selectedPersona.id ? "active" : ""}
              key={persona.id}
              onClick={() => {
                setSelectedVehicle(null);
                onSelectPersona(persona);
              }}
              type="button"
            >
              {persona.title}
            </button>
          ))}
        </div>
      </div>

      <div className="section-intro compact">
        <p className="eyebrow">For Buyers</p>
        <h1>{selectedPersona.title}</h1>
        <p>{selectedPersona.subtitle}</p>
        <div className="pain-point-row">
          {selectedPersona.painPoints.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </div>

      <div className="buyer-grid">
        <FilterPanel
          bounds={bounds}
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(createDefaultFilters(bounds))}
          vehicles={vehicles}
        />
        <ScatterPlot
          config={selectedPersona.chart}
          onSelect={setSelectedVehicle}
          selectedId={selectedVehicle?.id}
          vehicles={filteredVehicles}
        />
        <DetailPanel vehicle={selectedVehicle} />
      </div>
      <div className="panel reading-note">
        <h2>How to read this chart</h2>
        <p>{selectedPersona.chart.bestRegion}</p>
        <p>
          Only EVs with valid x-axis and y-axis values are plotted. Missing values
          are excluded from calculations that require those fields.
        </p>
      </div>
    </section>
  );
}
