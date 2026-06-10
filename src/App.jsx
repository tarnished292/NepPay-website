import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const STEPS = ["PENDING", "CALLBACK", "VERIFY", "PAID"];

function useStep(len, ms = 1600) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % len), ms);
    return () => clearInterval(t);
  }, []);
  return i;
}

function StatePipeline() {
  const active = useStep(STEPS.length);
  return (
    <div className="flex items-center w-full max-w-lg">
      {STEPS.map((s, i) => {
        const isActive = i === active;
        const isPast = i < active;
        return (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`h-px w-full transition-all duration-700 ${
                  isPast || isActive ? "bg-white/70" : "bg-white/10"
                }`}
              />
              <span
                className={`font-mono text-[10px] tracking-[0.15em] transition-all duration-500 ${
                  isActive ? "text-white" : isPast ? "text-white/25" : "text-white/10"
                }`}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`font-mono text-[10px] mx-1.5 pb-4 transition-colors duration-500 ${
                  isPast ? "text-white/25" : "text-white/10"
                }`}
              >
                →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const features = [
  {
    label: "Verification-first",
    body: "Callbacks are never trusted. Every payment is confirmed directly against the provider API before state is updated.",
  },
  {
    label: "Pluggable providers",
    body: "eSewa, Khalti, and Fonepay share a single interface. Swap or add providers without touching core logic.",
  },
  {
    label: "Built on Rust",
    body: "Memory-safe, zero-cost abstractions, compiled binary. Fast by default, secure by design.",
  },
  {
    label: "Backend owns state",
    body: "Frontend and callbacks are untrusted inputs. The Rust backend is the single source of truth from PENDING to PAID.",
  },
];

const apis = [
  { m: "POST", path: "/pay",      note: "Create order, return provider redirect URL" },
  { m: "GET",  path: "/success",  note: "Receive callback → verify → update state"   },
  { m: "GET",  path: "/failure",  note: "Mark failed or re-verify on ambiguity"       },
  { m: "POST", path: "/verify",   note: "Call provider API, finalise PAID or FAILED"  },
];

export default function App() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div
      className="min-h-screen text-white"
      style={{
        fontFamily: "'Inter', sans-serif",
        background:
          "radial-gradient(ellipse 90% 60% at 50% -5%, #111827 0%, #0a0a12 45%, #060608 100%)",
      }}
    >
      {/* Nav */}
      <header className="border-b border-white/[0.05] px-8 md:px-16 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-white flex items-center justify-center">
            <span className="text-black font-bold text-[10px]" style={{ fontFamily: "monospace" }}>
              ₨
            </span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">NepPay</span>
        </div>
        <span className="text-[11px] text-white/20 tracking-widest font-mono uppercase">
          Private Beta
        </span>
      </header>

      {/* Hero */}
      <section className="px-8 md:px-16 pt-24 pb-20 max-w-4xl">
        <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
            eSewa · Khalti · Fonepay
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.03em] mb-6 text-white">
          Payment infrastructure
          <br />
          <span className="text-white/25">for Nepal,</span>
          <br />
          built on Rust.
        </h1>

        <p className="text-white/35 text-base md:text-lg leading-relaxed max-w-xl mb-10">
          NepPay is a verification-first payment orchestration layer. Every transaction is confirmed
          against the provider before state is committed. No fake PAID. No callback trust. Just a
          clean state machine backed by a compiled Rust binary.
        </p>

        <StatePipeline />
      </section>

      {/* Features grid */}
      <section className="px-8 md:px-16 py-16 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05]">
          {features.map((f) => (
            <div key={f.label} style={{ background: "rgba(10,10,18,0.95)" }} className="p-8">
              <p className="text-white text-sm font-semibold mb-3">{f.label}</p>
              <p className="text-white/35 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="px-8 md:px-16 py-16 border-t border-white/[0.05]">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-8">
          Architecture
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm font-mono">
          {["Axum", "SQLite", "Rust", "eSewa SDK", "Khalti API", "Fonepay"].map((t, i, arr) => (
            <span key={t} className="flex items-center gap-3">
              <span className="text-white/45">{t}</span>
              {i < arr.length - 1 && <span className="text-white/15">·</span>}
            </span>
          ))}
        </div>
      </section>

      {/* API */}
      <section className="px-8 md:px-16 py-16 border-t border-white/[0.05]">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-8">API</p>
        <div className="divide-y divide-white/[0.05]">
          {apis.map(({ m, path, note }) => (
            <div key={path} className="flex items-center gap-6 py-4">
              <span
                className="font-mono text-[11px] w-10 shrink-0 font-semibold"
                style={{ color: m === "POST" ? "#7b9fff" : "#5ec88a" }}
              >
                {m}
              </span>
              <span className="font-mono text-sm text-white/65 w-28 shrink-0">{path}</span>
              <span className="text-white/25 text-sm">{note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust model */}
      <section className="px-8 md:px-16 py-16 border-t border-white/[0.05]">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-8">
          Trust model
        </p>
        <div className="grid grid-cols-3 gap-px bg-white/[0.05] max-w-lg">
          {[
            { layer: "Frontend",     trust: "Untrusted",         color: "#ef4444" },
            { layer: "Callback",     trust: "Partially trusted", color: "#f59e0b" },
            { layer: "Provider API", trust: "Source of truth",   color: "#22c55e" },
          ].map(({ layer, trust, color }) => (
            <div key={layer} style={{ background: "rgba(10,10,18,0.95)" }} className="px-5 py-5">
              <div className="w-1.5 h-1.5 rounded-full mb-3" style={{ background: color }} />
              <p className="text-white/60 text-xs mb-1">{layer}</p>
              <p className="text-white/25 text-[11px] font-mono">{trust}</p>
            </div>
          ))}
        </div>
      </section>

    

      {/* Footer */}
      <footer className="border-t border-white/[0.05] px-8 md:px-16 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded bg-white flex items-center justify-center">
            <span className="text-black font-bold text-[8px]" style={{ fontFamily: "monospace" }}>
              ₨
            </span>
          </div>
          <span className="text-xs font-semibold text-white/35">NepPay</span>
        </div>
        <a
          href="https://github.com/tarnished292"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-white/20 hover:text-white/50 transition-colors tracking-wide"
        >
          built by @tarnished292
        </a>
      </footer>
      <Analytics />
    </div>
  );
}