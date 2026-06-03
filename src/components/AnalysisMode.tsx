import { FormEvent, useMemo, useState } from "react";
import type {
  AnalysisView,
  CustomEV,
  ElectricVehicle,
  NumericMetricKey,
} from "../types/ev";
import {
  customValue,
  getPercentiles,
  getSimilarVehicles,
} from "../utils/analysis";
import { parseNullableNumber } from "../utils/dataCleaning";
import { analysisViews } from "../utils/personas";
import { ScatterPlot } from "./ScatterPlot";

interface AnalysisModeProps {
  vehicles: ElectricVehicle[];
}

type CustomForm = Record<
  | "customName"
  | "rangeKm"
  | "batteryCapacityKWh"
  | "efficiencyWhPerKm"
  | "fastChargingPowerKwDc"
  | "acceleration0100S"
  | "torqueNm"
  | "topSpeedKmh"
  | "seats"
  | "cargoVolumeL"
  | "drivetrain"
  | "carBodyType",
  string
>;

const initialForm: CustomForm = {
  customName: "My concept EV",
  rangeKm: "500",
  batteryCapacityKWh: "80",
  efficiencyWhPerKm: "160",
  fastChargingPowerKwDc: "180",
  acceleration0100S: "6.5",
  torqueNm: "500",
  topSpeedKmh: "200",
  seats: "5",
  cargoVolumeL: "450",
  drivetrain: "AWD",
  carBodyType: "SUV",
};

const metricLabels: Record<NumericMetricKey, string> = {
  topSpeedKmh: "top_speed_kmh",
  batteryCapacityKWh: "battery_capacity_kWh",
  numberOfCells: "number_of_cells",
  torqueNm: "torque_nm",
  efficiencyWhPerKm: "efficiency_wh_per_km",
  rangeKm: "range_km",
  acceleration0100S: "acceleration_0_100_s",
  fastChargingPowerKwDc: "fast_charging_power_kw_dc",
  towingCapacityKg: "towing_capacity_kg",
  cargoVolumeL: "cargo_volume_l",
  seats: "seats",
  lengthMm: "length_mm",
  widthMm: "width_mm",
  heightMm: "height_mm",
};

const format = (value: number | null, unit = "") =>
  value === null ? "N/A" : `${value}${unit ? ` ${unit}` : ""}`;

const ordinal = (value: number) => {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;

  switch (value % 10) {
    case 1:
      return `${value}st`;
    case 2:
      return `${value}nd`;
    case 3:
      return `${value}rd`;
    default:
      return `${value}th`;
  }
};

