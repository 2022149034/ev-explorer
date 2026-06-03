import type { ElectricVehicle } from "../types/ev";

interface ComparisonPanelProps {
  vehicles: ElectricVehicle[];
  onRemove: (vehicleId: string) => void;
  onClear: () => void;
}

export function ComparisonPanel({
  vehicles,
  onRemove,
  onClear,
}: ComparisonPanelProps) {
  return (
    <section className="panel comparison-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Shortlist</p>
          <h2>Compare EVs</h2>
        </div>
        <div className="comparison-actions">
          <span>{vehicles.length}/3 selected</span>
          {vehicles.length > 0 && (
            <button className="text-button" onClick={onClear} type="button">
              Clear all
            </button>
          )}
        </div>
      </div>

      {vehicles.length ? (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Range</th>
                <th>Battery</th>
                <th>Top speed</th>
                <th>0-100 km/h</th>
                <th>Efficiency</th>
                <th>Torque</th>
                <th>Drivetrain</th>
                <th>Body type</th>
                <th aria-label="Remove vehicle" />
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <b>{vehicle.brand}</b>
                    <span>{vehicle.model}</span>
                  </td>
                  <td>{vehicle.rangeKm} km</td>
                  <td>{vehicle.batteryCapacityKWh} kWh</td>
                  <td>{vehicle.topSpeedKmh} km/h</td>
                  <td>{vehicle.acceleration0100S} s</td>
                  <td>{vehicle.efficiencyWhPerKm} Wh/km</td>
                  <td>{vehicle.torqueNm ? `${vehicle.torqueNm} Nm` : "N/A"}</td>
                  <td>{vehicle.drivetrain}</td>
                  <td>{vehicle.carBodyType}</td>
                  <td>
                    <button
                      aria-label={`Remove ${vehicle.brand} ${vehicle.model}`}
                      className="remove-button"
                      onClick={() => onRemove(vehicle.id)}
                      type="button"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="comparison-placeholder">
          Select a point on the chart, then add up to three EVs for a side-by-side
          comparison.
        </p>
      )}
    </section>
  );
}
