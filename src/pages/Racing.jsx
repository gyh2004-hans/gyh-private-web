import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CountUp from "../components/reactbits/CountUp/CountUp.jsx";
import SpotlightCard from "../components/reactbits/SpotlightCard/SpotlightCard.jsx";
import { ModuleHero, SubTabs, SectionTitle, Reveal, Colophon } from "../components/ui.jsx";
import { RACING } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { to: 105, label: "汉密尔顿 F1 胜场", suffix: "场" },
  { to: 7, label: "世界车手总冠军", suffix: "届" },
  { to: 24, label: "F1 年度分站", suffix: "站" },
  { to: 1994, label: "GT3 规则诞生", suffix: "年", plain: true },
];

export default function Racing() {
  const [tab, setTab] = useState(0);
  const data = RACING;

  return (
    <main className="garage-texture">
      <ModuleHero image={data.heroImage} en="Racing · F1 / GT3" zh="车库" intro={data.intro} word="GARAGE">
        <div className="mt-10 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <div className="border-l-2 pl-4" style={{ borderColor: "var(--accent)" }}>
                <div className="font-display text-3xl font-semibold md:text-4xl">
                  <CountUp to={s.to} duration={2} />
                  <span className="ml-1 text-sm opacity-60">{s.suffix}</span>
                </div>
                <p className="mt-1 text-[12px] opacity-60">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </ModuleHero>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SubTabs labels={["Formula 1", "GT3"]} active={tab} onChange={setTab} />

        {tab === 0 ? <F1Section data={data.f1} /> : <GT3Section data={data.gt3} />}
      </div>

      <Colophon id="racing" />
    </main>
  );
}

/* ── F1：赛车横向卷轴 + 车手卡片墙 ── */
function F1Section({ data }) {
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
      <SectionTitle zh="方程式赛道" en="Formula 1" desc="银箭与红牛的十年对决，先从赛车的形态开始看。" />

      {/* pinned 横向卷轴 */}
      <div ref={wrap} className="relative -mx-5 overflow-hidden md:-mx-10">
        <div ref={track} className="flex h-[100dvh] w-max items-center gap-6 px-5 py-4 md:px-10">
          {data.cars.map((c) => (
            <figure key={c.name} className="w-[78vw] shrink-0 md:w-[46vw]">
              <div className="ticks overflow-hidden" style={{ background: "var(--bg-2)" }}>
                <img src={c.img} alt={c.name} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="font-cn-serif text-xl font-bold">{c.name}</span>
                <span className="font-display text-sm italic opacity-55">{c.team}</span>
              </figcaption>
              <p className="mt-1 text-[13px] opacity-60">{c.note}</p>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <SectionTitle zh="维修墙后的车手" en="The Drivers" desc="把他们当作偶像的理由，从来不只是成绩。" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.drivers.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.04}>
              <SpotlightCard
                className="h-full !rounded-none !border-0 !bg-transparent p-0"
                spotlightColor="rgba(200, 55, 45, 0.22)"
              >
                <div className="h-full border" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
                  <div className="overflow-hidden">
                    <img src={d.img} alt={d.zh} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-2xl font-semibold">{d.name}</h3>
                      <span className="text-sm opacity-70">{d.zh}</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {d.facts.map((f) => (
                        <li key={f} className="flex gap-2 text-[13px] opacity-70">
                          <span style={{ color: "var(--accent)" }}>›</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── GT3：赛车卡片 + 氛围大图 ── */
function GT3Section({ data }) {
  return (
    <div>
      <SectionTitle zh="耐力赛场的 GT 战车" en="GT3 Class" desc="基于量产超跑的赛车，各家厂商在赛道上短兵相接。" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.cars.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.04}>
            <figure className="group">
              <div className="ticks overflow-hidden" style={{ background: "var(--bg-2)" }}>
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              </div>
              <figcaption className="mt-3">
                <h3 className="font-cn-serif text-xl font-bold transition-colors group-hover:text-[color:var(--accent)]">{c.name}</h3>
                <p className="mt-1 text-[13px] opacity-60">{c.note}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {data.atmosphere && (
        <Reveal className="my-20">
          <figure className="relative overflow-hidden">
            <img src={data.atmosphere} alt="GT3 赛事氛围" loading="lazy" className="aspect-[21/9] w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-8">
              <p className="font-display text-lg italic text-white/90">Race day. Engine warm, tyres cold.</p>
            </div>
          </figure>
        </Reveal>
      )}
    </div>
  );
}
