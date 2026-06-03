import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ChartConfig,
  CustomEV,
  ElectricVehicle,
  NumericMetricKey,
} from "../types/ev";

interface ScatterPlotProps {
  vehicles: ElectricVehicle[];
  config: ChartConfig;
  selectedId?: string;
  customEV?: CustomEV | null;
  onSelect?: (vehicle: ElectricVehicle) => void;
}

interface PlotPoint {
  vehicle: ElectricVehicle;
  x: number;
  y: number;
  size: number | null;
  color: string;
}

interface CustomPoint {
  vehicle: CustomEV;
  x: number;
  y: number;
  size: number | null;
}

const WIDTH = 820;
const HEIGHT = 500;
const MARGIN = { top: 24, right: 28, bottom: 66, left: 74 };
const MIN_ZOOM_SPAN_RATIO = 0.08;
const COLORS = [
  "#24c486",
  "#58a6ff",
  "#f4bf5f",
  "#b98cff",
  "#ff7d78",
  "#66d9ef",
  "#f173b8",
  "#9dd672",
];

const customNumericValue = (vehicle: CustomEV, key: NumericMetricKey) => {
  const supported: Partial<Record<NumericMetricKey, number | null>> = {
    rangeKm: vehicle.rangeKm,
    batteryCapacityKWh: vehicle.batteryCapacityKWh,
    efficiencyWhPerKm: vehicle.efficiencyWhPerKm,
    fastChargingPowerKwDc: vehicle.fastChargingPowerKwDc,
    acceleration0100S: vehicle.acceleration0100S,
    torqueNm: vehicle.torqueNm,
    topSpeedKmh: vehicle.topSpeedKmh,
    seats: vehicle.seats,
    cargoVolumeL: vehicle.cargoVolumeL,
  };

  return supported[key] ?? null;
};

const formatNumber = (value: number | null, unit = "") =>
  value === null ? "N/A" : `${value}${unit ? ` ${unit}` : ""}`;

const scale = (value: number, domain: [number, number], range: [number, number]) => {
  if (domain[0] === domain[1]) return (range[0] + range[1]) / 2;
  return range[0] + ((value - domain[0]) / (domain[1] - domain[0])) * (range[1] - range[0]);
};

const ticks = (min: number, max: number, count = 5) =>
  Array.from({ length: count + 1 }, (_, index) =>
    Number((min + ((max - min) * index) / count).toFixed(1)),
  );

