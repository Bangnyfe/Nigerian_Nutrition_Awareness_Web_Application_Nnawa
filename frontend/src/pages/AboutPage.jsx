function AboutPage() {
  return (
    <div className="content-page">
      <h1>About Nnawa</h1>

      <section className="card">
        <p>
          Nnawa is an educational web application that helps people understand
          the nutritional content of packaged foods commonly available in
          Nigeria. Users can search for products, view their nutrition facts
          and health indicators, and find healthier alternatives, all
          presented in simple, everyday language.
        </p>
      </section>

      <section className="card">
        <h2>Our Mission</h2>
        <p>
          To promote healthier lifestyles in Nigeria by helping individuals
          make informed dietary choices and reduce their dependence on
          ultra-processed foods. Nnawa aims to give young urban Nigerians
          accessible nutritional information and practical, healthier
          alternatives in support of sustainable well-being.
        </p>
      </section>

      <section className="card">
        <h2>Why Nnawa Was Created</h2>
        <p>
          Packaged and ultra-processed foods are becoming more common in
          everyday diets, yet their nutrition labels are often difficult to
          interpret. Many people find it hard to judge how healthy a product
          really is, or to know what a healthier option might be. Nnawa was
          created to bridge that gap with clear, simple nutritional guidance
          that supports better everyday food decisions.
        </p>
      </section>

      <section className="card">
        <h2>What Nnawa Provides</h2>
        <ul className="detail-points">
          <li>Product search</li>
          <li>Nutrition facts</li>
          <li>Health indicators</li>
          <li>Nutritional concerns</li>
          <li>Healthier packaged alternatives</li>
          <li>Whole-food alternatives</li>
        </ul>
      </section>

      <section className="card">
        <h2>What Nnawa Does Not Provide</h2>
        <ul className="detail-points">
          <li>Medical advice</li>
          <li>Personalized nutrition plans</li>
          <li>Meal planning</li>
          <li>Calorie tracking</li>
          <li>Fitness guidance</li>
        </ul>
      </section>

      <p className="disclaimer">
        Nnawa is intended for educational and nutrition-awareness purposes
        only. It does not provide medical diagnosis, treatment, or
        professional dietary advice. Anyone with specific dietary or medical
        concerns should consult a qualified healthcare professional.
      </p>
    </div>
  );
}
export default AboutPage;
