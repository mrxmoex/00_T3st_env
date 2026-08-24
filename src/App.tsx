import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ComparePage } from "./pages/ComparePage";
import { FoodPage } from "./pages/FoodPage";
import { MatrixPage } from "./pages/MatrixPage";
import { MethodologyPage } from "./pages/MethodologyPage";
import { RecommendPage } from "./pages/RecommendPage";
import { ThemeProvider } from "./state/theme";

export function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MatrixPage />} />
          <Route path="food/:id" element={<FoodPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="recommend" element={<RecommendPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}
