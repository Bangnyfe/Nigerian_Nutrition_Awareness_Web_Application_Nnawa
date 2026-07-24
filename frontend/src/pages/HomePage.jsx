import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';

function HomePage() {
  const navigate = useNavigate();

  function handleSearch(keyword) {
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
  }

  return (
    <div>
      <h1>Nnawa</h1>
      <p className="page-intro">
        Search for a packaged food product to learn about its nutritional value
	and discover healthier whole food or product options
      </p>

      <section className="card">
        <SearchBar onSearch={handleSearch} />
      </section>
    </div>
  );
}

export default HomePage;
