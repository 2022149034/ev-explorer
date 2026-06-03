import { useMemo, useState } from "react";
import { AnalysisMode } from "./components/AnalysisMode";
import { BuyerMode } from "./components/BuyerMode";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { PersonaSelector } from "./components/PersonaSelector";
import { useEVData } from "./hooks/useEVData";
import type { BuyerPersona } from "./types/ev";
import { getFilterBounds } from "./utils/dataCleaning";
import { buyerPersonas } from "./utils/personas";

type AppMode = "landing" | "buyers" | "analysis";

export default function App() {
  const { vehicles, loading, error } = useEVData();
  const [mode, setMode] = useState<AppMode>("landing");
  const [selectedPersona, setSelectedPersona] = useState<BuyerPersona | null>(null);
  const bounds = useMemo(
    () => (vehicles.length ? getFilterBounds(vehicles) : null),
    [vehicles],
  );

  if (loading) {
    return <main className="status-screen">Loading EV specifications...</main>;
  }

  if (error || !bounds) {
    return (
      <main className="status-screen error">
        {error ?? "The EV dataset is empty."}
      </main>
    );
  }

  const goHome = () => {
    setMode("landing");
    setSelectedPersona(null);
  };

  const goBuyers = () => {
    setMode("buyers");
    setSelectedPersona(null);
  };

  const goAnalysis = () => {
    setMode("analysis");
    setSelectedPersona(null);
  };

  return (
    <main className="app-shell">
      <Header
        mode={mode}
        onAnalysis={goAnalysis}
        onBuyers={goBuyers}
        onHome={goHome}
      />
      {mode === "landing" && (
        <LandingPage onAnalysis={goAnalysis} onBuyers={goBuyers} />
      )}
      {mode === "buyers" &&
        (selectedPersona ? (
          <BuyerMode
            bounds={bounds}
            onSelectPersona={setSelectedPersona}
            personas={buyerPersonas}
            selectedPersona={selectedPersona}
            vehicles={vehicles}
          />
        ) : (
          <PersonaSelector
            onSelect={setSelectedPersona}
            personas={buyerPersonas}
          />
        ))}
      {mode === "analysis" && <AnalysisMode vehicles={vehicles} />}
    </main>
  );
}
