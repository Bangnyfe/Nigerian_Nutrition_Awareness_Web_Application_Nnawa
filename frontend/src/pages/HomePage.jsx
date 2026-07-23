import { useEffect, useState } from 'react';
import { fetchApiStatus } from '../services/productService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

function HomePage() {
  const [status, setStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    fetchApiStatus()
      .then((data) => {
        if (isActive) {
          setStatus(data);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(requestError.message);
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
  }, []);

  return (
    <div>
      <h1>Nnawa</h1>
      <p>
        Understand the nutritional content of packaged foods and discover
        healthier alternatives.
      </p>

      <section className="card">
        <h2>System Status</h2>
        {isLoading && <LoadingSpinner message="Checking backend connection…" />}
        {!isLoading && error && <ErrorMessage message={error} />}
        {!isLoading && !error && status && (
          <p>
            Backend connected. Database {status.database} with{' '}
            {status.productCount} product records.
          </p>
        )}
      </section>
    </div>
  );
}

export default HomePage;
