import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import App from "../App.jsx";

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
});
