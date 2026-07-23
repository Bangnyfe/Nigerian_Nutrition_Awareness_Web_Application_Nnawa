const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// All HTTP communication with the backend passes through this wrapper so
// request configuration and error handling remain in one place.
export async function get(endpoint) {
  const response = await fetch(`${baseUrl}${endpoint}`);
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'The request could not be completed.');
  }

  return payload.data;
}
