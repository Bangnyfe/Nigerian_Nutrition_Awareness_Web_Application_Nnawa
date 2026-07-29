import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';

const POPULAR_SEARCHES = [
  'Indomie',
  'Milo',
  'Coca-Cola',
  'Gala',
  'Golden Morn'
];

const HELP_STEPS = [
  {
    title: 'Search',
    description: 'Search for a packaged food product.'
  },
  {
    title: 'Learn',
    description:
      'View nutrition facts, health indicators, and nutritional concerns.'
  },
  {
    title: 'Choose',
    description:
      'Discover healthier packaged products and whole-food alternatives.'
  }
];

const BENEFITS = [
  'Make informed food choices',
  'Better understand packaged foods',
  'Discover healthier alternatives',
  'Nutrition information explained simply'
];

function HomePage() {
  const navigate = useNavigate();

  // Both the search bar and the popular-search chips use the same navigation,
  // so a chip behaves exactly as if the term had been typed and searched.
  function goToSearch(keyword) {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  }

  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero__title">Make healthier food choices with confidence</h1>
        <p className="hero__description">
          Search packaged food products commonly consumed in Nigeria,
          understand their nutritional information, and discover healthier
          alternatives.
        </p>

        <div className="hero__search">
          <SearchBar onSearch={goToSearch} />
        </div>

        <div className="popular-searches">
          <span className="popular-searches__label">Popular searches:</span>
          <ul className="popular-searches__list">
            {POPULAR_SEARCHES.map((term) => (
              <li key={term}>
                <button
                  type="button"
                  className="chip"
                  onClick={() => goToSearch(term)}
                >
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section">
        <h2>How Nnawa Helps</h2>
        <div className="info-cards">
          {HELP_STEPS.map((step) => (
            <div className="info-card" key={step.title}>
              <h3 className="info-card__title">{step.title}</h3>
              <p className="info-card__description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Why Use Nnawa?</h2>
        <ul className="benefit-list">
          {BENEFITS.map((benefit) => (
            <li className="benefit-list__item" key={benefit}>
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      <p className="disclaimer">
        Nnawa is an educational nutrition-awareness tool. The information it
        provides supports informed decision-making and does not replace
        professional medical or dietary advice.
      </p>
    </div>
  );
}
export default HomePage;
