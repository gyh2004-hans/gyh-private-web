import { useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ModuleHero, SubTabs, SectionTitle, Reveal, Colophon, ParallaxImage } from "../components/ui.jsx";
import { FISH } from "../data/content.js";

gsap.registerPlugin(useGSAP);

/* 随机上升气泡装饰 */
function Bubbles() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 14,
        duration: 7 + Math.random() * 9,
        delay: -Math.random() * 12,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Aqua() {
  const [tab, setTab] = useState(0);

  return (
    <main className="relative overflow-x-clip" style={{ background: "radial-gradient(ellipse 90% 60% at 50% -10%, #0e2a3a, transparent 60%), var(--bg)" }}>
      <Bubbles />
      <div className="relative z-10">
        <ModuleHero image={FISH.heroImage} en="Aquarium · Tetra / Pleco / Biotope" zh="水族馆" intro={FISH.intro} word="AQUARIUM" />
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <SubTabs labels={["灯科鱼", "异形鱼", "南美缸"]} active={tab} onChange={setTab} />
          {tab === 0 && <FishGrid items={FISH.tetra} en="Small Tetras" zh="群游的光点" desc="灯科鱼是草缸的灵魂：体型小巧、色彩剔透，成群游动时整只缸都会发光。" swim />}
          {tab === 1 && <FishGrid items={FISH.pleco} en="Loricariidae" zh="水底的铠甲" desc="异形鱼来自南美，身披骨板、夜行底栖，每一只的花纹都独一无二。" />}
          {tab === 2 && <ScapeSection items={FISH.aquascape} />}
        </div>
        <Colophon id="aqua" />
      </div>
    </main>
  );
}

function FishGrid({ items, zh, en, desc, swim = false }) {
  const grid = useRef(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        grid.current.querySelectorAll(".fish-card"),
        { autoAlpha: 0, y: 44 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }
      );
    },
    { scope: grid, dependencies: [items] }
  );

  return (
    <div>
      <SectionTitle zh={zh} en={en} desc={desc} />
      <div ref={grid} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <figure key={f.name} className="fish-card group border backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
            <div className="overflow-hidden">
              <img
                src={f.img}
                alt={f.name}
                loading="lazy"
                className={`aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.07] ${swim ? "swim" : ""}`}
                style={swim ? { animationDelay: `${i * 0.7}s` } : undefined}
              />
            </div>
            <figcaption className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-cn-serif text-xl font-bold">{f.name}</h3>
                <span className="font-display text-sm italic opacity-60">{f.en}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed opacity-70">{f.desc}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ScapeSection({ items }) {
  return (
    <div>
      <SectionTitle zh="把雨林搬回家" en="South American Biotope" desc="沉木、落叶、黑水与群游的灯科：南美缸造景的三个方向。" />
      <div className="space-y-24">
        {items.map((s, i) => (
          <Reveal key={s.name}>
            <div className="grid items-center gap-10 md:grid-cols-12">
              <ParallaxImage src={s.img} alt={s.name} className={`md:col-span-8 ${i % 2 ? "md:order-2" : ""}`} strength={9} />
              <div className={`md:col-span-4 ${i % 2 ? "md:order-1 md:text-right" : ""}`}>
                <p className="font-display text-sm italic tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                  {s.en}
                </p>
                <h3 className="mt-2 font-cn-serif text-3xl font-black md:text-4xl">{s.name}</h3>
                <p className="mt-4 inline-block max-w-[36ch] text-[14px] leading-relaxed opacity-70">{s.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
