/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { Layout } from "../components/Layout";
import { ThemeProvider } from "../state/theme";
import { ComparePage } from "./ComparePage";
import { FoodPage } from "./FoodPage";
import { MatrixPage } from "./MatrixPage";
import { MethodologyPage } from "./MethodologyPage";
import { RecommendPage } from "./RecommendPage";

function renderApp(path: string) {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<MatrixPage />} />
            <Route path="food/:id" element={<FoodPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="recommend" element={<RecommendPage />} />
            <Route path="methodology" element={<MethodologyPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe("UI behaviour", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the matrix with class-separated foods and non-claims", () => {
    renderApp("/");
    expect(screen.getByRole("heading", { name: "Du bist was du isst" })).toBeTruthy();
    expect(screen.getByText(/No black-box/i)).toBeTruthy();
    expect(screen.getByText("Spinach, raw")).toBeTruthy();
    expect(screen.getByText("Beef sirloin, cooked")).toBeTruthy();
    expect(screen.getByText("Broccoli sprouts")).toBeTruthy();
    expect(screen.getByText("Sauerkraut, canned")).toBeTruthy();
    expect(screen.getByText("Shiitake, raw")).toBeTruthy();
    expect(screen.getByText("Spirulina, dried")).toBeTruthy();
    expect(screen.getAllByText("Schroom").length).toBeGreaterThan(0);
  });

  it("hides animal rows on plant-only and states B12 is required", () => {
    renderApp("/");
    fireEvent.change(screen.getByLabelText("Dietary pattern"), { target: { value: "plant-only" } });
    expect(screen.getByText(/B12 supplementation is required/i)).toBeTruthy();
    expect(screen.queryByText("Beef sirloin, cooked")).toBeNull();
    expect(screen.getByText("Lentils, boiled")).toBeTruthy();
  });

  it("shows incomplete protein language on a pulse deep dive", () => {
    renderApp("/food/lentils-boiled");
    expect(screen.getByText(/Incomplete protein\. Not rescaled/i)).toBeTruthy();
    expect(screen.getByText(/Source & method/i)).toBeTruthy();
  });

  it("requires B12 on the plant-only recommendation page", () => {
    renderApp("/recommend");
    fireEvent.change(screen.getByLabelText("Pattern"), { target: { value: "plant-only" } });
    expect(screen.getByText(/Vitamin B12 must be supplemented/i)).toBeTruthy();
    expect(screen.getByText(/No forced equivalence/i)).toBeTruthy();
  });

  it("publishes class weights and sources on the methodology page", () => {
    renderApp("/methodology");
    expect(screen.getByText("Class weights")).toBeTruthy();
    expect(screen.getAllByText("Leafy / salad greens").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mushrooms (Schroom)").length).toBeGreaterThan(0);
    expect(screen.getByText(/USDA FoodData Central/)).toBeTruthy();
  });
});
