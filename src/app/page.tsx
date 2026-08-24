import { Hero } from "@/components/hero";
import { MatrixExplorer } from "@/components/matrix-explorer";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <Hero />
      <MatrixExplorer />
    </div>
  );
}
