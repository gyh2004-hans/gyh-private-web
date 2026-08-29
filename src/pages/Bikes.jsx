import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CountUp from "../components/reactbits/CountUp/CountUp.jsx";
import { ModuleHero, SectionTitle, Reveal, Colophon } from "../components/ui.jsx";
import { BIKES } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { to: 11, label: "收录旗舰车型", suffix: "款" },
  { to: 6.6, label: "最轻整车重量", suffix: "kg", decimals: 1 },
  { to: 2, label: "年份跨度", suffix: "年" },
];

const TYPES = ["全部", "气动", "全能轻量", "全能", "全能气动"];

export default function Bikes() {
  const data = BIKES;
  const [type, setType] = useState(0);

  const filtered = type === 0 ? data.list : data.list.filter((b) => b.type === TYPES[type]);

  return (
    <main>
      <ModuleHero image={data.heroImage} en="Road Cycling" zh="车队" intro={data.intro} word="PELOTON">
        <div className="mt-10 flex max-w-3xl gap-10">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <div className="border-l-2 pl-4" style={{ borderColor: "var(--accent)" }}>
                <div className="font-display text-3xl font-semibold md:text-4xl">
                  <CountUp to={s.to} duration={1.8} />
                  <span className="ml-1 text-sm opacity-60">{s.suffix}</span>
                </div>
                <p className="mt-1 text-[12px] opacity-60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </ModuleHero>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionTitle zh="旗舰目录" en="The Flagship Index" desc="把光标停在任何一行上，让那台车驶出来。" />

        {/* 类型过滤 */}
        <div className="mb-8 flex flex-wrap gap-3">
          {TYPES.map((t, i) => (
            <button
              key={t}
              onClick={() => setType(i)}
              className="rounded-full border px-4 py-1.5 text-[13px] transition-all duration-300"
              style={{
                borderColor: type === i ? "var(--accent)" : "var(--line)",
                background: type === i ? "var(--accent)" : "transparent",
                color: type === i ? "#fff" : "var(--fg)",
                opacity: type === i ? 1 : 0.65,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <IndexList items={filtered} />
      </div>

      <Colophon id="bikes" />
    </main>
  );
}

function IndexList({ items }) {
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const [active, setActive] = useState(null);

  // 光标跟随的悬浮预览
  useGSAP(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const xTo = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e) => {
      xTo(e.clientX + 28);
      yTo(e.clientY - 130);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      listRef.current.querySelectorAll(".index-row"),
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }
    );
  }, [items, listRef]);

  return (
    <div ref={listRef} className="relative border-t" style={{ borderColor: "var(--line)" }}>
      {items.map((b, i) => (
        <button
          key={b.model}
          className="index-row group relative block w-full border-b text-left"
          style={{ borderColor: "var(--line)" }}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
        >
          <div className="grid grid-cols-12 items-baseline gap-3 py-5 md:py-6">
            <span className="col-span-2 font-display text-sm italic opacity-45 md:col-span-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="row-title col-span-10 font-cn-serif text-xl font-bold md:col-span-4 md:text-2xl">
              {b.brand}
              <span className="ml-2 hidden font-display text-base font-medium italic opacity-60 md:inline">{b.model}</span>
            </span>
            <span className="col-span-6 pl-[10%] text-[13px] opacity-60 md:col-span-3 md:pl-0">{b.type}</span>
            <span className="col-span-4 text-[13px] opacity-60 md:col-span-2">{b.weight}</span>
            <span className="col-span-2 text-right font-display text-sm italic opacity-45 md:col-span-2">{b.year}</span>
            <p className="col-span-12 mt-1 hidden text-[13px] opacity-0 transition-opacity duration-300 group-hover:opacity-60 md:block">
              {b.note}
            </p>
          </div>
        </button>
      ))}

      {/* 悬浮预览（桌面端） */}
      <div
        ref={previewRef}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <div
          className="h-40 w-64 overflow-hidden shadow-2xl transition-opacity duration-300"
          style={{ opacity: active != null && items[active] ? 1 : 0, background: "var(--bg-2)" }}
        >
          {active != null && items[active] && (
            <img src={items[active].img} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}
