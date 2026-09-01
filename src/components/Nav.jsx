import { Link, useLocation } from "react-router-dom";
import { MODULES } from "../data/content.js";

export default function Nav() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const current = pathname.split("/")[1];

  return (
    <header className="fixed inset-x-0 top-0 z-[60] pointer-events-none">
      <div
        className="flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10"
        style={{ color: "var(--fg)" }}
      >
        <Link to="/" className="pointer-events-auto flex items-baseline gap-3">
          <span className="font-display text-2xl font-semibold tracking-[0.18em]">GYH</span>
          <span className="hidden text-[11px] tracking-[0.3em] opacity-60 md:inline">典藏画册</span>
        </Link>

        <nav className="pointer-events-auto hidden items-center gap-1 lg:flex">
          <NavLink to="/" active={isHome} label="封面" />
          {MODULES.map((m) => (
            <NavLink key={m.id} to={`/${m.id}`} active={current === m.id} label={m.zh} />
          ))}
        </nav>

        <span className="hidden font-display text-sm italic opacity-60 md:inline">
          {MODULES.find((m) => m.id === current)?.en ?? "Collected Passions"}
        </span>
      </div>

      {/* mobile module strip */}
      <div className="pointer-events-auto flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden [scrollbar-width:none]">
        <MobilePill to="/" active={isHome} label="封面" />
        {MODULES.map((m) => (
          <MobilePill key={m.id} to={`/${m.id}`} active={current === m.id} label={m.zh} />
        ))}
      </div>
    </header>
  );
}

function NavLink({ to, active, label }) {
  return (
    <Link
      to={to}
      className="relative rounded-full px-3.5 py-1.5 text-[13px] tracking-[0.12em] transition-colors"
      style={{
        color: active ? "#fff" : "var(--fg)",
        background: active ? "var(--accent)" : "transparent",
        opacity: active ? 1 : 0.75,
      }}
    >
      {label}
    </Link>
  );
}

function MobilePill({ to, active, label }) {
  return (
    <Link
      to={to}
      className="shrink-0 rounded-full border px-3 py-1 text-xs tracking-[0.1em]"
      style={{
        borderColor: "var(--line)",
        background: active ? "var(--accent)" : "color-mix(in srgb, var(--bg) 70%, transparent)",
        color: active ? "#fff" : "var(--fg)",
      }}
    >
      {label}
    </Link>
  );
}
