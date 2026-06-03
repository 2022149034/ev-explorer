import type { AnalysisView, BuyerPersona } from "../types/ev";

export const analysisViews: AnalysisView[] = [
  {
    id: "battery-range",
    title: "Battery Capacity vs Range",
    purpose:
      "Analyze whether the EV's driving range is reasonable for its battery capacity.",
    interpretation:
      "Larger batteries usually provide longer range. If the custom EV is higher than vehicles with similar battery capacity, it has strong range efficiency.",
    chart: {
      xKey: "batteryCapacityKWh",
      yKey: "rangeKm",
      colorKey: "batteryType",
      sizeKey: "efficiencyWhPerKm",
      xLabel: "Battery Capacity (kWh)",
      yLabel: "Range (km)",
      title: "Battery Capacity vs Range",
      description:
        "Compare battery size with driving range to spot vehicles that travel farther for their capacity.",
      bestRegion:
        "Best region: upper-right, with especially strong vehicles above the market trend.",
    },
  },
  {
    id: "charging-range",
    title: "Range vs Fast Charging Power",
    purpose: "Analyze long-distance driving capability.",
    interpretation:
      "Higher range and higher fast charging power make an EV more suitable for long-distance travel.",
    chart: {
      xKey: "fastChargingPowerKwDc",
      yKey: "rangeKm",
      colorKey: "fastChargePort",
      sizeKey: "batteryCapacityKWh",
      xLabel: "Fast Charging Power (kW DC)",
      yLabel: "Range (km)",
      title: "Range vs Fast Charging Power",
      description:
        "Road-trip capability improves when long range is paired with high DC charging power.",
      bestRegion: "Best region: upper-right. Higher range and charging power are better.",
    },
  },
  {
    id: "efficiency-range",
    title: "Efficiency vs Range",
    purpose: "Analyze energy consumption and range quality.",
    interpretation:
      "Lower Wh/km is better, and higher range is better. Vehicles in the upper-left area achieve long range with relatively low energy consumption.",
    chart: {
      xKey: "efficiencyWhPerKm",
      yKey: "rangeKm",
      colorKey: "carBodyType",
      sizeKey: "batteryCapacityKWh",
      xLabel: "Efficiency (Wh/km)",
      yLabel: "Range (km)",
      title: "Efficiency vs Range",
      description:
        "A strong EV uses relatively little energy while still delivering useful range.",
      bestRegion: "Best region: upper-left. Lower Wh/km and higher range are better.",
    },
  },
  {
    id: "performance",
    title: "Torque vs Acceleration",
    purpose: "Analyze performance.",
    interpretation:
      "Lower acceleration time is better, and higher torque is better. The best performance vehicles appear in the upper-left area.",
    chart: {
      xKey: "acceleration0100S",
      yKey: "torqueNm",
      colorKey: "drivetrain",
      sizeKey: "topSpeedKmh",
      xLabel: "0-100 km/h Acceleration (s)",
      yLabel: "Torque (Nm)",
      title: "Torque vs Acceleration",
      description:
        "Performance EVs combine quick acceleration with strong torque and high top speed.",
      bestRegion:
        "Best region: upper-left. The x-axis is not reversed, so quicker acceleration naturally appears on the left.",
    },
  },
];

export const buyerPersonas: BuyerPersona[] = [
  {
    id: "city",
    title: "City Commuter",
    subtitle: "Efficient, compact EVs with enough range for daily travel.",
    painPoints: ["energy efficiency", "compact size", "enough range for daily use"],
    chart: {
      xKey: "efficiencyWhPerKm",
      yKey: "rangeKm",
      colorKey: "carBodyType",
      sizeKey: "batteryCapacityKWh",
      xLabel: "Efficiency (Wh/km)",
      yLabel: "Range (km)",
      title: "Efficiency vs. daily range",
      description:
        "Lower energy use and higher range make a city EV easier to live with.",
      bestRegion: "Best region: upper-left. Lower Wh/km is better; higher range is better.",
    },
  },
  {
    id: "long-distance",
    title: "Long-Distance Driver",
    subtitle: "Long range and high DC charging power for road trips.",
    painPoints: ["long driving range", "fast charging"],
    chart: {
      xKey: "fastChargingPowerKwDc",
      yKey: "rangeKm",
      colorKey: "fastChargePort",
      sizeKey: "batteryCapacityKWh",
      xLabel: "DC fast charging power (kW)",
      yLabel: "Range (km)",
      title: "Charging power vs. range",
      description:
        "The strongest road-trip EVs combine high range with high DC charging power.",
      bestRegion: "Best region: upper-right. Higher charging power and range are better.",
    },
  },
  {
    id: "family",
    title: "Family User",
    subtitle: "Seats, cargo capacity, and interior practicality.",
    painPoints: ["seats", "cargo volume", "interior space"],
    chart: {
      xKey: "seats",
      yKey: "cargoVolumeL",
      colorKey: "carBodyType",
      sizeKey: "lengthMm",
      xLabel: "Seats",
      yLabel: "Cargo volume (L)",
      title: "Passenger capacity vs. cargo space",
      description:
        "Family-oriented EVs need enough seats and storage for daily routines.",
      bestRegion: "Best region: upper-right. More seats and cargo volume are better.",
    },
  },
  {
    id: "performance",
    title: "Performance User",
    subtitle: "Quick acceleration, high torque, and strong top speed.",
    painPoints: ["acceleration", "torque", "top speed"],
    chart: {
      xKey: "acceleration0100S",
      yKey: "torqueNm",
      colorKey: "drivetrain",
      sizeKey: "topSpeedKmh",
      xLabel: "0-100 km/h acceleration (s)",
      yLabel: "Torque (Nm)",
      title: "Acceleration vs. torque",
      description:
        "Faster EVs sit toward the left, while higher-torque EVs sit toward the top.",
      bestRegion: "Best region: upper-left. Lower acceleration time and higher torque are better.",
    },
  },
];
