import { get, post, put, del } from './apiClient.js';

export function fetchApiStatus() {
  return get('/health');
}

export function fetchProducts() {
  return get('/products');
}

export function searchProducts(keyword) {
  return get(`/products?search=${encodeURIComponent(keyword)}`);
}

export function fetchProductById(productId) {
  return get(`/products/${encodeURIComponent(productId)}`);
}

export function fetchCategories() {
  return get('/categories');
}

export function createProduct(product) {
  return post('/products', product);
}

export function updateProduct(productId, product) {
  return put(`/products/${encodeURIComponent(productId)}`, product);
}

export function deleteProduct(productId) {
  return del(`/products/${encodeURIComponent(productId)}`);
}
