import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import NutritionTable from '../components/NutritionTable.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { fetchProductById } from '../services/productService.js';
import {
  getProcessingLevelLabel,
  formatServingSize
} from '../utils/productLabels.js';

function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setError(null);
    setIsNotFound(false);

    fetchProductById(id)
      .then((data) => {
        if (isActive) {
          setProduct(data);
        }
      })
      .catch((requestError) => {
        if (!isActive) {
          return;
        }

        setProduct(null);

        if (requestError.status === 404 || requestError.status === 400) {
          setIsNotFound(true);
        } else {
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
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading product information…" />;
  }

  if (isNotFound) {
    return (
      <div>
        <h1>Product Not Found</h1>
        <div className="empty-state">
          <p>
            This product is not available in the Nnawa database. It may have
            been removed, or the link may be incorrect.
          </p>
          <Link className="button button--secondary" to="/search">
            Search for a product
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Product Details</h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const processingLevelLabel = getProcessingLevelLabel(
    product.processing_level
  );
  const servingSize = formatServingSize(
    product.serving_size_value,
    product.serving_size_unit
  );

  return (
    <div className="product-details">
      <Link className="back-link" to="/search">
        ← Back to search
      </Link>

      <h1>{product.product_name}</h1>

      <section className="card">
        <h2>Product Information</h2>
        <dl className="detail-list">
          {product.brand && (
            <>
              <dt>Brand</dt>
              <dd>{product.brand}</dd>
            </>
          )}

          <dt>Category</dt>
          <dd>{product.category_name}</dd>

          <dt>Processing level</dt>
          <dd>
            {processingLevelLabel || 'Not recorded'}
          </dd>

          {servingSize && (
            <>
              <dt>Serving size</dt>
              <dd>{servingSize}</dd>
            </>
          )}
        </dl>

        {product.description ? (
          <p className="product-details__description">{product.description}</p>
        ) : (
          <p className="product-details__description product-details__description--empty">
            A description for this product has not been added yet.
          </p>
        )}
      </section>

      <section className="card">
        <h2>Nutrition Facts</h2>
        {product.nutrition_facts ? (
          <NutritionTable nutritionFacts={product.nutrition_facts} />
        ) : (
          <p className="empty-state">
            Nutritional information for this product has not been added yet.
          </p>
        )}
      </section>
    </div>
  );
}

export default ProductDetailsPage;
