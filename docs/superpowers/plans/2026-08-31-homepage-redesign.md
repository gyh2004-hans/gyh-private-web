# GYH Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing procedural homepage with a self-contained, photo-driven, perspective-correct laptop experience controlled by React Bits OptionWheel and entered through React Bits SpecularButton.

**Architecture:** Keep `Home` as the orchestration boundary, move device geometry into `LaptopStage`, continuous theme rendering into `ScreenExperience`, and photo-specific motion into focused scene components. React state stores only the snapped theme index; continuous wheel position, GSAP transforms, and per-scene animation state live in refs and a shared ticker.

**Tech Stack:** Vite, React 18, React Router, Tailwind CSS v4, GSAP 3, `@gsap/react`, React Bits JS-CSS components, OGL, Vitest, Testing Library, Sharp.

---

## File map

### Create

- `src/assets/home/original/{f1,m4,colnago,fish,photo}.jpg` — project-owned copies of the five supplied photos.
- `src/assets/home/derived/` — accepted super-resolution masters and responsive WebP outputs.
- `scripts/process-home-assets.mjs` — deterministic responsive-image generation from accepted masters.
- `src/test/setup.js` — DOM test setup.
- `src/components/home/homeThemes.js` — routes, labels, matte colors, focal points, and responsive image imports.
- `src/components/home/motionMath.js` — pure interpolation and pointer-to-tilt helpers.
- `src/components/home/LaptopStage.jsx` — desk, hardware, shared 3D transform, contact shadow.
- `src/components/home/ScreenExperience.jsx` — screen strip, giant words, GYH, wheel, CTA, background interpolation.
- `src/components/home/PhotoMotionScene.jsx` — shared scene shell and activity gating.
- `src/components/home/scenes/{F1,M4,Colnago,Fish,Photo}PhotoScene.jsx` — theme-specific photo motion.
- `src/components/reactbits/OptionWheel/{OptionWheel.jsx,OptionWheel.css}` — official React Bits source plus one documented progress callback.
- `src/components/reactbits/SpecularButton/{SpecularButton.jsx,SpecularButton.css}` — unmodified official React Bits source.
- `src/components/home/__tests__/homeThemes.test.js`
- `src/components/home/__tests__/motionMath.test.js`
- `src/components/home/__tests__/OptionWheel.test.jsx`
- `src/pages/__tests__/Home.test.jsx`
- `src/__tests__/AppNavigation.test.jsx`

### Modify

- `package.json` and `package-lock.json` — OGL, Sharp, Vitest, jsdom, and Testing Library.
- `vite.config.js` — Vitest configuration.
- `src/pages/Home.jsx:1-330` — replace the old wheel/canvas implementation with the new orchestration layer.
- `src/App.jsx:89-101` — hide the global `Nav` on `/` while preserving it on topic pages.
- `src/styles/global.css` — replace the old `HOME v2` block with the new HOME v3 device, scene, responsive, and reduced-motion styles.

### Remove after replacement is verified

- `src/components/home/SceneCanvas.jsx`
- `src/components/home/ThemeWheel.jsx`
- `src/components/home/themeMeta.js`
- `src/components/home/scenes/{f1Scene,carsScene,bikeScene,fishScene,photoScene}.js`

---

### Task 1: Add the test and image-processing toolchain

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`

- [ ] **Step 1: Install runtime and development dependencies**

Run:

```bash
npm install ogl
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event sharp
```

Expected: both commands exit `0`; `package.json` lists `ogl` under `dependencies` and the test/image packages under `devDependencies`.

- [ ] **Step 2: Add deterministic test scripts**

Update the `scripts` block in `package.json` to:

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Configure Vitest**

Update `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
```

Create `src/test/setup.js`:

```js
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

