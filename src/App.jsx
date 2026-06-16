import { useState, useEffect, useRef } from "react";

const STEPS = ["PENDING", "CALLBACK", "VERIFY", "PAID"];

function useStep(len, ms = 1800) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % len), ms);
    return () => clearInterval(t);
  }, []);
  return i;
}

function LedgerRow() {
  const active = useStep(STEPS.length);
  const dots = "················";

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-sm overflow-x-auto">
      <div className="flex items-center gap-0 whitespace-nowrap">
        {STEPS.map((s, i) => {
          const isActive = i === active;
          const isPast = i < active;
          return (
            <span key={s} className="flex items-center">
              <span
                style={{
                  color: isActive ? "#8B1A0E" : isPast ? "#C4B99A" : "#D4CEC4",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.08em",
                  fontSize: isActive ? "0.875rem" : "0.8rem",
                  transition: "all 0.4s ease",
                  textDecoration: isPast ? "line-through" : "none",
                  textDecorationColor: "#C4B99A",
                }}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span style={{ color: isPast ? "#C4B99A" : "#E2DDD6", margin: "0 6px", fontSize: "0.7rem" }}>
                  {dots.slice(0, 8)}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div style={{ borderTop: "1px solid #C4B99A", marginTop: "8px", paddingTop: "6px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#A09585", fontSize: "0.65rem", letterSpacing: "0.15em" }}>TRANSACTION STATE</span>
        <span style={{ color: "#8B1A0E", fontSize: "0.65rem", letterSpacing: "0.1em" }}>
          {active === 3 ? "SETTLED" : "IN PROGRESS"}
        </span>
      </div>
    </div>
  );
}

const providers = [
  { name: "eSewa",    code: "ESW", note: "HMAC-SHA256 · webhook verified"  },
  { name: "Khalti",   code: "KHL", note: "Token-based · lookup confirmed"   },
  { name: "Fonepay",  code: "FPY", note: "QR flow · provider re-checked"    },
];

const apiRoutes = [
  { m: "POST", path: "/pay",     note: "Open order, return redirect" },
  { m: "GET",  path: "/success", note: "Callback received → re-verify" },
  { m: "GET",  path: "/failure", note: "Mark failed or re-confirm" },
  { m: "POST", path: "/verify",  note: "Settle with provider, finalise" },
];

const trustLayers = [
  { label: "Frontend",     verdict: "Untrusted",         mark: "✗" },
  { label: "Callback",     verdict: "Partially trusted", mark: "~" },
  { label: "Provider API", verdict: "Source of truth",   mark: "✓" },
];

const v1 = [
  { label: "Multi-provider", body: "eSewa, Khalti, Fonepay behind one interface. One integration, three providers." },
  { label: "Verified callbacks", body: "Callbacks are hints. Every payment is re-confirmed directly against the provider before state advances." },
  { label: "Webhook delivery", body: "Signed, retryable notifications to your endpoint the moment a transaction is confirmed." },
  { label: "Idempotent API", body: "Safe to retry. Duplicate requests return the original response without re-processing." },
  { label: "API key auth", body: "Scoped, revocable keys. HMAC-signed requests. No secrets in query strings." },
  { label: "State machine", body: "Every order follows PENDING → CALLBACK → VERIFY → PAID with no ambiguous transitions." },
];

const v2 = [
  { label: "Refund API",        body: "Full or partial refunds, with provider-level reconciliation." },
  { label: "Settlement engine", body: "Automated reporting across providers, per-merchant fee breakdowns." },
  { label: "Sandbox",           body: "Isolated test mode mirroring production without touching real funds." },
  { label: "SDKs",              body: "First-party libraries for Rust, Node.js, and Go." },
  { label: "Analytics",         body: "Volume, success rates, provider performance via API and dashboard." },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #F2EDE4;
    color: #1A1409;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .ruled {
    border-top: 1px solid #C4B99A;
  }

  .ruled-double {
    border-top: 3px double #1A1409;
  }

  .col-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #A09585;
  }

  .ledger-entry {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 0 24px;
    padding: 14px 0;
    border-bottom: 1px solid #DDD8CF;
    align-items: start;
  }

  .ledger-entry:last-child { border-bottom: none; }

  .entry-key {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    color: #A09585;
    padding-top: 2px;
  }

  .entry-val {
    font-size: 0.875rem;
    color: #3A3028;
    line-height: 1.55;
  }

  .v1-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  @media (max-width: 640px) {
    .v1-grid { grid-template-columns: 1fr; }
    .hide-mobile { display: none !important; }
  }

  .v1-cell {
    padding: 24px 0 24px 0;
    border-bottom: 1px solid #DDD8CF;
    border-right: 1px solid #DDD8CF;
  }

  .v1-cell:nth-child(2n) { border-right: none; }
  .v1-cell:nth-last-child(-n+2) { border-bottom: none; }

  @media (max-width: 640px) {
    .v1-cell { border-right: none; }
    .v1-cell:last-child { border-bottom: none; }
    .v1-cell:nth-last-child(-n+2) { border-bottom: 1px solid #DDD8CF; }
    .v1-cell:last-child { border-bottom: none; }
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #C4B99A;
    border-radius: 2px;
    padding: 3px 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #6B6357;
  }

  .red-dot { width: 6px; height: 6px; background: #8B1A0E; border-radius: 50%; }

  a { color: inherit; text-decoration: none; }
  a:hover { color: #8B1A0E; }

  ::selection { background: #8B1A0E22; }
`;

function Section({ label, children, noBorder }) {
  return (
    <section style={{
      padding: "48px 0",
      borderTop: noBorder ? "none" : "1px solid #C4B99A",
    }}>
      {label && <div className="col-label" style={{ marginBottom: "28px" }}>{label}</div>}
      {children}
    </section>
  );
}

export default function App() {
  return (
    <>
      <style>{styles}</style>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 28px" }}>

        {/* Nav */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0",
          borderBottom: "3px double #1A1409",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: "0.95rem",
              letterSpacing: "0.05em",
              color: "#1A1409",
            }}>₨ NEPPAY</span>
          </div>
          <div className="pill">
            <div className="red-dot" />
            Private Beta
          </div>
        </header>

        {/* Hero */}
        <section style={{ padding: "64px 0 48px" }}>
          <div className="pill" style={{ marginBottom: "28px" }}>
            eSewa · Khalti · Fonepay
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            color: "#1A1409",
            marginBottom: "24px",
            fontWeight: 400,
          }}>
            Payment infrastructure<br />
            <em style={{ color: "#6B6357", fontStyle: "italic" }}>for Nepal,</em><br />
            built on Rust.
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.975rem",
            color: "#6B6357",
            lineHeight: 1.7,
            maxWidth: "520px",
            marginBottom: "40px",
            fontWeight: 300,
          }}>
            Verification-first payment orchestration. Every transaction is confirmed
            against the provider before state is committed — no callback trust, no fake PAID,
            no ambiguity. A clean state machine backed by a compiled Rust binary.
          </p>

          <div style={{
            background: "#EDE8DF",
            border: "1px solid #C4B99A",
            padding: "20px 24px",
            maxWidth: "520px",
          }}>
            <div className="col-label" style={{ marginBottom: "14px" }}>Order ledger — live state</div>
            <LedgerRow />
          </div>
        </section>

        {/* Providers */}
        <Section label="Providers">
          <div style={{ borderTop: "1px solid #C4B99A" }}>
            {providers.map((p) => (
              <div key={p.code} className="ledger-entry">
                <span className="entry-key">{p.code}</span>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: "3px", color: "#1A1409", fontSize: "0.9rem" }}>{p.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.7rem", color: "#A09585" }}>{p.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Trust model */}
        <Section label="Trust model">
          <div style={{ borderTop: "1px solid #C4B99A" }}>
            {trustLayers.map((t) => (
              <div key={t.label} className="ledger-entry">
                <span className="entry-key" style={{
                  color: t.mark === "✓" ? "#4A7A3D" : t.mark === "✗" ? "#8B1A0E" : "#A07030",
                  fontWeight: 600,
                  fontSize: "1rem",
                  paddingTop: 0,
                  fontFamily: "monospace",
                }}>{t.mark}</span>
                <div>
                  <div style={{ fontWeight: 500, color: "#1A1409", fontSize: "0.9rem", marginBottom: "3px" }}>{t.label}</div>
                  <div style={{ color: "#6B6357", fontSize: "0.82rem" }}>{t.verdict}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.8rem", color: "#A09585", marginTop: "20px", lineHeight: 1.6, fontStyle: "italic" }}>
            The backend is the single source of truth. Frontends and callbacks are untrusted inputs.
            Only the provider API settles a transaction.
          </p>
        </Section>

        {/* Architecture */}
        <Section label="Stack">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0", borderTop: "1px solid #C4B99A", borderLeft: "1px solid #C4B99A" }}>
            {["Axum", "Tokio", "sqlx", "SQLite", "eSewa SDK", "Khalti API", "Fonepay"].map((t) => (
              <div key={t} style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.75rem",
                color: "#6B6357",
                padding: "10px 18px",
                borderRight: "1px solid #C4B99A",
                borderBottom: "1px solid #C4B99A",
                letterSpacing: "0.05em",
              }}>{t}</div>
            ))}
          </div>
        </Section>

        {/* API */}
        <Section label="API surface">
          <div style={{ borderTop: "1px solid #C4B99A" }}>
            {apiRoutes.map(({ m, path, note }) => (
              <div key={path} className="ledger-entry">
                <span className="entry-key" style={{
                  color: m === "POST" ? "#1A3A8B" : "#4A7A3D",
                  fontWeight: 500,
                }}>{m}</span>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.82rem", color: "#1A1409", marginBottom: "3px" }}>{path}</div>
                  <div style={{ fontSize: "0.8rem", color: "#6B6357" }}>{note}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* V1 */}
        <Section label="Version 1.0 — shipping first">
          <div className="v1-grid" style={{ borderTop: "1px solid #C4B99A", borderLeft: "1px solid #C4B99A" }}>
            {v1.map((f) => (
              <div key={f.label} className="v1-cell" style={{ padding: "24px 20px", borderRight: "1px solid #C4B99A" }}>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.62rem",
                  color: "#8B1A0E",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}>✦</div>
                <div style={{ fontWeight: 500, fontSize: "0.9rem", color: "#1A1409", marginBottom: "8px" }}>{f.label}</div>
                <div style={{ fontSize: "0.82rem", color: "#6B6357", lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* V2 */}
        <Section label="Version 2.0 — later">
          <div style={{ borderTop: "1px solid #C4B99A" }}>
            {v2.map((f) => (
              <div key={f.label} className="ledger-entry" style={{ opacity: 0.55 }}>
                <span className="entry-key">{f.label}</span>
                <span className="entry-val" style={{ color: "#6B6357", fontSize: "0.82rem" }}>{f.body}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <footer style={{
          borderTop: "3px double #1A1409",
          padding: "20px 0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.75rem",
            color: "#A09585",
            letterSpacing: "0.08em",
          }}>₨ NEPPAY</span>
          <a
            href="https://github.com/tarnished292"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.7rem",
              color: "#A09585",
              letterSpacing: "0.08em",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color = "#8B1A0E"}
            onMouseLeave={e => e.target.style.color = "#A09585"}
          >
            @tarnished292
          </a>
        </footer>

      </div>
    </>
  );
}