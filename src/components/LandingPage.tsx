interface LandingPageProps {
  onBuyers: () => void;
  onAnalysis: () => void;
}

export function LandingPage({ onBuyers, onAnalysis }: LandingPageProps) {
  return (
    <section className="landing">
      <div className="hero-copy">
        <p className="eyebrow">Two-mode EV decision support</p>
        <h1>Choose how you want to explore the EV market.</h1>
        <p>
          EV Explorer turns 2025 electric vehicle specifications into targeted
          visual comparisons for everyday buyers and data-driven analysis.
        </p>
      </div>
      <div className="mode-card-grid">
        <button className="mode-card" onClick={onBuyers} type="button">
          <span>01</span>
          <h2>For Buyers</h2>
          <p>Find the best EV based on your lifestyle and driving needs.</p>
        </button>
        <button className="mode-card" onClick={onAnalysis} type="button">
          <span>02</span>
          <h2>For Analysis</h2>
          <p>Input your own EV specifications and compare them with the market.</p>
        </button>
      </div>
    </section>
  );
}
