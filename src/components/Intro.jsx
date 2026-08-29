import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Intro({ onDone }) {
  const ref = useRef(null);
  const [gone, setGone] = useState(() => !!sessionStorage.getItem("gyh-intro"));

  useEffect(() => {
    if (gone) { onDone(); return; }
    sessionStorage.setItem("gyh-intro", "1");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setGone(true);
      onDone();
      return;
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
        onDone();
      },
    });
    tl.fromTo(
      ref.current.querySelectorAll(".intro-line"),
      { yPercent: 110 },
      { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.12, delay: 0.2 }
    )
      .to(ref.current.querySelector(".intro-rule"), { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, "-=0.4")
      .to(ref.current.querySelectorAll(".intro-line"), { yPercent: -110, duration: 0.7, ease: "power3.in", stagger: 0.08 }, "+=0.7")
      .to(ref.current.querySelector(".intro-rule"), { scaleX: 0, transformOrigin: "right", duration: 0.5 }, "<")
      .to(ref.current, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, "-=0.45");
    return () => tl.kill();
  }, []);

  if (gone) return null;
  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "#f2ede3", color: "#1a1712" }}
    >
      <div className="overflow-hidden">
        <div className="intro-line font-display text-[16vw] font-semibold leading-none tracking-[0.14em] md:text-[9rem]">
          GYH
        </div>
      </div>
      <div
        className="intro-rule my-5 h-px w-40 origin-left scale-x-0 md:w-64"
        style={{ background: "#a0743c" }}
      />
      <div className="overflow-hidden">
        <div className="intro-line text-sm tracking-[0.5em] opacity-70">一 本 个 人 典 藏 画 册</div>
      </div>
    </div>
  );
}
