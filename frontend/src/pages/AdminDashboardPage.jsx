import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HealthIndicatorBadge from '../components/HealthIndicatorBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { fetchProducts, deleteProduct } from '../services/productService.js';

function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  function loadProducts() {
    setIsLoading(true);
    setError(null);

    return fetchProducts()
      .then((data) => setProducts(data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    let isActive = true;

    fetchProducts()
      .then((data) => {
        if (isActive) {
          setProducts(data);
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

  async function handleConfirmDelete(productId) {
    setDeletingId(productId);
    setActionError(null);

    try {
      await deleteProduct(productId);
      setPendingDeleteId(null);
      await loadProducts();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Link className="button button--primary" to="/admin/new">
          Add Product
        </Link>
      </div>

      {actionError && <ErrorMessage message={actionError} />}

      {isLoading && <LoadingSpinner message="Loading products…" />}

      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && products.length === 0 && (
        <div className="empty-state">
          <p>No products have been added yet.</p>
          <Link className="button button--secondary" to="/admin/new">
            Add the first product
          </Link>
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <ul className="admin-list">
          {products.map((product) => (
            <li className="admin-list__item" key={product.id}>
              <div className="admin-list__info">
                <span className="admin-list__name">{product.product_name}</span>
                <span className="admin-list__category">
                  {product.category_name}
                </span>
                <HealthIndicatorBadge code={product.health_indicator} />
              </div>

              <div className="admin-list__actions">
                {pendingDeleteId === product.id ? (
                  <>
                    <span className="admin-list__confirm">Delete?</span>
                    <button
                      type="button"
                      className="button button--danger button--small"
                      onClick={() => handleConfirmDelete(product.id)}
                      disabled={deletingId === product.id}
                    >
                      {deletingId === product.id ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button
                      type="button"
                      className="button button--secondary button--small"
                      onClick={() => setPendingDeleteId(null)}
                      disabled={deletingId === product.id}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      className="button button--secondary button--small"
                      to={`/admin/edit/${product.id}`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="button button--danger button--small"
                      onClick={() => {
                        setActionError(null);
                        setPendingDeleteId(product.id);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default AdminDashboardPage;
