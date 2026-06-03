import type { BuyerPersona } from "../types/ev";

interface PersonaSelectorProps {
  personas: BuyerPersona[];
  onSelect: (persona: BuyerPersona) => void;
}

export function PersonaSelector({ personas, onSelect }: PersonaSelectorProps) {
  return (
    <section className="persona-page">
      <div className="section-intro">
        <p className="eyebrow">For Buyers</p>
        <h1>Select a buyer persona</h1>
        <p>
          Each persona changes the chart, interpretation, and metrics to match a
          specific EV shopping scenario.
        </p>
      </div>
      <div className="persona-grid">
        {personas.map((persona) => (
          <button
            className="persona-card"
            key={persona.id}
            onClick={() => onSelect(persona)}
            type="button"
          >
            <h2>{persona.title}</h2>
            <p>{persona.subtitle}</p>
            <ul>
              {persona.painPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </section>
  );
}
