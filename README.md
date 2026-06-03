# EV Explorer

EV Explorer is a Vite, React, and TypeScript data visualization project for
exploring 2025 electric vehicle specifications. The project is designed around
two user-centered workflows instead of a single generic dashboard.

## Project Goal

The goal is to help people understand the EV market through interactive visual
comparison. A buyer can choose a lifestyle persona and interpret the market
through metrics that match their needs. An analyst can enter a custom EV
specification and compare it with real vehicles in the dataset.

## Target Users

- Potential EV buyers who want to shortlist vehicles based on daily driving,
  road trips, family practicality, or performance.
- Data visualization students and analysts who want to benchmark custom EV
  specifications against the market.

## Application Modes

### For Buyers

The buyer mode starts with four persona cards:

- City Commuter: efficiency, compactness, and daily range
- Long-Distance Driver: range and DC fast charging power
- Family User: seats, cargo volume, and interior practicality
- Performance User: acceleration, torque, and top speed

Each persona uses the same reusable scatter plot component with a different
chart configuration. Users can filter by brand, battery type, drivetrain, body
type, range, and battery capacity. Hovering shows a tooltip, and clicking a
point opens a detail panel with source link.

### For Analysis

The analysis mode lets users input a custom EV specification, then:

- places the custom EV as a highlighted point on the market scatter plot
- calculates percentiles for range, fast charging, acceleration, efficiency, and
  torque
- finds the top 5 most similar EVs using normalized distance across available
  numeric fields
- shows a comparison table between the custom EV and similar vehicles

## Dataset

The dashboard loads the CSV from:

```text
public/data/electric_vehicles_spec_2025.csv
```

Data source:
[Electric Vehicle Specifications Dataset 2025 on Kaggle](https://www.kaggle.com/datasets/urvishahir/electric-vehicle-specifications-dataset-2025/data).

The dataset includes fields such as brand, model, top speed, battery capacity,
battery type, torque, efficiency, range, acceleration, fast charging power,
cargo volume, seats, drivetrain, segment, dimensions, body type, and source URL.

Numeric fields are parsed safely. If a value cannot be parsed, it is treated as
`null` and excluded from calculations that require that field.

## Install

Install Node.js LTS, then install dependencies:

```sh
npm.cmd install
```

On Windows PowerShell, `npm.cmd` avoids script execution policy issues that can
block `npm.ps1`.

## Run Locally

```sh
npm.cmd run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Build

```sh
npm.cmd run build
```

The production files are generated in `dist/`.

## Preview Production Build

```sh
npm.cmd run preview
```

## Deploy

EV Explorer is a static Vite app. To deploy:

1. Run `npm.cmd run build`.
2. Upload `dist/` to a static host such as Netlify, Vercel, GitHub Pages, or
   Cloudflare Pages.
3. For connected Git deployments, use `npm.cmd run build` as the build command
   and `dist` as the output directory.
