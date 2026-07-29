function HowNnawaEvaluatesPage() {
  return (
    <div className="content-page">
      <h1>How Nnawa Evaluates Foods</h1>

      <section className="card">
        <p>
          Nnawa evaluates packaged foods using a combination of the NOVA Food
          Classification and nutritional guidance from the World Health
          Organization (WHO). Considering both how processed a food is and its
          nutrients of concern helps provide a more balanced nutritional
          assessment than either approach alone.
        </p>
      </section>

      <section className="card">
        <h2>NOVA Food Classification</h2>
        <p>
          NOVA groups foods by how much they have been processed. In simple
          terms:
        </p>
        <ul className="detail-points">
          <li>
            <strong>Minimally processed foods</strong> are close to their
            natural state, such as fresh or lightly prepared foods.
          </li>
          <li>
            <strong>Processed foods</strong> have ingredients such as salt,
            sugar, or oil added to extend shelf life or improve taste.
          </li>
          <li>
            <strong>Ultra-processed foods</strong> are industrial products made
            largely from refined ingredients and additives, often high in
            sugar, salt, or fat.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>WHO Nutritional Guidance</h2>
        <p>
          Alongside processing level, Nnawa considers nutrients that are
          commonly linked to less healthy dietary patterns when consumed in
          excess, including:
        </p>
        <ul className="detail-points">
          <li>Sugar</li>
          <li>Sodium</li>
          <li>Saturated fat</li>
        </ul>
      </section>

      <section className="card">
        <h2>Understanding Health Indicators</h2>

        <h3>Healthier Choice</h3>
        <p>
          Lower nutritional concerns and generally less processed. A more
          favourable option for regular consumption.
        </p>

        <h3>Consume in Moderation</h3>
        <p>
          Moderate nutritional concerns. Best consumed occasionally as part of
          a balanced diet.
        </p>

        <h3>High Nutritional Concern</h3>
        <p>
          Higher levels of nutritional concerns and/or greater processing.
          Healthier alternatives are recommended where available.
        </p>
      </section>

      <section className="card">
        <h2>Why Alternatives Are Recommended</h2>

        <h3>Healthier Packaged Alternatives</h3>
        <p>
          Packaged products with a more favourable nutritional profile that can
          serve as a better substitute for a similar product.
        </p>

        <h3>Whole-Food Alternatives</h3>
        <p>
          Less processed foods that can serve a similar purpose, offering an
          option closer to its natural state.
        </p>
      </section>

      <p className="disclaimer">
        Nnawa is an educational nutrition-awareness tool. Its health indicators
        support informed decision-making and do not replace professional
        medical or dietary advice.
      </p>
    </div>
  );
}
export default HowNnawaEvaluatesPage;
