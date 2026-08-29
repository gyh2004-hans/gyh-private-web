import { useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ModuleHero, SubTabs, SectionTitle, Reveal, Colophon, Lightbox } from "../components/ui.jsx";
import { CAMERAS, WORKS } from "../data/content.js";

gsap.registerPlugin(useGSAP);

const CATS = ["全部", "野生动物", "演唱会", "城市", "风景", "花卉"];

const imgFlamingo = (p => p)(import.meta.env.BASE_URL + "images/photos/wildlife/flamingo.jpg");

export default function Photo() {
  const [tab, setTab] = useState(0);

  return (
    <main>
      <ModuleHero
        image={imgFlamingo}
        en="Photography · Digital & Film"
        zh="画廊"
        intro="相机是工具，照片是证据：证明我认真看过这个世界。这一卷陈列我的相机，和它们拍下的瞬间。"
        word="GALLERY"
      />

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SubTabs labels={["相机", "摄影作品"]} active={tab} onChange={setTab} />
        {tab === 0 ? <CamerasSection /> : <WorksSection />}
      </div>

      <Colophon id="photo" />
    </main>
  );
}

/* ── 相机：展签式卡片 ── */
function CamerasSection() {
  return (
    <div>
      <SectionTitle zh="尼康微单军团" en="Nikon Mirrorless" desc="从 APS-C 到集成旗舰，Z 卡口这十年的进化史。" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CAMERAS.nikon.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.05}>
            <figure className="group border bg-white p-4 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl" style={{ borderColor: "var(--line)" }}>
              <div className="overflow-hidden bg-[#efeee8]">
                <img src={c.img} alt={c.name} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              </div>
              <figcaption className="pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold">{c.name}</h3>
                  <span className="shrink-0 text-[11px] tracking-[0.15em]" style={{ color: "var(--accent)" }}>{c.role}</span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed opacity-70">{c.desc}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <div className="mt-24">
        <SectionTitle zh="胶片时光机" en="Film Cameras" desc="柯尼卡、柯达、哈苏、海鸥：银盐时代的四种性格。" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CAMERAS.film.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.04}>
              <figure className="group flex h-full flex-col border bg-white p-4 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl" style={{ borderColor: "var(--line)" }}>
                <div className="relative overflow-hidden bg-[#efeee8]">
                  <img src={c.img} alt={c.name} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  <span
                    className="absolute left-3 top-3 px-2 py-0.5 text-[11px] tracking-[0.2em] text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    {c.maker}
                  </span>
                </div>
                <figcaption className="flex grow flex-col pt-4">
                  <h3 className="font-cn-serif text-lg font-bold">{c.name}</h3>
                  <p className="mt-2 grow text-[13px] leading-relaxed opacity-70">{c.desc}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 摄影作品：分类瀑布流 + 灯箱 ── */
function WorksSection() {
  const [cat, setCat] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const gridRef = useRef(null);

  const items = useMemo(() => (cat === 0 ? WORKS : WORKS.filter((w) => w.cat === CATS[cat])), [cat]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        gridRef.current.querySelectorAll(".work-item"),
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: "power3.out" }
      );
    },
    { scope: gridRef, dependencies: [cat] }
  );

  return (
    <div>
      <SectionTitle zh="我的作品" en="Selected Works" desc="全部由本人拍摄，点击任意一张可以放大细看。" />

      <div className="mb-8 flex flex-wrap gap-3">
        {CATS.map((c, i) => (
          <button
            key={c}
            onClick={() => { setCat(i); setLightboxIdx(null); }}
            className="rounded-full border px-4 py-1.5 text-[13px] transition-all duration-300"
            style={{
              borderColor: cat === i ? "var(--accent)" : "var(--line)",
              background: cat === i ? "var(--accent)" : "transparent",
              color: cat === i ? "#fff" : "var(--fg)",
              opacity: cat === i ? 1 : 0.65,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((w, i) => (
          <button key={w.title + i} className="work-item group block w-full break-inside-avoid text-left" onClick={() => setLightboxIdx(i)}>
            <figure className="relative overflow-hidden bg-[#efeee8]">
              <img
                src={w.img}
                alt={w.title}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${w.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
              />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(to top, rgba(15,13,10,.55), transparent 50%)" }} />
              <figcaption className="absolute bottom-3 left-4 translate-y-2 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="font-cn-serif text-lg">{w.title}</span>
                <span className="ml-3 text-[12px] opacity-70">{w.cat}</span>
              </figcaption>
            </figure>
          </button>
        ))}
      </div>

      <Lightbox
        items={items}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onNav={(d) => setLightboxIdx((v) => (v + d + items.length) % items.length)}
      />
    </div>
  );
}
