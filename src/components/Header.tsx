interface HeaderProps {
  mode: "landing" | "buyers" | "analysis";
  onHome: () => void;
  onBuyers: () => void;
  onAnalysis: () => void;
}

export function Header({ mode, onHome, onBuyers, onAnalysis }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="brand-button" onClick={onHome} type="button">
        <span className="logo-mark">EV</span>
        <span>
          <strong>EV Explorer</strong>
          <small>User-centered EV discovery</small>
        </span>
      </button>
      <nav className="mode-nav" aria-label="Application modes">
        <button
          className={mode === "buyers" ? "active" : ""}
          onClick={onBuyers}
          type="button"
        >
          For Buyers
        </button>
        <button
          className={mode === "analysis" ? "active" : ""}
          onClick={onAnalysis}
          type="button"
        >
          For Analysis
        </button>
      </nav>
    </header>
  );
}