globalThis.requestAnimationFrame = (callback) => setTimeout(() => callback(performance.now()), 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

globalThis.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: query.includes("prefers-reduced-motion") ? false : false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
```

- [ ] **Step 4: Run the empty test suite and build baseline**

Run:

```bash
npm test -- --passWithNoTests
npm run build
```

Expected: Vitest exits `0` with no test failures; Vite build exits `0` before homepage changes.

- [ ] **Step 5: Commit the toolchain**

```bash
git add package.json package-lock.json vite.config.js src/test/setup.js
git commit -m "test: 建立主页重设计测试基线"
```

---

### Task 2: Ingest, super-resolve, and derive self-contained assets

**Files:**
- Create: `src/assets/home/original/*.jpg`
- Create: `src/assets/home/derived/*`
- Create: `scripts/process-home-assets.mjs`

- [ ] **Step 1: Copy the five supplied originals into the repository**

Use explicit source-to-target copies; do not move or delete the desktop files:

```powershell
New-Item -ItemType Directory -Force -Path 'src/assets/home/original','src/assets/home/derived'
Copy-Item -LiteralPath 'C:\Users\24939\Desktop\1111\d83f4bb681e32334d882f9184effc729.jpg' -Destination 'src/assets/home/original/f1.jpg'
Copy-Item -LiteralPath 'C:\Users\24939\Desktop\1111\bdc1354781efd7646f5522d5317e180d.jpg' -Destination 'src/assets/home/original/m4.jpg'
Copy-Item -LiteralPath 'C:\Users\24939\Desktop\1111\b26a33c6743bfc579c103c2ab41d2756.jpg' -Destination 'src/assets/home/original/colnago.jpg'
Copy-Item -LiteralPath 'C:\Users\24939\Desktop\1111\ab691baef3ef1ac426eaa7fd2382b25b.jpg' -Destination 'src/assets/home/original/fish.jpg'
Copy-Item -LiteralPath 'C:\Users\24939\Desktop\1111\adbd8cfc420affebc8d38fb328312787.jpg' -Destination 'src/assets/home/original/photo.jpg'
```

Expected: five semantic files exist under `src/assets/home/original/`; no application source contains `C:\Users\24939`.

- [ ] **Step 2: Create 2× fidelity-preserving masters for F1 and COLNAGO**

Before editing, invoke the `imagegen` skill and inspect both originals. Run one edit per source with this exact intent:

```text
Upscale this supplied photograph to approximately 2× linear resolution. Preserve the exact composition, crop, vehicle and bicycle geometry, rider anatomy, sponsor marks, logos, text, wheel spokes, smoke boundaries, lighting direction, and photographic grain. Do not invent objects, change brands, replace faces, stylize, repaint, or alter colors. Remove only compression artifacts and recover plausible fine detail. The result must remain the same photograph.
```

Save accepted outputs as:

```text
src/assets/home/derived/f1-master.png
src/assets/home/derived/colnago-master.png
```

Reject and regenerate any output that changes visible branding, vehicle geometry, the rider, track markings, wheel structure, or crop.

- [ ] **Step 3: Create the responsive derivative script**

Create `scripts/process-home-assets.mjs`:

```js
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const original = path.join(root, "src/assets/home/original");
const derived = path.join(root, "src/assets/home/derived");

const sources = [
  ["f1", path.join(derived, "f1-master.png")],
  ["m4", path.join(original, "m4.jpg")],
  ["colnago", path.join(derived, "colnago-master.png")],
  ["fish", path.join(original, "fish.jpg")],
  ["photo", path.join(original, "photo.jpg")],
];

await mkdir(derived, { recursive: true });

for (const [name, input] of sources) {
  for (const width of [960, 1600, 2560]) {
    await sharp(input)
      .resize({ width, withoutEnlargement: false, fit: "inside" })
      .webp({ quality: width === 2560 ? 88 : 82, smartSubsample: true })
      .toFile(path.join(derived, `${name}-${width}.webp`));
  }
}
```

- [ ] **Step 4: Generate derivatives and verify dimensions**

Run:

```bash
node scripts/process-home-assets.mjs
```

Then run this PowerShell verification:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem 'src/assets/home/derived' -File | ForEach-Object {
  $img=[System.Drawing.Image]::FromFile($_.FullName)
  [pscustomobject]@{Name=$_.Name;Width=$img.Width;Height=$img.Height;Bytes=$_.Length}
  $img.Dispose()
}
```

Expected: each theme has `960`, `1600`, and `2560` WebP variants; F1 and COLNAGO masters are near 2× their source dimensions.

- [ ] **Step 5: Perform 200% fidelity review**

Open original and master side by side. Inspect: F1 car logos, front wing, wheels, smoke edge and track text; COLNAGO frame lettering, wheel edge, rider body, helmet, grass and mountain skyline. Accept only when geometry and text remain faithful.

- [ ] **Step 6: Commit self-contained assets and processing script**

```bash
git add src/assets/home scripts/process-home-assets.mjs
git commit -m "feat: 导入并优化主页照片资产"
```

---

### Task 3: Define theme metadata and pure motion math

**Files:**
- Create: `src/components/home/homeThemes.js`
- Create: `src/components/home/motionMath.js`
- Create: `src/components/home/__tests__/homeThemes.test.js`
- Create: `src/components/home/__tests__/motionMath.test.js`

- [ ] **Step 1: Write failing metadata tests**

Create `src/components/home/__tests__/homeThemes.test.js`:

```js
import { describe, expect, it } from "vitest";
import { HOME_THEMES } from "../homeThemes.js";

describe("HOME_THEMES", () => {
  it("uses the approved order, words, and routes", () => {
    expect(HOME_THEMES.map(({ word }) => word)).toEqual(["F1", "M4", "COLNAGO", "FISH", "PHOTO"]);
    expect(HOME_THEMES.map(({ route }) => route)).toEqual(["/racing", "/cars", "/bikes", "/aqua", "/photo"]);
  });

  it("contains only bundled asset URLs and three responsive widths", () => {
    for (const theme of HOME_THEMES) {
      expect(theme.sources).toHaveLength(3);
      expect(theme.sources.map(({ width }) => width)).toEqual([960, 1600, 2560]);
      expect(theme.sources.every(({ src }) => !src.includes("C:\\") && !src.includes("/Users/"))).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Write failing motion-math tests**

Create `src/components/home/__tests__/motionMath.test.js`:

```js
import { describe, expect, it } from "vitest";
import { clamp, mixRgb, pointerTilt, splitPosition } from "../motionMath.js";

describe("motion math", () => {
  it("clamps and splits continuous theme position", () => {
    expect(clamp(8, 0, 4)).toBe(4);
    expect(splitPosition(2.25, 5)).toEqual({ from: 2, to: 3, progress: 0.25 });
    expect(splitPosition(4, 5)).toEqual({ from: 4, to: 4, progress: 0 });
  });

  it("keeps pointer parallax inside 1.5 degrees", () => {
    expect(pointerTilt(0, 0)).toEqual({ x: 1.5, y: -1.5 });
    expect(pointerTilt(1, 1)).toEqual({ x: -1.5, y: 1.5 });
    expect(pointerTilt(0.5, 0.5)).toEqual({ x: 0, y: 0 });
  });

  it("interpolates matte colors", () => {
    expect(mixRgb([0, 10, 20], [100, 110, 120], 0.5)).toBe("rgb(50 60 70)");
  });
});
```

- [ ] **Step 3: Run tests and verify failure**

Run:

```bash
npm test -- src/components/home/__tests__/homeThemes.test.js src/components/home/__tests__/motionMath.test.js
```

Expected: FAIL because both modules do not exist.

- [ ] **Step 4: Implement the pure math module**

Create `src/components/home/motionMath.js`:

```js
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function splitPosition(position, count) {
  const safe = clamp(position, 0, Math.max(0, count - 1));
  const from = Math.floor(safe);
  const to = Math.min(count - 1, from + 1);
  return { from, to, progress: to === from ? 0 : safe - from };
}

export function pointerTilt(nx, ny, limit = 1.5) {
  return {
    x: Number(((0.5 - clamp(ny, 0, 1)) * limit * 2).toFixed(3)),
    y: Number(((clamp(nx, 0, 1) - 0.5) * limit * 2).toFixed(3)),
  };
}

export function mixRgb(a, b, t) {
  const p = clamp(t, 0, 1);
  const values = a.map((value, index) => Math.round(value + (b[index] - value) * p));
  return `rgb(${values.join(" ")})`;
}
```

- [ ] **Step 5: Implement complete theme metadata**

Create `src/components/home/homeThemes.js` with imports for all 15 WebP variants and this data shape:

```js
import f1_960 from "../../assets/home/derived/f1-960.webp";
import f1_1600 from "../../assets/home/derived/f1-1600.webp";
import f1_2560 from "../../assets/home/derived/f1-2560.webp";
import m4_960 from "../../assets/home/derived/m4-960.webp";
import m4_1600 from "../../assets/home/derived/m4-1600.webp";
import m4_2560 from "../../assets/home/derived/m4-2560.webp";
import colnago_960 from "../../assets/home/derived/colnago-960.webp";
import colnago_1600 from "../../assets/home/derived/colnago-1600.webp";
import colnago_2560 from "../../assets/home/derived/colnago-2560.webp";
import fish_960 from "../../assets/home/derived/fish-960.webp";
import fish_1600 from "../../assets/home/derived/fish-1600.webp";
import fish_2560 from "../../assets/home/derived/fish-2560.webp";
import photo_960 from "../../assets/home/derived/photo-960.webp";
import photo_1600 from "../../assets/home/derived/photo-1600.webp";
import photo_2560 from "../../assets/home/derived/photo-2560.webp";

const sources = (small, medium, large) => [
  { src: small, width: 960 },
  { src: medium, width: 1600 },
  { src: large, width: 2560 },
];

export const HOME_THEMES = [
  { id: "racing", word: "F1", route: "/racing", matte: [24, 54, 56], focus: "50% 52%", effect: "f1", sources: sources(f1_960, f1_1600, f1_2560) },
  { id: "cars", word: "M4", route: "/cars", matte: [141, 116, 31], focus: "50% 49%", effect: "m4", sources: sources(m4_960, m4_1600, m4_2560) },
  { id: "bikes", word: "COLNAGO", route: "/bikes", matte: [182, 190, 190], focus: "43% 55%", effect: "colnago", sources: sources(colnago_960, colnago_1600, colnago_2560) },
  { id: "aqua", word: "FISH", route: "/aqua", matte: [16, 45, 42], focus: "50% 54%", effect: "fish", sources: sources(fish_960, fish_1600, fish_2560) },
  { id: "photo", word: "PHOTO", route: "/photo", matte: [17, 56, 88], focus: "54% 48%", effect: "photo", sources: sources(photo_960, photo_1600, photo_2560) },
];
```

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm test -- src/components/home/__tests__/homeThemes.test.js src/components/home/__tests__/motionMath.test.js
```

Expected: both files PASS.

```bash
git add src/components/home/homeThemes.js src/components/home/motionMath.js src/components/home/__tests__
git commit -m "feat: 定义主页主题与运动模型"
```

---

### Task 4: Fetch and extend the official React Bits components

**Files:**
- Create: `src/components/reactbits/OptionWheel/OptionWheel.jsx`
- Create: `src/components/reactbits/OptionWheel/OptionWheel.css`
- Create: `src/components/reactbits/SpecularButton/SpecularButton.jsx`
- Create: `src/components/reactbits/SpecularButton/SpecularButton.css`
- Create: `src/components/home/__tests__/OptionWheel.test.jsx`

- [ ] **Step 1: Fetch current official JS-CSS sources**

Invoke the `react-bits` skill. Run its registry helper from the installed skill location:

```powershell
node 'C:\Users\24939\.agents\skills\react-bits\scripts\rb-add.mjs' OptionWheel --variant JS-CSS --dest src/components/reactbits/OptionWheel
node 'C:\Users\24939\.agents\skills\react-bits\scripts\rb-add.mjs' SpecularButton --variant JS-CSS --dest src/components/reactbits/SpecularButton
```

Expected: the command writes the current registry source and prints `npm install ogl`; do not substitute remembered component code.
Read both fetched component signatures before editing.

- [ ] **Step 2: Write the failing continuous-position test**

Create `src/components/home/__tests__/OptionWheel.test.jsx`:

```jsx
import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import OptionWheel from "../../reactbits/OptionWheel/OptionWheel.jsx";

describe("OptionWheel progress bridge", () => {
  it("reports a continuous position while preserving snapped onChange", async () => {
    const onPositionChange = vi.fn();
    const onChange = vi.fn();
    const { getByRole } = render(
      <OptionWheel
        items={["F1", "M4", "COLNAGO", "FISH", "PHOTO"]}
        defaultSelected={0}
        onPositionChange={onPositionChange}
        onChange={onChange}
        side="right"
      />
    );
    fireEvent.wheel(getByRole("listbox"), { deltaY: 60, deltaMode: 0 });
    await waitFor(() => expect(onPositionChange).toHaveBeenCalled());
  });
});
```

- [ ] **Step 3: Run the test and verify failure**

Run:

```bash
npm test -- src/components/home/__tests__/OptionWheel.test.jsx
```

Expected: FAIL because official `OptionWheel` does not call `onPositionChange`.

- [ ] **Step 4: Add the minimal progress callback**

In the fetched `OptionWheel.jsx`, add `onPositionChange` immediately after the existing `onChange` prop in the destructured signature:

```js
onChange,
onPositionChange,
textColor = "#a6a6a6",
```

Immediately after the official `const onChangeRef = useRef(onChange);`, insert:

```js
const onPositionChangeRef = useRef(onPositionChange);
```

Immediately after the official `onChangeRef.current = onChange;`, insert:

```js
onPositionChangeRef.current = onPositionChange;
```

Inside the official `runFrame`, immediately after `posRef.current = next`:

```js
onPositionChangeRef.current?.(next);
```

Keep the official wheel, drag, click, keyboard, loop, audio, ARIA, and cleanup code otherwise unchanged. Do not convert the component to a new controlled model.

- [ ] **Step 5: Run the component test and commit**

Run:

```bash
npm test -- src/components/home/__tests__/OptionWheel.test.jsx
```

Expected: PASS.

```bash
git add src/components/reactbits src/components/home/__tests__/OptionWheel.test.jsx
git commit -m "feat: 接入主页 React Bits 控件"
```

---

### Task 5: Build the perspective-correct laptop stage

**Files:**
- Create: `src/components/home/LaptopStage.jsx`
- Create: `src/components/home/ScreenExperience.jsx`
- Create: `src/pages/__tests__/Home.test.jsx`

- [ ] **Step 1: Write the first integration test**

Create `src/pages/__tests__/Home.test.jsx`:

```jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

const { wipeMock } = vi.hoisted(() => ({ wipeMock: vi.fn() }));
vi.mock("../../App.jsx", () => ({ useWipe: () => wipeMock }));
vi.mock("../../components/reactbits/SpecularButton/SpecularButton.jsx", () => ({
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

import Home from "../Home.jsx";

describe("Home", () => {
  it("renders the approved screen hierarchy", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText("GYH")).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: /option wheel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ENTER F1" })).toBeInTheDocument();
    expect(screen.queryByText("MENU")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
npm test -- src/pages/__tests__/Home.test.jsx
```

Expected: FAIL because the old home has neither OptionWheel nor the approved CTA.

- [ ] **Step 3: Implement `LaptopStage`**

Create `src/components/home/LaptopStage.jsx`:

```jsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { pointerTilt } from "./motionMath.js";

gsap.registerPlugin(useGSAP);

export default function LaptopStage({ background, children, rootRef }) {
  const internalStageRef = useRef(null);
  const stageRef = rootRef ?? internalStageRef;
  const deviceRef = useRef(null);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const xTo = gsap.quickTo(deviceRef.current, "--pointer-rx", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(deviceRef.current, "--pointer-ry", { duration: 0.55, ease: "power3.out" });
    const onPointerMove = (event) => {
      const rect = stageRef.current.getBoundingClientRect();
      const tilt = pointerTilt((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
      xTo(`${tilt.x}deg`);
      yTo(`${tilt.y}deg`);
    };
    const onPointerLeave = () => { xTo("0deg"); yTo("0deg"); };
    const stage = stageRef.current;
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);
    return () => {
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
    };
  }, { scope: stageRef });

  return (
    <main ref={stageRef} className="home-v3" data-lenis-prevent style={{ "--home-matte": background }}>
      <div className="home-v3__grain" aria-hidden="true" />
      <div className="home-v3__desk" aria-hidden="true" />
      <div ref={deviceRef} className="home-v3__device">
        <div className="home-v3__lid"><div className="home-v3__screen">{children}</div></div>
        <div className="home-v3__base" aria-hidden="true" />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Create the initial screen hierarchy**

Create `src/components/home/ScreenExperience.jsx` with these stable elements:

```jsx
import OptionWheel from "../reactbits/OptionWheel/OptionWheel.jsx";
import SpecularButton from "../reactbits/SpecularButton/SpecularButton.jsx";

export default function ScreenExperience({ themes, active, onActiveChange, onPositionChange, onEnter }) {
  return (
    <div className="screen-experience">
      <div className="screen-experience__word" aria-hidden="true">{themes[active].word}</div>
      <div className="screen-experience__scenes" data-testid="photo-scenes" />
      <div className="screen-experience__brand">GYH</div>
      <div className="screen-experience__wheel">
        <OptionWheel
          items={themes.map(({ word }) => word)}
          defaultSelected={0}
          side="right"
          fontSize={1.45}
          spacing={1.45}
          curve={0.82}
          tilt={7}
          blur={1.5}
          fade={0.28}
          inset={20}
          onChange={onActiveChange}
          onPositionChange={onPositionChange}
        />
      </div>
      <div className="screen-experience__cta">
        <SpecularButton autoAnimate intensity={0.72} size="sm" radius={22} blur={10} tintOpacity={0.08} onClick={onEnter}>
          {`ENTER ${themes[active].word}`}
        </SpecularButton>
      </div>
      <div className="screen-experience__glare" aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 5: Temporarily wire the hierarchy into `Home` and run the test**

Replace `Home.jsx` with this complete structural version. Scene rendering is completed in Task 7:

```jsx
import { useRef, useState } from "react";
import LaptopStage from "../components/home/LaptopStage.jsx";
import ScreenExperience from "../components/home/ScreenExperience.jsx";
import { HOME_THEMES } from "../components/home/homeThemes.js";
import { useWipe } from "../App.jsx";

export default function Home() {
  const [active, setActive] = useState(0);
  const positionRef = useRef(0);
  const stageRef = useRef(null);
  const wipe = useWipe();

  const handlePositionChange = (position) => {
    positionRef.current = position;
  };

  const handleEnter = () => {
    const theme = HOME_THEMES[active];
    wipe(theme.route, theme.word);
  };

  return (
    <LaptopStage rootRef={stageRef} background="rgb(24 54 56)">
      <ScreenExperience
        themes={HOME_THEMES}
        active={active}
        onActiveChange={setActive}
        onPositionChange={handlePositionChange}
        onEnter={handleEnter}
      />
    </LaptopStage>
  );
}
```

Run:

```bash
npm test -- src/pages/__tests__/Home.test.jsx
```

Expected: PASS.

- [ ] **Step 6: Commit the structural stage**

```bash
git add src/components/home/LaptopStage.jsx src/components/home/ScreenExperience.jsx src/pages/Home.jsx src/pages/__tests__/Home.test.jsx
git commit -m "feat: 建立主页三维笔记本舞台"
```

---

### Task 6: Implement the five photo-motion scenes

**Files:**
- Create: `src/components/home/PhotoMotionScene.jsx`
- Create: `src/components/home/scenes/F1PhotoScene.jsx`
- Create: `src/components/home/scenes/M4PhotoScene.jsx`
- Create: `src/components/home/scenes/ColnagoPhotoScene.jsx`
- Create: `src/components/home/scenes/FishPhotoScene.jsx`
- Create: `src/components/home/scenes/PhotoPhotoScene.jsx`
- Modify: `src/pages/__tests__/Home.test.jsx`

- [ ] **Step 1: Extend the failing integration test for all themes**

Add to `Home.test.jsx`:

```jsx
it("mounts one labeled photo scene per approved theme", () => {
  render(<MemoryRouter><Home /></MemoryRouter>);
  for (const label of ["F1 scene", "M4 scene", "COLNAGO scene", "FISH scene", "PHOTO scene"]) {
    expect(screen.getByLabelText(label)).toBeInTheDocument();
  }
});
```

Run `npm test -- src/pages/__tests__/Home.test.jsx` and expect FAIL because the scene shell is empty.

- [ ] **Step 2: Implement the shared responsive photo shell**

Create `PhotoMotionScene.jsx`:

```jsx
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function usePhotoSceneMotion(sceneRef, active, setup) {
  useGSAP(() => {
    if (!active) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", setup);
    return () => mm.revert();
  }, { scope: sceneRef, dependencies: [active], revertOnUpdate: true });
}

export default function PhotoMotionScene({ theme, active, progress, className = "", sceneRef, children }) {
  const srcSet = theme.sources.map(({ src, width }) => `${src} ${width}w`).join(", ");
  return (
    <section
      ref={sceneRef}
      className={`photo-scene photo-scene--${theme.effect} ${className}`}
      aria-label={`${theme.word} scene`}
      data-active={active ? "true" : "false"}
      style={{ "--scene-progress": progress, "--scene-focus": theme.focus }}
    >
      <img
        className="photo-scene__image"
        src={theme.sources[1].src}
        srcSet={srcSet}
        sizes="(max-width: 720px) 100vw, 90vw"
        alt=""
        draggable="false"
      />
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Implement each theme as a focused layer set**

Create the five files below. Each file contains no route or wheel logic and stops creating animations when `active` is false.

```jsx
// F1PhotoScene.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import PhotoMotionScene, { usePhotoSceneMotion } from "../PhotoMotionScene.jsx";

export default function F1PhotoScene(props) {
  const sceneRef = useRef(null);
  usePhotoSceneMotion(sceneRef, props.active, () => {
    gsap.to(sceneRef.current.querySelectorAll(".fx--smoke-layer"), { xPercent: 8, scale: 1.08, opacity: 0.48, duration: 6, stagger: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(sceneRef.current.querySelector(".fx--heat"), { x: 1.5, duration: 0.12, repeat: -1, yoyo: true, ease: "none" });
    gsap.to(sceneRef.current.querySelectorAll(".fx--flash"), { autoAlpha: 0.7, duration: 0.08, stagger: 2.7, repeat: -1, repeatDelay: 3.4, yoyo: true });
  });
  return <PhotoMotionScene {...props} sceneRef={sceneRef} className="f1-photo-scene"><div className="fx fx--heat" aria-hidden="true" /><div className="fx fx--smoke-layer fx--smoke-a" aria-hidden="true" /><div className="fx fx--smoke-layer fx--smoke-b" aria-hidden="true" /><div className="fx fx--smoke-layer fx--smoke-c" aria-hidden="true" /><div className="fx fx--flash fx--flash-a" aria-hidden="true" /><div className="fx fx--flash fx--flash-b" aria-hidden="true" /></PhotoMotionScene>;
}

// M4PhotoScene.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import PhotoMotionScene, { usePhotoSceneMotion } from "../PhotoMotionScene.jsx";

export default function M4PhotoScene(props) {
  const sceneRef = useRef(null);
  usePhotoSceneMotion(sceneRef, props.active, () => {
    gsap.to(sceneRef.current.querySelector(".photo-scene__image"), { rotation: 0.35, transformOrigin: "50% 75%", duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(sceneRef.current.querySelector(".fx--road-streaks"), { xPercent: 18, duration: 1.2, repeat: -1, yoyo: true, ease: "none" });
    gsap.to(sceneRef.current.querySelector(".fx--paint-highlight"), { xPercent: 45, duration: 4.5, repeat: -1, repeatDelay: 1.8, ease: "power2.inOut" });
  });
  return <PhotoMotionScene {...props} sceneRef={sceneRef} className="m4-photo-scene"><div className="fx fx--road-streaks" aria-hidden="true" /><div className="fx fx--paint-highlight" aria-hidden="true" /></PhotoMotionScene>;
}

// ColnagoPhotoScene.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import PhotoMotionScene, { usePhotoSceneMotion } from "../PhotoMotionScene.jsx";

export default function ColnagoPhotoScene(props) {
  const sceneRef = useRef(null);
  usePhotoSceneMotion(sceneRef, props.active, () => {
    gsap.to(sceneRef.current.querySelector(".fx--grass-near"), { xPercent: -16, duration: 1.4, repeat: -1, yoyo: true, ease: "none" });
    gsap.to(sceneRef.current.querySelector(".fx--grass-mid"), { xPercent: -6, duration: 2.8, repeat: -1, yoyo: true, ease: "none" });
    gsap.to(sceneRef.current.querySelector(".photo-scene__image"), { y: 1, duration: 0.11, repeat: -1, yoyo: true, ease: "none" });
  });
  return <PhotoMotionScene {...props} sceneRef={sceneRef} className="colnago-photo-scene"><div className="fx fx--grass-mid" aria-hidden="true" /><div className="fx fx--grass-near" aria-hidden="true" /></PhotoMotionScene>;
}

// FishPhotoScene.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import PhotoMotionScene, { usePhotoSceneMotion } from "../PhotoMotionScene.jsx";

export default function FishPhotoScene(props) {
  const sceneRef = useRef(null);
  usePhotoSceneMotion(sceneRef, props.active, () => {
    gsap.to(sceneRef.current.querySelector(".fx--caustics"), { xPercent: 8, yPercent: 3, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(sceneRef.current.querySelector(".fx--particles"), { yPercent: -8, duration: 9, repeat: -1, ease: "none" });
  });
  return <PhotoMotionScene {...props} sceneRef={sceneRef} className="fish-photo-scene"><div className="fx fx--particles" aria-hidden="true" /><div className="fx fx--caustics" aria-hidden="true" /></PhotoMotionScene>;
}

// PhotoPhotoScene.jsx
import { useRef } from "react";
import { gsap } from "gsap";
import PhotoMotionScene, { usePhotoSceneMotion } from "../PhotoMotionScene.jsx";

export default function PhotoPhotoScene(props) {
  const sceneRef = useRef(null);
  usePhotoSceneMotion(sceneRef, props.active, () => {
    gsap.to(sceneRef.current.querySelector(".fx--cloud-drift"), { xPercent: 12, duration: 32, repeat: -1, yoyo: true, ease: "none" });
    gsap.to(sceneRef.current.querySelector(".fx--reflection"), { scaleY: 1.04, opacity: 0.32, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.fromTo(sceneRef.current.querySelector(".fx--light-trail"), { scaleX: 0.15 }, { scaleX: 1, transformOrigin: "left", duration: 12, repeat: -1, ease: "none" });
  });
  return <PhotoMotionScene {...props} sceneRef={sceneRef} className="city-photo-scene"><div className="fx fx--cloud-drift" aria-hidden="true" /><div className="fx fx--reflection" aria-hidden="true" /><div className="fx fx--light-trail" aria-hidden="true" /></PhotoMotionScene>;
}
```

Keep each component in its named file. `useGSAP` and `gsap.matchMedia()` provide cleanup when a scene becomes inactive or unmounts.

- [ ] **Step 4: Add physically bounded animation rules**

Implement scene CSS/GSAP with these maximums:

- F1 car vibration: `translate <= 1.5px`; smoke opacity `<= 0.55`; flashes random interval `2.5–7s`.
- M4 body roll: `rotateZ <= 0.45deg`; road streak translation uses transforms only.
- COLNAGO rider vibration: `translate <= 1px`; foreground parallax faster than midground; mountain remains fixed.
- FISH caustics opacity `<= 0.18`; plant/fish displacement remains within `8px`.
- PHOTO cloud drift duration `>= 28s`; tower light pulse and reflection distortion remain asynchronous.

Use `gsap.matchMedia()` to skip continuous effects under `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Run integration test and commit**

Run:

```bash
npm test -- src/pages/__tests__/Home.test.jsx
```

Expected: all Home tests PASS.

```bash
git add src/components/home/PhotoMotionScene.jsx src/components/home/scenes src/pages/__tests__/Home.test.jsx
git commit -m "feat: 添加五组真实照片动态场景"
```

---

### Task 7: Synchronize wheel position, scenes, giant words, and matte background

**Files:**
- Modify: `src/components/home/ScreenExperience.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/pages/__tests__/Home.test.jsx`

- [ ] **Step 1: Add a failing theme-entry test**

Add to `Home.test.jsx`:

```jsx
it("uses the Specular Button as the only entry action", () => {
  wipeMock.mockClear();
  render(<MemoryRouter><Home /></MemoryRouter>);
  const button = screen.getByRole("button", { name: "ENTER F1" });
  button.click();
  expect(wipeMock).toHaveBeenCalledWith("/racing", "F1");
});
```

Run the test and expect FAIL until entry wiring is complete.

- [ ] **Step 2: Make continuous wheel position the single progress source**

Replace `Home.jsx` with the final orchestration code:

```jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import LaptopStage from "../components/home/LaptopStage.jsx";
import ScreenExperience from "../components/home/ScreenExperience.jsx";
import { HOME_THEMES } from "../components/home/homeThemes.js";
import { mixRgb, splitPosition } from "../components/home/motionMath.js";
import { useWipe } from "../App.jsx";

export default function Home() {
  const [active, setActive] = useState(0);
  const positionRef = useRef(0);
  const stageRef = useRef(null);
  const wipe = useWipe();

  const handleEnter = useCallback(() => {
    const theme = HOME_THEMES[active];
    wipe(theme.route, theme.word);
  }, [active, wipe]);

  useEffect(() => {
    const tick = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const position = positionRef.current;
      const { from, to, progress } = splitPosition(position, HOME_THEMES.length);
      stage.style.setProperty("--theme-position", String(position));
      stage.style.setProperty("--theme-progress", String(progress));
      stage.style.setProperty("--home-matte", mixRgb(HOME_THEMES[from].matte, HOME_THEMES[to].matte, progress));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const editable = target instanceof Element && target.closest("input, textarea, [contenteditable='true']");
      if (event.key === "Enter" && !editable) {
        event.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleEnter]);

  return (
    <LaptopStage rootRef={stageRef} background="rgb(24 54 56)">
      <ScreenExperience
        themes={HOME_THEMES}
        active={active}
        onActiveChange={setActive}
        onPositionChange={(position) => { positionRef.current = position; }}
        onEnter={handleEnter}
      />
    </LaptopStage>
  );
}
```

- [ ] **Step 3: Render all five scenes and words as one vertical strip**

Replace `ScreenExperience.jsx` with:

```jsx
import OptionWheel from "../reactbits/OptionWheel/OptionWheel.jsx";
import SpecularButton from "../reactbits/SpecularButton/SpecularButton.jsx";
import F1PhotoScene from "./scenes/F1PhotoScene.jsx";
import M4PhotoScene from "./scenes/M4PhotoScene.jsx";
import ColnagoPhotoScene from "./scenes/ColnagoPhotoScene.jsx";
import FishPhotoScene from "./scenes/FishPhotoScene.jsx";
import PhotoPhotoScene from "./scenes/PhotoPhotoScene.jsx";

const SCENES = [F1PhotoScene, M4PhotoScene, ColnagoPhotoScene, FishPhotoScene, PhotoPhotoScene];

export default function ScreenExperience({ themes, active, onActiveChange, onPositionChange, onEnter }) {
  return (
    <div className="screen-experience">
      <div className="screen-experience__words" aria-hidden="true">
        {themes.map((theme) => <div className="screen-experience__word-slot" key={theme.id}>{theme.word}</div>)}
      </div>
      <div className="screen-experience__scenes">
        {themes.map((theme, index) => {
          const Scene = SCENES[index];
          return (
            <div className="screen-experience__scene-slot" key={theme.id}>
              <Scene theme={theme} active={Math.abs(index - active) <= 1} progress={index - active} />
            </div>
          );
        })}
      </div>
      <div className="screen-experience__brand">GYH</div>
      <div className="screen-experience__wheel">
        <OptionWheel
          items={themes.map(({ word }) => word)}
          defaultSelected={0}
          side="right"
          fontSize={1.45}
          spacing={1.45}
          curve={0.82}
          tilt={7}
          blur={1.5}
          fade={0.28}
          inset={20}
          onChange={onActiveChange}
          onPositionChange={onPositionChange}
        />
      </div>
      <div className="screen-experience__cta">
        <SpecularButton autoAnimate intensity={0.72} size="sm" radius={22} blur={10} tintOpacity={0.08} onClick={onEnter}>
          {`ENTER ${themes[active].word}`}
        </SpecularButton>
      </div>
      <div className="screen-experience__glare" aria-hidden="true" />
    </div>
  );
}
```

Only the snapped `active` index changes CTA text and route. The inherited `--theme-position` CSS variable moves the two five-slot strips continuously without React state updates.

- [ ] **Step 4: Add keyboard entry and selection**

Verify the `Home.jsx` listener above enters the snapped theme with Enter and cleans up on unmount. Keep OptionWheel's official arrow-key handling unchanged.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test -- src/pages/__tests__/Home.test.jsx src/components/home/__tests__/OptionWheel.test.jsx
```

Expected: PASS.

```bash
git add src/pages/Home.jsx src/components/home/ScreenExperience.jsx src/pages/__tests__/Home.test.jsx
git commit -m "feat: 同步主页主题滚动与跳转"
```

---

### Task 8: Replace HOME v2 styling and hide global navigation on the homepage

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/App.jsx:89-101`
- Create: `src/__tests__/AppNavigation.test.jsx`

- [ ] **Step 1: Add a failing application navigation test**

Create `src/__tests__/AppNavigation.test.jsx`:

```jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App.jsx";

vi.mock("lenis", () => ({
  default: class {
    on() {}
    raf() {}
    destroy() {}
    scrollTo() {}
  },
}));
vi.mock("../components/Intro.jsx", () => ({ default: () => null }));
vi.mock("../pages/Home.jsx", () => ({ default: () => <main>HOME SCREEN</main> }));
vi.mock("../pages/Racing.jsx", () => ({ default: () => <main>RACING PAGE</main> }));

describe("global navigation visibility", () => {
  it("hides topic navigation on home", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    expect(screen.queryAllByText("封面")).toHaveLength(0);
  });

  it("keeps topic navigation on a topic page", () => {
    render(<MemoryRouter initialEntries={["/racing"]}><App /></MemoryRouter>);
    expect(screen.getAllByText("封面").length).toBeGreaterThan(0);
  });
});
```

Run `npm test -- src/__tests__/AppNavigation.test.jsx` and expect FAIL because `<Nav />` currently renders on every route.

- [ ] **Step 2: Hide global Nav only on the homepage**

In `App.jsx`, insert this line immediately after `const location = useLocation();`:

```jsx
const isHome = location.pathname === "/";
```

Replace the existing `<Nav />` line with:

```jsx
{!isHome && <Nav />}
```

Keep all topic routes, Intro, wipe transition, Lenis, and data-theme behavior unchanged.

- [ ] **Step 3: Replace the old HOME v2 CSS block**

Remove the old block beginning with `HOME v2 — 笔记本样机 × 主题滚轮`. Add HOME v3 rules with these non-negotiable values:

```css
.home-v3 { position: fixed; inset: 0; overflow: hidden; touch-action: none; overscroll-behavior: none; background: var(--home-matte); perspective: 1500px; }
.home-v3__device { --pointer-rx: 0deg; --pointer-ry: 0deg; position: absolute; width: min(108vw, 1500px); aspect-ratio: 16 / 10; left: 48%; top: 48%; transform-style: preserve-3d; transform: translate(-50%, -50%) rotateY(calc(-7deg + var(--pointer-ry))) rotateX(calc(2deg + var(--pointer-rx))); transform-origin: 48% 78%; }
.home-v3__lid { position: absolute; inset: 0 5% 12%; padding: clamp(8px, .9vw, 14px); border-radius: 22px 22px 7px 7px; background: #0b0c0e; transform-style: preserve-3d; }
.home-v3__screen { position: relative; width: 100%; height: 100%; overflow: hidden; border-radius: 8px; background: #101416; }
.home-v3__base { position: absolute; left: -8%; right: -2%; bottom: 1%; height: 21%; transform: rotateX(72deg) translateZ(-18px); transform-origin: top; background: linear-gradient(180deg, #292b30, #0c0d10 72%); }
.screen-experience__brand { position: absolute; left: 4%; top: 7%; z-index: 30; }
.screen-experience__wheel { position: absolute; right: 2.5%; top: 8%; bottom: 8%; width: min(28%, 260px); z-index: 35; }
.screen-experience__cta { position: absolute; left: 50%; bottom: 6%; z-index: 40; transform: translateX(-50%); }
.screen-experience__word-slot { height: 20%; display: grid; place-items: center; font: 800 clamp(8rem, 24vw, 22rem)/.8 "Cormorant Garamond", serif; opacity: .19; pointer-events: none; }
```

Add the remaining structural and effect rules:

```css
.home-v3__grain { position: absolute; inset: -20%; pointer-events: none; opacity: .07; mix-blend-mode: soft-light; }
.home-v3__desk { position: absolute; left: -6%; right: -6%; bottom: -3%; height: 34%; background: #d2d0cb; }
.home-v3__desk::after { content: ""; position: absolute; left: 9%; right: 4%; top: 4%; height: 52%; background: radial-gradient(ellipse at center, rgba(0,0,0,.44), transparent 68%); filter: blur(18px); }
.screen-experience { position: absolute; inset: 0; overflow: hidden; color: #fff; }
.screen-experience__scenes, .screen-experience__words { position: absolute; inset: 0; height: 500%; will-change: transform; transform: translate3d(0, calc(var(--theme-position, 0) * -20%), 0); }
.screen-experience__words { transform: translate3d(0, calc(var(--theme-position, 0) * -20%), 0); }
.screen-experience__scene-slot { position: relative; height: 20%; overflow: hidden; }
.photo-scene { position: absolute; inset: 0; overflow: hidden; opacity: 0; pointer-events: none; }
.photo-scene[data-active="true"] { opacity: 1; }
.photo-scene__image { width: 100%; height: 100%; object-fit: cover; object-position: var(--scene-focus); user-select: none; }
.fx { position: absolute; inset: 0; pointer-events: none; will-change: transform, opacity; }
.fx--heat { backdrop-filter: blur(.4px); opacity: .2; }
.fx--smoke-layer { inset: 22% -8% -8% 28%; opacity: .36; background: radial-gradient(ellipse at 70% 52%, rgba(255,255,255,.74), rgba(220,230,232,.22) 42%, transparent 72%); filter: blur(16px); }
.fx--smoke-b { transform: translate(-12%, 8%) scale(.82); }
.fx--smoke-c { transform: translate(8%, -10%) scale(.68); }
.fx--flash { width: 4px; height: 4px; inset: 18% auto auto 23%; border-radius: 50%; background: #fff; box-shadow: 0 0 22px 8px rgba(255,255,255,.62); opacity: 0; }
.fx--flash-b { left: 68%; top: 14%; }
.fx--road-streaks { background: linear-gradient(90deg, transparent 0 58%, rgba(255,255,255,.1) 76%, transparent); mix-blend-mode: screen; }
.fx--paint-highlight { background: linear-gradient(115deg, transparent 36%, rgba(255,255,255,.18) 48%, transparent 58%); mix-blend-mode: screen; }
.fx--grass-near, .fx--grass-mid { background-position: bottom; background-repeat: repeat-x; }
.fx--caustics { opacity: .16; mix-blend-mode: screen; filter: blur(2px); }
.fx--particles { opacity: .22; background-image: radial-gradient(circle, rgba(255,255,255,.7) 0 1px, transparent 1.5px); background-size: 43px 57px; }
.fx--cloud-drift { opacity: .16; mix-blend-mode: screen; }
.fx--reflection { top: 64%; filter: blur(.6px) saturate(1.1); }
.fx--light-trail { top: auto; bottom: 7%; height: 3px; background: linear-gradient(90deg, transparent, #f23b55, #4bcde8, transparent); }
.screen-experience__glare { position: absolute; inset: 0; z-index: 50; pointer-events: none; background: linear-gradient(112deg, rgba(255,255,255,.08), transparent 38%); }
.screen-experience__wheel .option-wheel { --ow-text-color: rgba(255,255,255,.24); --ow-active-color: #fff; }
```

Do not restore the old physical wheel, progress dots, caption plate, bottom instruction text, MENU, or topic pills.

- [ ] **Step 4: Add mobile and reduced-motion CSS**

Add these exact responsive and reduced-motion overrides:

```css
@media (max-width: 720px) {
  .home-v3__device { width: 125vw; left: 45%; transform: translate(-50%, -50%) rotateY(-3deg) rotateX(1deg); }
  .home-v3__base { height: 16%; }
  .screen-experience__wheel { right: 1%; width: 34%; min-width: 120px; }
  .screen-experience__word { font-size: clamp(6rem, 31vw, 11rem); }
  .screen-experience__cta { bottom: 5%; }
  .fx--flash, .fx--grass-near { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .home-v3__device { --pointer-rx: 0deg !important; --pointer-ry: 0deg !important; }
  .fx, .photo-scene, .screen-experience__scenes, .screen-experience__words { animation: none !important; transition-duration: .15s !important; }
  .fx--smoke, .fx--water, .fx--caustics, .fx--cloud-drift, .fx--reflection, .fx--light-trail { display: none; }
}
```

- [ ] **Step 5: Run all tests and commit**

Run:

```bash
npm test
```

Expected: PASS.

```bash
git add src/App.jsx src/styles/global.css src/__tests__/AppNavigation.test.jsx
git commit -m "feat: 完成主页视觉与响应式样式"
```

---

### Task 9: Remove the superseded homepage implementation

**Files:**
- Delete: old `SceneCanvas.jsx`, `ThemeWheel.jsx`, `themeMeta.js`, and five procedural scene files.

- [ ] **Step 1: Confirm the old modules are unused**

Run:

```bash
rg -n "SceneCanvas|ThemeWheel|themeMeta|drawF1|drawCars|drawBike|drawFish|drawPhoto" src
```

Expected: matches exist only inside the old files themselves. If an active import remains, remove or replace it before deletion.

- [ ] **Step 2: Delete only the verified superseded files**

Remove the eight verified old homepage files. Do not delete the new photo-scene components or unrelated React Bits components.

- [ ] **Step 3: Verify tests and build**

Run:

```bash
npm test
npm run build
```

Expected: both exit `0`; Vite reports no unresolved imports.

- [ ] **Step 4: Commit cleanup**

```bash
git add -A src/components/home
git commit -m "chore: 移除旧主页程序化场景"
```

---

### Task 10: Visual QA and final verification

**Files:**
- Modify only files directly implicated by QA failures.
- Generate screenshots under the existing QA output convention; do not commit temporary browser artifacts unless the repository already tracks them.

- [ ] **Step 1: Start the development server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL and remains running.

- [ ] **Step 2: Capture five desktop theme screenshots**

Use a 1440×900 viewport. Select and capture `F1`, `M4`, `COLNAGO`, `FISH`, and `PHOTO`. Check:

- shared left-facing hardware perspective;
- photo subject is not cropped incorrectly;
- giant word remains behind the photo focal area;
- OptionWheel selected item is fully legible with blurred neighbors;
- SpecularButton remains readable;
- matte background matches the photograph without extending it outside the screen;
- desk contact shadow stays planted during pointer motion.

- [ ] **Step 3: Verify continuous interaction**

Test mouse wheel, touchpad-like small deltas, click selection, pointer drag, arrow keys, Enter, and CTA click. Confirm the wheel, scene strip, word strip, and matte color remain synchronized and snap to the same index.

- [ ] **Step 4: Verify mobile and reduced motion**

Capture at 390×844 and 768×1024. Emulate `prefers-reduced-motion: reduce`. Confirm the wheel remains draggable, the CTA remains reachable, device perspective is reduced, high-cost continuous effects stop, and no horizontal scrollbar appears.

- [ ] **Step 5: Verify asset independence**

Run:

```bash
rg -n "C:\\Users\\24939|Desktop\\1111|AppData\\Local\\Temp|\.codex\\visualizations" src public scripts
npm run build
```

Expected: `rg` returns no matches; build exits `0`. Do not delete the user's desktop folder as part of verification.

- [ ] **Step 6: Run final test suite**

Run:

```bash
npm test
npm run build
git status --short
```

Expected: tests and build pass. Status contains only intentional work for this feature and pre-existing unrelated user changes.

- [ ] **Step 7: Final implementation commit if QA required fixes**

```bash
git add src/pages/Home.jsx src/App.jsx src/components/home src/components/reactbits src/styles/global.css
git commit -m "fix: 完善主页视觉与交互验收"
```

Skip this commit when QA required no code changes.
