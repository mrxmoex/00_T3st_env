import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.tsx";
import { ComparePage } from "./pages/ComparePage.tsx";
import { FoodPage } from "./pages/FoodPage.tsx";
import { MatrixPage } from "./pages/MatrixPage.tsx";
import { MethodologyPage } from "./pages/MethodologyPage.tsx";
import { RecommendPage } from "./pages/RecommendPage.tsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MatrixPage />} />
          <Route path="food/:id" element={<FoodPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="recommend" element={<RecommendPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
