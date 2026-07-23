import { get } from './apiClient.js';

export function fetchApiStatus() {
  return get('/health');
}

export function fetchProducts() {
  return get('/products');
}
