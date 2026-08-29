import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router-dom";
import SplitText from "../components/reactbits/SplitText/SplitText.jsx";
import GlareHover from "../components/reactbits/GlareHover/GlareHover.jsx";
import Magnet from "../components/reactbits/Magnet/Magnet.jsx";
import { Reveal } from "../components/ui.jsx";
import { MODULES } from "../data/content.js";
import { useWipe } from "../App.jsx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SPANS = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-4", "md:col-span-4"];

export default function Home() {
  const root = useRef(null);
  const navigate = useNavigate();
  const wipe = useWipe();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        root.current.querySelectorAll(".mast-row"),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.1, ease: "power3.out" }
      );
      // 封面卡片随滚动轻微视差
      gsap.utils.toArray(".cover-card").forEach((card, i) => {
        gsap.to(card, {
          y: (i % 2 ? -1 : 1) * 18,
          ease: "none",
          scrollTrigger: { trigger: root.current.querySelector(".cover-grid"), start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  const open = (m) => wipe(`/${m.id}`, m.accentWord);

  return (
    <main ref={root} className="mx-auto max-w-[1440px] px-5 md:px-10">
      {/* ── 刊头 ── */}
      <section className="flex min-h-[100dvh] flex-col justify-between pb-14 pt-28">
        <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: "var(--line)" }}>
          <span className="mast-row text-[11px] tracking-[0.35em] opacity-60">VOL.01 · 个人综合刊</span>
          <span className="mast-row hidden font-display text-[12px] italic tracking-[0.2em] opacity-60 md:inline">
            A Personal Anthology of Five Passions
          </span>
          <span className="mast-row text-[11px] tracking-[0.35em] opacity-60">季更连载</span>
        </div>

        <div className="py-10 md:py-14">
          <h1 className="font-cn-serif font-black leading-[1.02]" style={{ fontSize: "clamp(3rem, 9.5vw, 8.5rem)" }}>
            一个人的
            <span className="relative inline-block" style={{ color: "var(--accent)" }}>
              五座
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" aria-hidden="true">
                <path d="M3 9 C 60 2, 140 2, 197 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              </svg>
            </span>
            收藏馆
          </h1>
          <div className="mt-8 max-w-[54ch] text-[15px] leading-relaxed opacity-75 md:text-base">
            赛车、性能车、公路车、摄影与水族。我把喜欢的世界按卷收藏在这里，每一卷都有自己的性格，欢迎随时翻阅。
          </div>
          <div className="mt-8 flex items-center gap-3 text-[12px] tracking-[0.4em] opacity-70">
            <span style={{ color: "var(--accent)" }}>↓</span>
            <span>向 下 翻 阅 · CHOOSE AN ISSUE</span>
          </div>
        </div>
      </section>

      {/* 一条横向滚动带 */}
      <section className="mx-auto max-w-[1440px] overflow-hidden border-y py-3" style={{ borderColor: "var(--line)" }}>
        <div className="marquee-track gap-10">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 font-display text-lg italic tracking-[0.15em] opacity-70">
              <span>Racing</span><span>·</span><span>Performance</span><span>·</span><span>Cycling</span><span>·</span>
              <span>Photography</span><span>·</span><span>Aquarium</span><span>·</span>
              <span>赛道</span><span>·</span><span>性能车</span><span>·</span><span>公路车</span><span>·</span><span>摄影</span><span>·</span><span>水族</span><span>·</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 五卷封面（不对称杂志网格） ── */}
      <section className="cover-grid grid grid-cols-1 gap-6 pb-24 md:grid-cols-12">
        {MODULES.map((m, i) => (
          <article key={m.id} className={`cover-card group ${SPANS[i]}`}>
            <button onClick={() => open(m)} className="block w-full text-left" aria-label={`翻开 ${m.zh}`}>
              <GlareHover
                width="100%"
                height="auto"
                borderRadius="2px"
                background="transparent"
                glareColor={i % 2 ? "#a0743c" : "#ffffff"}
                glareOpacity={0.28}
                glareSize={320}
                className="cover-frame"
              >
                <div className="ticks relative overflow-hidden" style={{ background: "var(--paper-deep)" }}>
                  <img
                    src={m.cover}
                    alt={m.zh}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0" style={{ background: "linear-gradient(to top, rgba(12,10,7,.62), transparent 55%)" }} />
                  <div className="absolute bottom-4 left-5 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Magnet padding={40} magnetStrength={2.4}>
                      <span className="inline-block rounded-full px-5 py-2 text-[13px] tracking-[0.2em] text-white" style={{ background: "var(--accent)" }}>
                        翻开本卷
                      </span>
                    </Magnet>
                  </div>
                </div>
              </GlareHover>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-cn-serif text-2xl font-black transition-colors group-hover:text-[color:var(--accent)] md:text-3xl">
                    <span className="mr-3 font-display text-lg font-medium italic opacity-45">{m.issue}</span>
                    {m.zh}
                  </h2>
                  <p className="mt-1 text-[13px] opacity-65">{m.desc}</p>
                </div>
                <span className="mt-1 shrink-0 font-display text-sm italic tracking-[0.12em] opacity-45">{m.en}</span>
              </div>
            </button>
          </article>
        ))}
      </section>

      {/* ── 卷末 ── */}
      <footer className="flex flex-col items-start justify-between gap-6 border-t py-14 md:flex-row md:items-center" style={{ borderColor: "var(--line)" }}>
        <div>
          <p className="font-display text-xl italic">GYH's Collected Passions</p>
          <p className="mt-2 text-[13px] opacity-55">gyhcookingmenu.space · 一本持续更新的个人画册</p>
        </div>
        <p className="text-[12px] tracking-[0.25em] opacity-45">摄影作品均为本人拍摄 · 请勿商用转载</p>
      </footer>
    </main>
  );
}