export function ScatterPlot({
  vehicles,
  config,
  selectedId,
  customEV,
  onSelect,
}: ScatterPlotProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState<PlotPoint | CustomPoint | null>(null);
  const [zoomDomains, setZoomDomains] = useState<{
    xDomain: [number, number];
    yDomain: [number, number];
  } | null>(null);
  const chart = useMemo(
    () => createChartData(vehicles, config, customEV, zoomDomains),
    [vehicles, config, customEV, zoomDomains],
  );
  const zoomed = Boolean(zoomDomains);

  useEffect(() => {
    setZoomDomains(null);
  }, [config, vehicles, customEV]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !chart.points.length) return;

    const handleWheel = (event: WheelEvent) => {
      applyWheelZoom(event, svg.getBoundingClientRect(), chart, setZoomDomains);
    };

    svg.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      svg.removeEventListener("wheel", handleWheel);
    };
  }, [chart]);

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Main visualization</p>
          <h2>{config.title}</h2>
        </div>
        <div className="chart-actions">
          <p className="chart-help">{config.bestRegion}</p>
          <button
            className="text-button compact-button"
            disabled={!zoomed}
            onClick={() => setZoomDomains(null)}
            type="button"
          >
            Reset zoom
          </button>
        </div>
      </div>
      <p className="chart-description">{config.description}</p>

      {chart.points.length ? (
        <>
          <div className="chart-container">
            <svg
              aria-label={config.title}
              className="scatter-plot"
              ref={svgRef}
              role="img"
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            >
              {chart.yTicks.map((tick) => (
                <g key={`y-${tick}`}>
                  <line
                    className="grid-line"
                    x1={MARGIN.left}
                    x2={WIDTH - MARGIN.right}
                    y1={chart.yScale(tick)}
                    y2={chart.yScale(tick)}
                  />
                  <text
                    className="axis-label"
                    textAnchor="end"
                    x={MARGIN.left - 12}
                    y={chart.yScale(tick) + 4}
                  >
                    {tick}
                  </text>
                </g>
              ))}
              {chart.xTicks.map((tick) => (
                <g key={`x-${tick}`}>
                  <line
                    className="grid-line"
                    x1={chart.xScale(tick)}
                    x2={chart.xScale(tick)}
                    y1={MARGIN.top}
                    y2={HEIGHT - MARGIN.bottom}
                  />
                  <text
                    className="axis-label"
                    textAnchor="middle"
                    x={chart.xScale(tick)}
                    y={HEIGHT - MARGIN.bottom + 24}
                  >
                    {tick}
                  </text>
                </g>
              ))}
              <text className="axis-title" textAnchor="middle" x={WIDTH / 2} y={492}>
                {config.xLabel}
              </text>
              <text
                className="axis-title"
                textAnchor="middle"
                transform={`rotate(-90 20 ${HEIGHT / 2})`}
                x="20"
                y={HEIGHT / 2}
              >
                {config.yLabel}
              </text>

              {chart.points.map((point) => (
                <circle
                  className={`data-point ${selectedId === point.vehicle.id ? "selected" : ""}`}
                  cx={chart.xScale(point.x)}
                  cy={chart.yScale(point.y)}
                  fill={chart.colorScale.get(point.color)}
                  key={point.vehicle.id}
                  onClick={() => onSelect?.(point.vehicle)}
                  onMouseEnter={() => setHovered(point)}
                  onMouseLeave={() => setHovered(null)}
                  r={chart.radiusScale(point.size)}
                  tabIndex={0}
                />
              ))}

              {chart.customPoint && (
                <g
                  className="custom-point-group"
                  onMouseEnter={() => setHovered(chart.customPoint)}
                  onMouseLeave={() => setHovered(null)}
                  tabIndex={0}
                >
                  <polygon
                    className="custom-point"
                    points={diamondPoints(
                      chart.xScale(chart.customPoint.x),
                      chart.yScale(chart.customPoint.y),
                      chart.radiusScale(chart.customPoint.size) + 4,
                    )}
                  />
                  <text
                    className="custom-point-label"
                    textAnchor="middle"
                    x={chart.xScale(chart.customPoint.x)}
                    y={
                      chart.yScale(chart.customPoint.y) -
                      chart.radiusScale(chart.customPoint.size) -
                      12
                    }
                  >
                    Your EV
                  </text>
                </g>
              )}
            </svg>
            {hovered && <Tooltip point={hovered} config={config} />}
          </div>
          <div className="chart-legend">
            {Array.from(chart.colorScale).map(([category, color]) => (
              <span key={category}>
                <i style={{ backgroundColor: color }} />
                {category}
              </span>
            ))}
            {chart.customPoint && (
              <span>
                <i className="legend-diamond" />
                Your EV
              </span>
            )}
          </div>
          <p className="zoom-hint">
            Use the mouse wheel over the chart to zoom in or out. Zoom centers on
            the cursor without scrolling the page.
          </p>
        </>
      ) : (
        <div className="empty-state">
          <strong>No plottable EVs</strong>
          <span>Adjust filters or choose a view with more complete data.</span>
        </div>
      )}
    </section>
  );
}

function applyWheelZoom(
  event: WheelEvent,
  bounds: DOMRect,
  chart: ReturnType<typeof createChartData>,
  setZoomDomains: (domains: {
    xDomain: [number, number];
    yDomain: [number, number];
  }) => void,
) {
    event.preventDefault();
    event.stopPropagation();

    const pointerX = MARGIN.left + ((event.clientX - bounds.left) / bounds.width) * WIDTH - MARGIN.left;
    const pointerY = MARGIN.top + ((event.clientY - bounds.top) / bounds.height) * HEIGHT - MARGIN.top;
    const normalizedX = clamp(pointerX / (WIDTH - MARGIN.left - MARGIN.right), 0, 1);
    const normalizedY = clamp(pointerY / (HEIGHT - MARGIN.top - MARGIN.bottom), 0, 1);
    const xAnchor = chart.xDomain[0] + normalizedX * (chart.xDomain[1] - chart.xDomain[0]);
    const yAnchor = chart.yDomain[1] - normalizedY * (chart.yDomain[1] - chart.yDomain[0]);
    const zoomFactor = event.deltaY < 0 ? 0.82 : 1.22;

    setZoomDomains({
      xDomain: zoomDomain(chart.xDomain, chart.baseXDomain, xAnchor, zoomFactor),
      yDomain: zoomDomain(chart.yDomain, chart.baseYDomain, yAnchor, zoomFactor),
    });
}

