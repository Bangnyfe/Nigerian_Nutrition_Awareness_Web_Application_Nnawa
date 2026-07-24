import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { searchProducts } from '../services/productService.js';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword = (searchParams.get('q') || '').trim();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (keyword.length === 0) {
      setProducts([]);
      setError(null);
      setIsLoading(false);
      return undefined;
    }

    let isActive = true;

    setIsLoading(true);
    setError(null);

    searchProducts(keyword)
      .then((data) => {
        if (isActive) {
          setProducts(data);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError.message);
          setProducts([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    
    return () => {
      isActive = false;
    };
  }, [keyword]);

  function handleSearch(nextKeyword) {
    navigate(`/search?q=${encodeURIComponent(nextKeyword)}`);
  }

  return (
    <div>
      <h1>Search Results</h1>

      <section className="card">
        
        <SearchBar
          key={keyword}
          initialValue={keyword}
          onSearch={handleSearch}
        />
      </section>

      {keyword.length === 0 && (
        <p className="empty-state">
          Enter a product name above to begin searching.
        </p>
      )}

      {keyword.length > 0 && isLoading && (
        <LoadingSpinner message="Searching for products…" />
      )}

      {keyword.length > 0 && !isLoading && error && (
        <ErrorMessage message={error} />
      )}

      {keyword.length > 0 && !isLoading && !error && products.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">Product Not Found</p>
          <p>
            “{keyword}” was not found. Check the spelling or
            try a shorter part of the product name.
          </p>
        </div>
      )}

      {keyword.length > 0 && !isLoading && !error && products.length > 0 && (
        <>
          <p className="results-count">
            {products.length}{' '}
            {products.length === 1 ? 'product' : 'products'} found for “
            {keyword}”.
          </p>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchResultsPage;
