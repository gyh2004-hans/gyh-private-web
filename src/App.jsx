import { gsap } from "gsap";
import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import Nav from "./components/Nav.jsx";
import Intro from "./components/Intro.jsx";
import Home from "./pages/Home.jsx";
import Racing from "./pages/Racing.jsx";
import Cars from "./pages/Cars.jsx";
import Bikes from "./pages/Bikes.jsx";
import Photo from "./pages/Photo.jsx";
import Aqua from "./pages/Aqua.jsx";
import { MODULES } from "./data/content.js";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const WipeCtx = createContext(() => {});
export const useWipe = () => useContext(WipeCtx);

const THEMES = Object.fromEntries(MODULES.map((m) => [m.id, m]));

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef(null);
  const labelRef = useRef(null);
  const lenisRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Lenis smooth scroll synced to GSAP ticker
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // scroll to top on route change
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [location.pathname]);

  // keep data-theme in sync (for backdrop color under overlays)
  useEffect(() => {
    const id = location.pathname.split("/")[1] || "home";
    const mod = THEMES[id];
    document.documentElement.dataset.theme = mod ? mod.theme : "magazine";
  }, [location.pathname]);

  const wipe = useCallback(
    (path, word) => {
      const overlay = overlayRef.current;
      if (!overlay) return navigate(path);
      const label = labelRef.current;
      label.textContent = word || "";
      gsap
        .timeline()
        .set(overlay, { visibility: "visible" })
        .fromTo(
          overlay.querySelector(".wipe-panel"),
          { yPercent: 100 },
          { yPercent: 0, duration: 0.55, ease: "power3.inOut", stagger: 0.07 }
        )
        .fromTo(label, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.2")
        .add(() => navigate(path))
        .to(label, { autoAlpha: 0, y: -28, duration: 0.3, delay: 0.25 })
        .to(overlay.querySelector(".wipe-panel"), {
          yPercent: -100,
          duration: 0.6,
          ease: "power3.inOut",
          stagger: 0.07,
        })
        .set(overlay, { visibility: "hidden" });
    },
    [navigate]
  );

  return (
    <WipeCtx.Provider value={wipe}>
      <div className="theme-surface grain min-h-[100dvh]" data-route={location.pathname}>
        <Intro onDone={() => setReady(true)} />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/racing" element={<Racing />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/photo" element={<Photo />} />
          <Route path="/aqua" element={<Aqua />} />
          <Route path="*" element={<Home />} />
        </Routes>

        {/* module wipe transition overlay */}
        <div ref={overlayRef} className="fixed inset-0 z-[90] invisible" aria-hidden="true">
          <div className="wipe-panel absolute inset-0" style={{ background: "#17150f" }} />
          <div
            className="wipe-panel absolute inset-0 flex items-center justify-center"
            style={{ background: "var(--bg, #17150f)" }}
          >
            <span
              ref={labelRef}
              className="font-display text-[13vw] leading-none tracking-[0.08em] uppercase opacity-90"
              style={{ color: "var(--fg)" }}
            />
          </div>
        </div>
      </div>
    </WipeCtx.Provider>
  );
}
