import { get, post } from './apiClient.js';

export function fetchAuthStatus() {
  return get('/auth/me');
}

export function login(email, password) {
  return post('/auth/login', { email, password });
}

export function logout() {
  return post('/auth/logout', {});
}
