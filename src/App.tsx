import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ComparePage } from "./pages/ComparePage";
import { FoodPage } from "./pages/FoodPage";
import { LimitsPage } from "./pages/LimitsPage";
import { MatrixPage } from "./pages/MatrixPage";
import { MethodPage } from "./pages/MethodPage";
import { RecommendPage } from "./pages/RecommendPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MatrixPage />} />
        <Route path="/food/:id" element={<FoodPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/recommend" element={<RecommendPage />} />
        <Route path="/method" element={<MethodPage />} />
        <Route path="/limits" element={<LimitsPage />} />
      </Route>
    </Routes>
  );
}
