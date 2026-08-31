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
    expectRule(".home-v3__base", "background:linear-gradient(180deg,#292b30,#0c0d10 72%)");
    expectRule(
      ".home-v3__desk::after",
      "background:radial-gradient(ellipse at center,rgba(0,0,0,.44),transparent 68%)",
    );

    expectRule(".fx", "inset:0", "will-change:transform,opacity");
    expectRule(".photo-scene__smoke", "will-change:transform,opacity");
    expectRule(".fx--heat", "backdrop-filter:blur(.4px)", "opacity:.2");
    expectRule(
      ".fx--smoke-layer",
      "inset:22% -8% -8% 28%",
      "opacity:.36",
      "filter:blur(16px)",
      "background:radial-gradient(ellipse at 70% 52%,rgba(255,255,255,.74),rgba(220,230,232,.22) 42%,transparent 72%)",
    );
    expectRule(".fx--smoke-b", "transform:translate(-12%,8%) scale(.82)");
    expectRule(".fx--smoke-c", "transform:translate(8%,-10%) scale(.68)");
    expectRule(
      ".fx--flash",
      "width:4px",
      "height:4px",
      "inset:18% auto auto 23%",
      "box-shadow:0 0 22px 8px rgba(255,255,255,.62)",
    );
    expectRule(".fx--flash-b", "left:68%", "top:14%");
    expectRule(".photo-scene__flash--two", "left:68%", "top:14%");
    expectRule(
      ".fx--road-streaks",
      "background:linear-gradient(90deg,transparent 0 58%,rgba(255,255,255,.1) 76%,transparent)",
      "mix-blend-mode:screen",
    );
    expectRule(
      ".fx--paint-highlight",
      "background:linear-gradient(115deg,transparent 36%,rgba(255,255,255,.18) 48%,transparent 58%)",
    );
    expectRule(".fx--grass-near", "background-position:bottom", "background-repeat:repeat-x");
    expectRule(".fx--caustics", "opacity:.16", "mix-blend-mode:screen", "filter:blur(2px)");
    expectRule(
      ".fx--particles",
      "opacity:.22",
      "background-image:radial-gradient(circle,rgba(255,255,255,.7) 0 1px,transparent 1.5px)",
      "background-size:43px 57px",
    );
    expectRule(".fx--cloud-drift", "opacity:.16", "mix-blend-mode:screen");
    expectRule(".fx--reflection", "top:64%", "filter:blur(.6px) saturate(1.1)");
    expectRule(
      ".fx--light-trail",
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
      "@media (max-width:720px){.home-v3__device{width:125vw;left:45%;transform:translate(-50%,-50%) rotateY(-3deg) rotateX(1deg)",
    );
    expectRule(".screen-experience__wheel", "width:34%", "min-width:120px");
    expect(homeCss).toContain(".fx--smoke-layer");
    expect(homeCss).toContain(".fx--smoke-a");
    expect(homeCss).toContain(".fx--smoke-b");
    expect(homeCss).toContain(".fx--smoke-c");
    expect(homeCss).toContain(".fx--road-streaks");
    expect(homeCss).toContain(".fx--cloud-drift");
  });
});