export function AnalysisMode({ vehicles }: AnalysisModeProps) {
  const [form, setForm] = useState<CustomForm>(initialForm);
  const [customEV, setCustomEV] = useState<CustomEV | null>(null);
  const [selectedViewId, setSelectedViewId] =
    useState<AnalysisView["id"]>("battery-range");
  const selectedView =
    analysisViews.find((view) => view.id === selectedViewId) ?? analysisViews[0];
  const percentiles = useMemo(
    () => (customEV ? getPercentiles(vehicles, customEV) : []),
    [customEV, vehicles],
  );
  const similarVehicles = useMemo(
    () => (customEV ? getSimilarVehicles(vehicles, customEV) : []),
    [customEV, vehicles],
  );
  const insight = useMemo(
    () => (customEV ? getChartInsight(vehicles, customEV, selectedView) : null),
    [customEV, selectedView, vehicles],
  );
  const drivetrainOptions = unique(vehicles.map((vehicle) => vehicle.drivetrain));
  const bodyTypeOptions = unique(vehicles.map((vehicle) => vehicle.carBodyType));

  const update = (key: keyof CustomForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setCustomEV({
      id: "custom-ev",
      customName: form.customName.trim() || "Custom EV",
      rangeKm: parseNullableNumber(form.rangeKm),
      batteryCapacityKWh: parseNullableNumber(form.batteryCapacityKWh),
      efficiencyWhPerKm: parseNullableNumber(form.efficiencyWhPerKm),
      fastChargingPowerKwDc: parseNullableNumber(form.fastChargingPowerKwDc),
      acceleration0100S: parseNullableNumber(form.acceleration0100S),
      torqueNm: parseNullableNumber(form.torqueNm),
      topSpeedKmh: parseNullableNumber(form.topSpeedKmh),
      seats: parseNullableNumber(form.seats),
      cargoVolumeL: parseNullableNumber(form.cargoVolumeL),
      drivetrain: form.drivetrain,
      carBodyType: form.carBodyType,
    });
  };

  return (
    <section className="analysis-view">
      <div className="section-intro compact">
        <p className="eyebrow">For Analysis</p>
        <h1>Benchmark your own EV specification</h1>
        <p>
          Enter a custom or hypothetical EV, switch between four market views,
          and compare the result against real EV specifications.
        </p>
      </div>

      <div className="analysis-tabs" aria-label="Analysis views">
        {analysisViews.map((view) => (
          <button
            className={view.id === selectedView.id ? "active" : ""}
            key={view.id}
            onClick={() => setSelectedViewId(view.id)}
            type="button"
          >
            <strong>{view.title}</strong>
            <span>{view.purpose}</span>
          </button>
        ))}
      </div>

      <div className="analysis-grid">
        <form className="panel custom-form" onSubmit={submit}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Custom input</p>
              <h2>Your EV specification</h2>
            </div>
            <button className="primary-button" type="submit">
              Compare
            </button>
          </div>
          <TextInput
            label="Custom name"
            value={form.customName}
            onChange={(value) => update("customName", value)}
          />
          <div className="form-grid">
            <TextInput label="Range (km)" value={form.rangeKm} onChange={(value) => update("rangeKm", value)} />
            <TextInput label="Battery (kWh)" value={form.batteryCapacityKWh} onChange={(value) => update("batteryCapacityKWh", value)} />
            <TextInput label="Efficiency (Wh/km)" value={form.efficiencyWhPerKm} onChange={(value) => update("efficiencyWhPerKm", value)} />
            <TextInput label="Fast charging (kW)" value={form.fastChargingPowerKwDc} onChange={(value) => update("fastChargingPowerKwDc", value)} />
            <TextInput label="0-100 km/h (s)" value={form.acceleration0100S} onChange={(value) => update("acceleration0100S", value)} />
            <TextInput label="Torque (Nm)" value={form.torqueNm} onChange={(value) => update("torqueNm", value)} />
            <TextInput label="Top speed (km/h)" value={form.topSpeedKmh} onChange={(value) => update("topSpeedKmh", value)} />
            <TextInput label="Seats" value={form.seats} onChange={(value) => update("seats", value)} />
            <TextInput label="Cargo volume (L)" value={form.cargoVolumeL} onChange={(value) => update("cargoVolumeL", value)} />
            <SelectInput label="Drivetrain" value={form.drivetrain} options={drivetrainOptions} onChange={(value) => update("drivetrain", value)} />
            <SelectInput label="Body type" value={form.carBodyType} options={bodyTypeOptions} onChange={(value) => update("carBodyType", value)} />
          </div>
        </form>

        <ScatterPlot
          config={selectedView.chart}
          customEV={customEV}
          vehicles={vehicles}
        />
      </div>

      <section className="insight-layout">
        <article className="panel insight-panel">
          <p className="eyebrow">Selected chart insight</p>
          <h2>{selectedView.title}</h2>
          <p>{selectedView.interpretation}</p>
          <dl className="insight-list">
            <div>
              <dt>Best region</dt>
              <dd>{selectedView.chart.bestRegion}</dd>
            </div>
            <div>
              <dt>Your EV vs. market</dt>
              <dd>
                {insight
                  ? insight.comparison
                  : "Submit a custom EV to compare it against this chart."}
              </dd>
            </div>
          </dl>
          {insight?.missingFields.length ? (
            <div className="missing-message">
              Your EV is missing the selected chart value:
              {" "}
              {insight.missingFields.join(", ")}.
            </div>
          ) : null}
        </article>

        {selectedView.id === "battery-range" && (
          <article className="summary-card insight-metric">
            <span>range_per_kWh</span>
            <strong>
              {insight?.rangePerKwh === null || insight?.rangePerKwh === undefined
                ? "N/A"
                : insight.rangePerKwh.toFixed(2)}
            </strong>
            <small>
              {insight?.rangePerKwh === null || insight?.rangePerKwh === undefined
                ? "Submit range and battery capacity"
                : "km per kWh for your custom EV"}
            </small>
          </article>
        )}
      </section>

      {customEV ? (
        <>
          <section className="percentile-grid">
            {percentiles.map((item) => (
              <article className="summary-card light" key={item.label}>
                <span>{item.label}</span>
                <strong>
                  {item.percentile === null ? "N/A" : ordinal(item.percentile)}
                </strong>
                <small>
                  {format(item.value, item.unit)} · {item.better} is better
                </small>
              </article>
            ))}
          </section>

          <section className="panel comparison-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Similarity search</p>
                <h2>Top 5 most similar EVs</h2>
              </div>
              <span className="muted">Normalized distance across available metrics</span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Range</th>
                    <th>Battery</th>
                    <th>Efficiency</th>
                    <th>Fast charge</th>
                    <th>Acceleration</th>
                    <th>Torque</th>
                    <th>Top speed</th>
                    <th>Seats</th>
                    <th>Cargo</th>
                    <th>Match score</th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow custom={customEV} />
                  {similarVehicles.map(({ vehicle, score }) => (
                    <tr key={vehicle.id}>
                      <td>
                        <b>{vehicle.brand}</b>
                        <span>{vehicle.model}</span>
                      </td>
                      <td>{format(vehicle.rangeKm, "km")}</td>
                      <td>{format(vehicle.batteryCapacityKWh, "kWh")}</td>
                      <td>{format(vehicle.efficiencyWhPerKm, "Wh/km")}</td>
                      <td>{format(vehicle.fastChargingPowerKwDc, "kW")}</td>
                      <td>{format(vehicle.acceleration0100S, "s")}</td>
                      <td>{format(vehicle.torqueNm, "Nm")}</td>
                      <td>{format(vehicle.topSpeedKmh, "km/h")}</td>
                      <td>{format(vehicle.seats)}</td>
                      <td>{format(vehicle.cargoVolumeL, "L")}</td>
                      <td>{score.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="panel empty-analysis">
          <h2>Submit a custom EV to begin analysis</h2>
          <p>
            Percentile cards, highlighted chart placement, and the top 5 similar
            market vehicles will appear here.
          </p>
        </section>
      )}
    </section>
  );
}

function getChartInsight(
  vehicles: ElectricVehicle[],
  custom: CustomEV,
  view: AnalysisView,
) {
  const xValue = customValue(custom, view.chart.xKey);
  const yValue = customValue(custom, view.chart.yKey);
  const missingFields = [
    xValue === null ? metricLabels[view.chart.xKey] : null,
    yValue === null ? metricLabels[view.chart.yKey] : null,
  ].filter((value): value is string => value !== null);
  const xPercentile = metricPercentile(
    vehicles,
    view.chart.xKey,
    xValue,
    lowerIsBetter(view.chart.xKey) ? "lower" : "higher",
  );
  const yPercentile = metricPercentile(
    vehicles,
    view.chart.yKey,
    yValue,
    lowerIsBetter(view.chart.yKey) ? "lower" : "higher",
  );
  const rangePerKwh =
    custom.rangeKm !== null &&
    custom.batteryCapacityKWh !== null &&
    custom.batteryCapacityKWh > 0
      ? custom.rangeKm / custom.batteryCapacityKWh
      : null;

  return {
    missingFields,
    rangePerKwh,
    comparison: missingFields.length
      ? `The point cannot be plotted until ${missingFields.join(" and ")} is provided.`
      : `Your EV sits at the ${xPercentile === null ? "N/A" : ordinal(xPercentile)} percentile on ${view.chart.xLabel} and the ${yPercentile === null ? "N/A" : ordinal(yPercentile)} percentile on ${view.chart.yLabel}.`,
  };
}

function lowerIsBetter(key: NumericMetricKey) {
  return key === "efficiencyWhPerKm" || key === "acceleration0100S";
}

function metricPercentile(
  vehicles: ElectricVehicle[],
  key: NumericMetricKey,
  value: number | null,
  better: "higher" | "lower",
) {
  const values = vehicles
    .map((vehicle) => vehicle[key])
    .filter((candidate): candidate is number => candidate !== null);
  if (value === null || !values.length) return null;

  const rank =
    better === "higher"
      ? values.filter((candidate) => candidate <= value).length
      : values.filter((candidate) => candidate >= value).length;

  return Math.round((rank / values.length) * 100);
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ComparisonRow({ custom }: { custom: CustomEV }) {
  return (
    <tr className="custom-row">
      <td>
        <b>Your EV</b>
        <span>{custom.customName}</span>
      </td>
      <td>{format(custom.rangeKm, "km")}</td>
      <td>{format(custom.batteryCapacityKWh, "kWh")}</td>
      <td>{format(custom.efficiencyWhPerKm, "Wh/km")}</td>
      <td>{format(custom.fastChargingPowerKwDc, "kW")}</td>
      <td>{format(custom.acceleration0100S, "s")}</td>
      <td>{format(custom.torqueNm, "Nm")}</td>
      <td>{format(custom.topSpeedKmh, "km/h")}</td>
      <td>{format(custom.seats)}</td>
      <td>{format(custom.cargoVolumeL, "L")}</td>
      <td>Baseline</td>
    </tr>
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}
