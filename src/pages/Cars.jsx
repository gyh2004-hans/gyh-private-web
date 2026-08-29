import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ModuleHero, SubTabs, SectionTitle, Reveal, Colophon, ParallaxImage } from "../components/ui.jsx";
import { CARS } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Cars() {
  const [tab, setTab] = useState(0);
  const data = CARS;

  return (
    <main className="showroom-glow">
      <ModuleHero image={data.heroImage} en="Performance Cars" zh="展厅" intro={data.intro} word="SHOWROOM" />

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SubTabs labels={["德系高性能", "超跑", "沃尔沃"]} active={tab} onChange={setTab} />

        {tab === 0 && <GermanSection brands={data.german} />}
        {tab === 1 && <SupercarSection cars={data.supercars} />}
        {tab === 2 && <VolvoSection cars={data.volvo} />}
      </div>

      <Colophon id="cars" />
    </main>
  );
}

/* ── 德系高性能：品牌切换 + 车卡 ── */
function GermanSection({ brands }) {
  const [brand, setBrand] = useState(0);
  const grid = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        grid.current.querySelectorAll(".brand-car"),
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" }
      );
    },
    { scope: grid, dependencies: [brand] }
  );

  const b = brands[brand];
  return (
    <div>
      <SectionTitle zh="德系高性能联盟" en="German Performance" desc="AMG、BMW M、Audi RS 与大众 GTI，四种性格同样的偏执。" />

      {/* 品牌切换 */}
      <div className="mb-10 flex flex-wrap gap-3">
        {brands.map((x, i) => (
          <button
            key={x.brand}
            onClick={() => setBrand(i)}
            className="rounded-full border px-5 py-2 text-sm tracking-[0.1em] transition-all duration-300"
            style={{
              borderColor: brand === i ? "var(--accent)" : "var(--line)",
              background: brand === i ? "var(--accent)" : "transparent",
              color: brand === i ? "#fff" : "var(--fg)",
              opacity: brand === i ? 1 : 0.7,
            }}
          >
            {x.brand}
          </button>
        ))}
      </div>

      <div className="mb-8 flex items-baseline gap-4">
        <p className="font-display text-2xl italic" style={{ color: "var(--accent)" }}>{b.slogan}</p>
      </div>

      <div ref={grid} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {b.cars.map((c) => (
          <figure key={c.name} className="brand-car group">
            <div className="relative overflow-hidden" style={{ background: "var(--bg-2)" }}>
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%)" }}
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-3 border-b pb-3" style={{ borderColor: "var(--line)" }}>
              <h3 className="font-cn-serif text-lg font-bold">{c.name}</h3>
              <span className="text-[12px] opacity-55">{c.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ── 超跑：pinned 横向展厅 ── */
function SupercarSection({ cars }) {
  const wrap = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const distance = track.current.scrollWidth - wrap.current.clientWidth;
      if (distance <= 0) return;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: wrap }
  );

  return (
    <div>
      <SectionTitle zh="顶端的那几台" en="Hyper & Super" desc="内燃机时代的尖峰之作，一台就是一章。" />
      <div ref={wrap} className="relative -mx-5 overflow-hidden md:-mx-10">
        <div ref={track} className="flex h-[100dvh] w-max items-center gap-8 px-5 py-6 md:px-10">
          {cars.map((c, i) => (
            <figure key={c.name} className="group w-[80vw] shrink-0 md:w-[52vw]">
              <div className="relative overflow-hidden" style={{ background: "var(--bg-2)" }}>
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <span
                  className="absolute left-5 top-5 font-display text-6xl font-bold italic opacity-30"
                  style={{ color: "var(--accent)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                <span className="text-[13px] opacity-60">{c.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 沃尔沃：编辑部分，交错大图 ── */
function VolvoSection({ cars }) {
  return (
    <div>
      <SectionTitle zh="北欧的另一条路" en="Volvo" desc="不需要声浪证明自己，安全、旅行车与斯堪的纳维亚的克制。" />
      <div className="space-y-20">
        {cars.map((c, i) => (
          <Reveal key={c.name}>
            <div className={`grid items-center gap-8 md:grid-cols-12 ${i % 2 ? "" : ""}`}>
              <ParallaxImage
                src={c.img}
                alt={c.name}
                className={`md:col-span-7 ${i % 2 ? "md:order-2" : ""}`}
                strength={10}
              />
              <div className={`md:col-span-5 ${i % 2 ? "md:order-1 md:text-right" : ""}`}>
                <p className="font-display text-sm italic tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                  N° {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-cn-serif text-3xl font-black md:text-4xl">{c.name}</h3>
                <p className="mt-3 max-w-[38ch] text-[14px] leading-relaxed opacity-70 md:inline-block">{c.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
