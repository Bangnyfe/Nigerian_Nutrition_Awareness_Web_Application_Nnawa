import { Link } from 'react-router-dom';
import HealthIndicatorBadge from './HealthIndicatorBadge.jsx';

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h3 className="product-card__name">{product.product_name}</h3>

      {product.brand && (
        <p className="product-card__brand">{product.brand}</p>
      )}

      <p className="product-card__category">{product.category_name}</p>

      <HealthIndicatorBadge code={product.health_indicator} />

      <Link className="button button--secondary" to={`/product/${product.id}`}>
        View Details
      </Link>
    </article>
  );
}

export default ProductCard;
