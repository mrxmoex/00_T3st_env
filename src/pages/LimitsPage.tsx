export function LimitsPage() {
  return (
    <main>
      <h1>What this system will not claim</h1>
      <p className="lede">
        Honesty is the product. The matrix measures biochemical axes. It does not sell a diet,
        a tribe, or a personality.
      </p>
      <section className="panel">
        <h2>Non-claims</h2>
        <ul>
          <li>It will not claim that plant and animal proteins are equivalent.</li>
          <li>It will not claim that non-heme iron, phytate-bound zinc, or carotenoid-A equal heme iron, animal zinc, or retinol.</li>
          <li>It will not claim that ALA is EPA/DHA.</li>
          <li>It will not claim that algal B12 analogues are vitamin B12.</li>
          <li>It will not claim that a plant-only diet is complete without fortification or supplementation.</li>
          <li>It will not claim that fibre absence makes meat “unhealthy,” or that fibre presence makes a plant complete.</li>
          <li>It will not treat leafy salads, legumes, sprouts, kraut, mushrooms, and algae as one class.</li>
          <li>It will not treat muscle, organs, eggs, dairy, and fermented animal foods as one class.</li>
          <li>It will not issue medical diagnoses, personalised prescriptions, or bloodwork interpretations (the data model allows future overlays; they are not present).</li>
          <li>It will not treat residue scores as laboratory certificates for a named farm or lot.</li>
          <li>It will not hide agricultural chemicals, metals, or veterinary residues.</li>
          <li>It will not produce a black-box “AI nutrition score.”</li>
          <li>It will not put the matrix behind a paywall.</li>
        </ul>
      </section>
      <section className="panel">
        <h2>What it will do</h2>
        <ul>
          <li>Rank foods inside a class on documented axes.</li>
          <li>Show the limiting amino acid, conversion factors, and absorption coefficients.</li>
          <li>Version the dataset and show the last verification date.</li>
          <li>Export the matrix as CSV and JSON.</li>
          <li>State required gaps for plant-only patterns in plain language.</li>
        </ul>
      </section>
    </main>
  );
}
