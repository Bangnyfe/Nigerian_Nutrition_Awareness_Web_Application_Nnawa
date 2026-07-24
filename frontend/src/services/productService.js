import { get } from './apiClient.js';

export function fetchApiStatus() {
  return get('/health');
}

export function fetchProducts() {
  return get('/products');
}

export function searchProducts(keyword) {
  return get(`/products?search=${encodeURIComponent(keyword)}`);
}
