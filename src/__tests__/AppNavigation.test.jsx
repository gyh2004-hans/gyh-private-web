import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import App from "../App.jsx";

const homeCss = readFileSync(resolve(process.cwd(), "src/styles/global.css"), "utf8")
  .replace(/\s+/g, " ")
  .replace(/\s*([:;,{}])\s*/g, "$1")
  .replace(/(^|[(:, ])0\.(\d+)/g, "$1.$2");

function ruleBodies(selector) {
  return [...homeCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selectors]) => selectors.split(",").includes(selector))
    .map(([, , body]) => body);
}

function expectRule(selector, ...declarations) {
  const bodies = ruleBodies(selector);
  expect(bodies, `missing CSS rule for ${selector}`).not.toHaveLength(0);
  declarations.forEach((declaration) => {
    expect(
      bodies.some((body) => body.includes(declaration)),
      `${selector} must include ${declaration}`,
    ).toBe(true);
  });
}

vi.mock("lenis", () => ({
  default: class LenisMock {
    on = vi.fn();
    raf = vi.fn();
    destroy = vi.fn();
    scrollTo = vi.fn();
  },
}));

vi.mock("../components/Intro.jsx", () => ({ default: () => null }));
vi.mock("../pages/Home.jsx", () => ({ default: () => <div>HOME SCREEN</div> }));
vi.mock("../pages/Racing.jsx", () => ({ default: () => <div>RACING PAGE</div> }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("App navigation visibility", () => {
  it("does not render the global navigation on the home screen", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("HOME SCREEN")).toBeInTheDocument();
    expect(screen.queryAllByText("封面")).toHaveLength(0);
  });

  it("renders the global navigation on a topic page", () => {
    render(
      <MemoryRouter initialEntries={["/racing"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("RACING PAGE")).toBeInTheDocument();
    expect(screen.getAllByText("封面").length).toBeGreaterThan(0);
  });

  it("redirects an unknown path to the home screen without global navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/missing"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("HOME SCREEN")).toBeInTheDocument();
      expect(screen.queryAllByText("封面")).toHaveLength(0);
    });
  });
});

describe("HOME v3 visual contract", () => {
  it("keeps the laptop geometry, effects, responsive layout and reduced motion values exact", () => {
    expectRule(".home-v3__lid", "transform-style:preserve-3d");
    expectRule(".home-v3__device", "width:min(94vw,1460px)", "top:54%");
    expectRule(".home-v3__lid", "inset:0 2% 14%");
    expectRule(
      ".home-v3__base",
      "background:linear-gradient(180deg,#3b3e44 0%,#17191d 18%,#090a0c 74%)",
    );
    expectRule(
      ".home-v3__desk::after",
      "background:radial-gradient(ellipse at center,rgba(0,0,0,.44),transparent 68%)",
    );

    expectRule(".photo-scene__layer", "z-index:2", "will-change:transform,opacity");
    expectRule(".photo-scene__heat", "backdrop-filter:blur(1.2px) saturate(1.08)", "opacity:.34");
    expectRule(
      ".photo-scene--f1 .photo-scene__layer--smoke-back",
      "opacity:.46",
      "filter:blur(5px) saturate(.72) brightness(1.08)",
    );
    expectRule(
      ".photo-scene__flash",
      "width:4px",
      "height:4px",
      "inset:18% auto auto 23%",
      "box-shadow:0 0 22px 8px rgba(255,255,255,.62)",
    );
    expectRule(".photo-scene__flash--two", "left:68%", "top:14%");
    expectRule(
      ".photo-scene__road-streak",
      "filter:blur(3.5px) saturate(.88)",
      "mask-image:linear-gradient(to bottom,transparent 0 66%,#000 80% 100%)",
    );
    expectRule(
      ".photo-scene__paint-highlight",
      "background:linear-gradient(115deg,transparent 36%,rgba(255,255,255,.18) 48%,transparent 58%)",
    );
    expectRule(".photo-scene__grass-near", "filter:blur(1.6px) saturate(1.04)");
    expectRule(".photo-scene__caustics", "opacity:.12", "mix-blend-mode:screen", "filter:blur(14px)");
    expectRule(
      ".photo-scene__particle",
      "left:var(--particle-x)",
      "top:var(--particle-y)",
    );
    expectRule(".photo-scene--photo .photo-scene__layer--clouds", "opacity:.72");
    expectRule(".photo-scene--photo .photo-scene__layer--reflection", "filter:blur(1.1px) saturate(1.18)");
    expectRule(
      ".photo-scene__light-trail",
      "top:auto",
      "bottom:7%",
      "height:3px",
      "background:linear-gradient(90deg,transparent,#f23b55,#4bcde8,transparent)",
    );
    expectRule(
      ".screen-experience__glare",
      "background:linear-gradient(112deg,rgba(255,255,255,.08),transparent 38%)",
    );
    expectRule(
      ".screen-experience__wheel .option-wheel",
      "--ow-text-color:rgba(255,255,255,.24)",
      "--ow-active-color:#fff",
    );

    expect(homeCss).toContain(
      "@media (max-width:720px){.home-v3__device{width:max(125vw,105vh);left:45%;transform:translate(-50%,-50%) rotateY(-3deg) rotateX(1deg)",
    );
    expectRule(".screen-experience__wheel", "inset:0", "width:auto");
    expectRule(".screen-experience__wheel", "width:100vw", "min-width:0");
    expectRule(".screen-experience__wheel::after", "width:34%", "min-width:120px");
    expect(homeCss).not.toContain("repeating-radial-gradient(ellipse");
    expect(homeCss).not.toContain("repeating-linear-gradient(97deg");
  });
});