function createChartData(
  vehicles: ElectricVehicle[],
  config: ChartConfig,
  customEV?: CustomEV | null,
  zoomDomains?: {
    xDomain: [number, number];
    yDomain: [number, number];
  } | null,
) {
  const points: PlotPoint[] = vehicles
    .map((vehicle) => ({
      vehicle,
      x: vehicle[config.xKey],
      y: vehicle[config.yKey],
      size: vehicle[config.sizeKey],
      color: String(vehicle[config.colorKey] || "Unknown"),
    }))
    .filter((point): point is PlotPoint => point.x !== null && point.y !== null);

  const customPoint =
    customEV &&
    customNumericValue(customEV, config.xKey) !== null &&
    customNumericValue(customEV, config.yKey) !== null
      ? ({
          vehicle: customEV,
          x: customNumericValue(customEV, config.xKey) as number,
          y: customNumericValue(customEV, config.yKey) as number,
          size: customNumericValue(customEV, config.sizeKey),
        } satisfies CustomPoint)
      : null;

  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  if (customPoint) {
    xValues.push(customPoint.x);
    yValues.push(customPoint.y);
  }

  const sizeValues = points
    .map((point) => point.size)
    .filter((value): value is number => value !== null);
  if (customPoint?.size !== null && customPoint?.size !== undefined) {
    sizeValues.push(customPoint.size);
  }

  const baseXDomain = paddedDomain(xValues);
  const baseYDomain = paddedDomain(yValues);
  const xDomain = zoomDomains?.xDomain ?? baseXDomain;
  const yDomain = zoomDomains?.yDomain ?? baseYDomain;
  const sizeDomain = paddedDomain(sizeValues.length ? sizeValues : [1, 1]);
  const categories = Array.from(new Set(points.map((point) => point.color)));

  return {
    points,
    customPoint,
    baseXDomain,
    baseYDomain,
    xDomain,
    yDomain,
    xTicks: ticks(...xDomain),
    yTicks: ticks(...yDomain),
    xScale: (value: number) =>
      scale(
        value,
        xDomain,
        config.reverseX
          ? [WIDTH - MARGIN.right, MARGIN.left]
          : [MARGIN.left, WIDTH - MARGIN.right],
      ),
    yScale: (value: number) =>
      scale(value, yDomain, [HEIGHT - MARGIN.bottom, MARGIN.top]),
    radiusScale: (value: number | null) =>
      Math.sqrt(scale(value ?? sizeDomain[0], sizeDomain, [18, 115])),
    colorScale: new Map(
      categories.map((category, index) => [
        category,
        COLORS[index % COLORS.length],
      ]),
    ),
  };
}

function zoomDomain(
  domain: [number, number],
  baseDomain: [number, number],
  anchor: number,
  factor: number,
): [number, number] {
  const baseSpan = baseDomain[1] - baseDomain[0];
  const currentSpan = domain[1] - domain[0];
  const nextSpan = clamp(
    currentSpan * factor,
    baseSpan * MIN_ZOOM_SPAN_RATIO,
    baseSpan,
  );
  const leftRatio = currentSpan === 0 ? 0.5 : (anchor - domain[0]) / currentSpan;
  let min = anchor - nextSpan * leftRatio;
  let max = min + nextSpan;

  if (min < baseDomain[0]) {
    min = baseDomain[0];
    max = min + nextSpan;
  }

  if (max > baseDomain[1]) {
    max = baseDomain[1];
    min = max - nextSpan;
  }

  return [min, max];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function paddedDomain(values: number[]): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [min - 1, max + 1];

  const padding = (max - min) * 0.08;
  return [Math.floor((min - padding) * 10) / 10, Math.ceil((max + padding) * 10) / 10];
}

function diamondPoints(x: number, y: number, radius: number) {
  return `${x},${y - radius} ${x + radius},${y} ${x},${y + radius} ${x - radius},${y}`;
}

function Tooltip({
  point,
  config,
}: {
  point: PlotPoint | CustomPoint;
  config: ChartConfig;
}) {
  const isCustom = isCustomPoint(point);
  const brand = isCustom ? "Custom EV" : point.vehicle.brand;
  const model = isCustom ? point.vehicle.customName : point.vehicle.model;
  const metric = (key: NumericMetricKey) =>
    isCustom ? customNumericValue(point.vehicle, key) : point.vehicle[key];

  return (
    <div className="chart-tooltip">
      <strong>
        {brand} {model}
      </strong>
      <span>
        {config.xLabel}: {formatNumber(point.x)}
      </span>
      <span>
        {config.yLabel}: {formatNumber(point.y)}
      </span>
      <span>Range: {formatNumber(metric("rangeKm"), "km")}</span>
      <span>Battery: {formatNumber(metric("batteryCapacityKWh"), "kWh")}</span>
      <span>Efficiency: {formatNumber(metric("efficiencyWhPerKm"), "Wh/km")}</span>
      <span>
        Fast charging: {formatNumber(metric("fastChargingPowerKwDc"), "kW")}
      </span>
      <span>Acceleration: {formatNumber(metric("acceleration0100S"), "s")}</span>
      <span>Torque: {formatNumber(metric("torqueNm"), "Nm")}</span>
      <span>Top speed: {formatNumber(metric("topSpeedKmh"), "km/h")}</span>
      <span>
        Battery type: {isCustom ? "Custom input" : point.vehicle.batteryType}
      </span>
    </div>
  );
}

function isCustomPoint(point: PlotPoint | CustomPoint): point is CustomPoint {
  return "customName" in point.vehicle;
}
