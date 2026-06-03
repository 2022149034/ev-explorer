import type { ElectricVehicle } from "../types/ev";

interface DetailPanelProps {
  vehicle: ElectricVehicle | null;
}

const format = (value: number | null, unit = "") =>
  value === null ? "N/A" : `${value}${unit ? ` ${unit}` : ""}`;

export function DetailPanel({ vehicle }: DetailPanelProps) {
  return (
    <aside className="panel detail-panel">
      <p className="eyebrow">Selected vehicle</p>
      <h2>EV details</h2>
      {vehicle ? (
        <>
          <div className="vehicle-title">
            <span>{vehicle.brand}</span>
            <h3>{vehicle.model}</h3>
          </div>
          <dl className="detail-list">
            <Detail label="Range" value={format(vehicle.rangeKm, "km")} />
            <Detail label="Battery" value={format(vehicle.batteryCapacityKWh, "kWh")} />
            <Detail label="Efficiency" value={format(vehicle.efficiencyWhPerKm, "Wh/km")} />
            <Detail label="Top speed" value={format(vehicle.topSpeedKmh, "km/h")} />
            <Detail label="Acceleration" value={format(vehicle.acceleration0100S, "s")} />
            <Detail label="Torque" value={format(vehicle.torqueNm, "Nm")} />
            <Detail label="Fast charging" value={format(vehicle.fastChargingPowerKwDc, "kW")} />
            <Detail label="Cargo volume" value={format(vehicle.cargoVolumeL, "L")} />
            <Detail label="Seats" value={format(vehicle.seats)} />
            <Detail label="Drivetrain" value={vehicle.drivetrain} />
            <Detail label="Body type" value={vehicle.carBodyType} />
          </dl>
          {vehicle.sourceUrl && (
            <a
              className="source-link"
              href={vehicle.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              View source specification <span aria-hidden="true">↗</span>
            </a>
          )}
        </>
      ) : (
        <p className="detail-placeholder">
          Click a point to inspect the EV specification and source link.
        </p>
      )}
    </aside>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
