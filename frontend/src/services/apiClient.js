const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// All HTTP communication with the backend passes through this wrapper so
// request configuration and error handling remain in one place.
async function request(endpoint, options = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, options);


  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.success) {
    const error = new Error(
      payload.message || 'The request could not be completed.'
    );


    error.status = response.status;
    error.errors = Array.isArray(payload.errors) ? payload.errors : [];
    throw error;
  }

  return payload.data;
}

function jsonBody(body) {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  };
}

export function get(endpoint) {
  return request(endpoint);
}

export function post(endpoint, body) {
  return request(endpoint, { method: 'POST', ...jsonBody(body) });
}

export function put(endpoint, body) {
  return request(endpoint, { method: 'PUT', ...jsonBody(body) });
}

export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}
