import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import {
  fetchProductById,
  fetchCategories,
  createProduct,
  updateProduct
} from '../services/productService.js';

function AdminProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError(null);

    const requests = isEditing
      ? Promise.all([fetchProductById(id), fetchCategories()])
      : Promise.all([Promise.resolve(null), fetchCategories()]);

    requests
      .then(([loadedProduct, loadedCategories]) => {
        if (isActive) {
          setProduct(loadedProduct);
          setCategories(loadedCategories);
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
  }, [id, isEditing]);

  // The form surfaces any thrown validation errors; on success the browser
  // returns to the dashboard.
  async function handleSubmit(payload) {
    if (isEditing) {
      await updateProduct(id, payload);
    } else {
      await createProduct(payload);
    }
    navigate('/admin');
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading…" />;
  }

  if (error) {
    return (
      <div>
        <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>
        <ErrorMessage message={error} />
        <p>
          <Link className="button button--secondary" to="/admin">
            Back to dashboard
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link className="back-link" to="/admin">
        ← Back to dashboard
      </Link>
      <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>

      <ProductForm
        initialProduct={product}
        categories={categories}
        submitLabel={isEditing ? 'Save changes' : 'Create product'}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin')}
      />
    </div>
  );
}

export default AdminProductPage;
