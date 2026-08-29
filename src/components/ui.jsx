import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { MODULES } from "../data/content.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 滚动进入视口时上浮揭示 */
export function Reveal({ children, className = "", y = 36, delay = 0, stagger = 0 }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (reduceMotion()) return;
      const targets = stagger ? ref.current.children : [ref.current];
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        }
      );
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* 图片视差（在父容器内轻微位移） */
export function ParallaxImage({ src, alt = "", className = "", strength = 12 }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (reduceMotion()) return;
      gsap.fromTo(
        ref.current,
        { yPercent: -strength },
        {
          yPercent: strength,
          ease: "none",
          scrollTrigger: { trigger: ref.current.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: ref }
  );
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        className="h-[124%] w-full -translate-y-[12%] object-cover"
        loading="lazy"
      />
    </div>
  );
}

/* 模块页 Hero：主题大图 + 标题 */
export function ModuleHero({ image, en, zh, intro, word, children }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (reduceMotion()) return;
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(ref.current.querySelector(".hero-kicker"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7 })
        .fromTo(
          ref.current.querySelectorAll(".hero-word"),
          { autoAlpha: 0, y: 80 },
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09, ease: "power3.out" },
          "-=0.35"
        )
        .fromTo(ref.current.querySelector(".hero-intro"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, "-=0.5");
      gsap.to(ref.current.querySelector(".hero-bg img"), {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(ref.current.querySelector(".hero-bg"), {
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: ref }
  );
  return (
    <section ref={ref} className="relative flex min-h-[100dvh] items-end overflow-hidden">
      <div className="hero-bg absolute inset-0">
        <img src={image} alt="" className="h-full w-full scale-110 object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--bg) 10%, color-mix(in srgb, var(--bg) 78%, transparent) 46%, color-mix(in srgb, var(--bg) 35%, transparent) 72%, transparent 92%)" }}
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-24 pt-40 md:px-10">
        <p className="hero-kicker mb-4 text-[12px] uppercase tracking-[0.42em]" style={{ color: "var(--accent)" }}>
          {en}
        </p>
        <h1 className="font-cn-serif text-[13vw] font-black leading-[1.04] md:text-[7.5rem]">
          {zh.split("").map((c, i) => (
            <span key={i} className="hero-word inline-block">
              {c}
            </span>
          ))}
        </h1>
        <p className="hero-intro mt-6 max-w-[58ch] text-[15px] leading-relaxed opacity-85">{intro}</p>
        {children}
      </div>
      <div
        className="pointer-events-none absolute right-6 top-24 hidden select-none font-display text-[11rem] font-bold italic leading-none opacity-[0.08] md:block"
        aria-hidden="true"
      >
        {word}
      </div>
    </section>
  );
}

/* 子模块切换（GooeyNav 封装） */
export function SubTabs({ labels, active, onChange }) {
  return (
    <div className="my-10 flex justify-start">
      <GooeyNavLite labels={labels} active={active} onChange={onChange} />
    </div>
  );
}

/* 轻量子模块导航：下划线滑动指示 */
function GooeyNavLite({ labels, active, onChange }) {
  const ref = useRef(null);
  useGSAP(() => {
    const btns = ref.current?.querySelectorAll("button");
    if (!btns) return;
    gsap.to(ref.current.querySelector(".tab-indicator"), {
      x: btns[active].offsetLeft,
      width: btns[active].offsetWidth,
      duration: 0.45,
      ease: "power3.inOut",
    });
  }, [active]);
  return (
    <div ref={ref} className="relative flex gap-6 border-b pb-3" style={{ borderColor: "var(--line)" }}>
      {labels.map((l, i) => (
        <button
          key={l}
          onClick={() => onChange(i)}
          className="relative text-[15px] tracking-[0.2em] transition-opacity"
          style={{ opacity: active === i ? 1 : 0.5, color: "var(--fg)" }}
        >
          {l}
        </button>
      ))}
      <span className="tab-indicator absolute -bottom-[13px] left-0 h-[2px]" style={{ background: "var(--accent)" }} />
    </div>
  );
}

/* 小节标题 */
export function SectionTitle({ zh, en, desc }) {
  return (
    <Reveal className="mb-10 max-w-[60ch]">
      <h2 className="font-cn-serif text-4xl font-black leading-tight md:text-5xl">
        {zh}
        <span className="ml-4 font-display text-2xl font-medium italic opacity-50">{en}</span>
      </h2>
      {desc && <p className="mt-3 text-[14px] leading-relaxed opacity-70">{desc}</p>}
    </Reveal>
  );
}

/* 摄影灯箱 */
export function Lightbox({ items, index, onClose, onNav }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);
  useEffect(() => {
    if (index == null) return;
    gsap.fromTo(ref.current.querySelector("img"), { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" });
    gsap.fromTo(ref.current.querySelector(".lb-cap"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, delay: 0.1 });
  }, [index]);
  if (index == null) return null;
  const it = items[index];
  return (
    <div ref={ref} className="lightbox-backdrop fixed inset-0 z-[95] flex flex-col items-center justify-center p-6" onClick={onClose}>
      <img src={it.img} alt={it.title} className="max-h-[78vh] max-w-[92vw] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <div className="lb-cap mt-5 flex items-center gap-4 text-sm" style={{ color: "#efe9dd" }}>
        <span className="font-cn-serif text-lg">{it.title}</span>
        <span className="opacity-50">{it.cat}</span>
        <span className="opacity-40 font-display italic">
          {index + 1} / {items.length}
        </span>
      </div>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-lg transition-colors hover:bg-white/10"
        style={{ borderColor: "rgba(255,255,255,.25)", color: "#efe9dd" }}
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        aria-label="上一张"
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-lg transition-colors hover:bg-white/10"
        style={{ borderColor: "rgba(255,255,255,.25)", color: "#efe9dd" }}
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        aria-label="下一张"
      >
        ›
      </button>
    </div>
  );
}

/* 模块页页脚：卷末 + 返回目录 */
export function Colophon({ id }) {
  return (
    <footer className="mx-auto max-w-[1440px] px-5 py-20 md:px-10">
      <div className="flex flex-col items-start justify-between gap-8 border-t pt-10 md:flex-row md:items-center" style={{ borderColor: "var(--line)" }}>
        <div>
          <p className="font-cn-serif text-2xl font-bold">未完待续</p>
          <p className="mt-2 text-sm opacity-60">这本画册会持续更新，下一卷正在筹备。</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {MODULES.filter((m) => m.id !== id).map((m) => (
            <Link
              key={m.id}
              to={`/${m.id}`}
              className="rounded-full border px-4 py-2 text-sm transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--line)" }}
            >
              {m.zh} →
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export { reduceMotion };
