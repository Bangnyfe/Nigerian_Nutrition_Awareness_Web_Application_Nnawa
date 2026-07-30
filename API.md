# Nnawa API Documentation

The Nnawa backend exposes a small REST API under the `/api/v1` prefix. This document describes every endpoint, its authentication requirement, and its request and response format.

## Base URL

| Environment | Base URL                           |
| ----------- | ---------------------------------- |
| Local       | `http://localhost:4000/api/v1`     |
| Production  | `https://nnawa.duckdns.org/api/v1` |

## Response format

Every response uses a standard JSON envelope.

**Success:**

```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": {}
}
```

**Error:**

```json
{
  "success": false,
  "message": "The product data is invalid.",
  "errors": ["Product name is required."]
}
```

`data` is present on success (and may be `null`). `errors` is an array of messages present on validation failures.

## Authentication

Nnawa uses session-based authentication with a single administrator account. Logging in sets an `httpOnly` session cookie (`nnawa.sid`) that must accompany subsequent requests to protected endpoints.

- **Public** endpoints require no authentication.
- **Protected** endpoints (creating, updating, and deleting products) require a valid admin session. Requests without one receive `401`.

When testing with a tool such as Postman, call `POST /auth/login` first; the client stores the session cookie and sends it automatically on following requests.

---

## Health

### GET /health

Returns service and database status. Public.

**Response 200:**

```json
{
  "success": true,
  "message": "Nnawa API is running.",
  "data": {
    "status": "ok",
    "database": "connected",
    "productCount": 5
  }
}
```

---

## Products

### GET /products

Returns all products, or filters by name when a `search` query parameter is supplied. Public.

**Query parameters:**

| Name   | Required | Description                         |
| ------ | -------- | ----------------------------------- |
| search | no       | Case-insensitive partial name match |

**Examples:**

```
GET /products
GET /products?search=milo
```

**Response 200:**

```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": [
    {
      "id": 1,
      "product_name": "Indomie Instant Noodles Chicken Flavour",
      "brand": "Indomie",
      "description": null,
      "processing_level": null,
      "health_indicator": null,
      "category_name": "Instant Noodles"
    }
  ]
}
```

A search that matches nothing returns `200` with an empty `data` array. An empty or overlong keyword returns `400`.

### GET /products/:id

Returns a single product with all related data: nutrition facts, nutritional concerns, and both kinds of alternatives. Public.

**Response 200:**

```json
{
  "success": true,
  "message": "Product retrieved successfully.",
  "data": {
    "id": 1,
    "product_name": "Indomie Instant Noodles Chicken Flavour",
    "brand": "Indomie",
    "description": null,
    "processing_level": null,
    "health_indicator": null,
    "serving_size_value": null,
    "serving_size_unit": null,
    "category_name": "Instant Noodles",
    "nutrition_facts": null,
    "nutritional_concerns": [],
    "product_alternatives": [],
    "whole_food_alternatives": []
  }
}
```

- `nutrition_facts` is an object when recorded, otherwise `null`.
- The three related lists are arrays, empty when nothing is recorded.
- A non-numeric id returns `400`; a valid id with no matching product returns `404`.

### POST /products

Creates a product with all of its related data. **Requires authentication.**

**Request body:**

```json
{
  "product_name": "Example Product",
  "brand": "Example Brand",
  "category_name": "Instant Noodles",
  "description": "Optional description.",
  "processing_level": "NOVA_4",
  "health_indicator": "CONSUME_IN_MODERATION",
  "serving_size_value": 70,
  "serving_size_unit": "g",
  "nutrition_facts": {
    "basis": "PER_100G",
    "energy_kcal": 450,
    "sodium_mg": 900
  },
  "nutritional_concerns": [
    { "title": "High sodium", "description": "…", "severity": "HIGH" }
  ],
  "product_alternatives": [
    { "alternative_name": "A better option", "reason": "Lower sodium." }
  ],
  "whole_food_alternatives": [
    { "food_name": "A whole food", "description": "…", "benefit": "…" }
  ]
}
```

**Field notes:**

- `product_name` and `category_name` are required. All other fields are optional.
- `category_name` is matched case-insensitively; a new category is created if it does not already exist.
- `processing_level` must be one of `NOVA_1`, `NOVA_2`, `NOVA_3`, `NOVA_4`.
- `health_indicator` must be one of `HEALTHIER_CHOICE`, `CONSUME_IN_MODERATION`, `HIGH_NUTRITIONAL_CONCERN`.
- `nutrition_facts.basis` must be one of `PER_100G`, `PER_100ML`, `PER_SERVING`, and is required if any nutrition value is provided.
- `serving_size_value` and `serving_size_unit` must be supplied together.
- Concern `severity`, when present, must be `LOW`, `MODERATE`, or `HIGH`.

**Response 201:** the created product, in the same shape as `GET /products/:id`.

**Errors:** `400` with an `errors` array on validation failure; `401` if not authenticated.

### PUT /products/:id

Updates a product and replaces all of its related data. Requires authentication. Same request body and validation as `POST /products`.

**Response 200:** the updated product.

**Errors:** `400` invalid data, `401` not authenticated, `404` no such product.

### DELETE /products/:id

Deletes a product and all of its related records. Requires authentication.

**Response 200:**

```json
{
  "success": true,
  "message": "Product deleted successfully.",
  "data": null
}
```

**Errors:** `400` invalid id, `401` not authenticated, `404` no such product.

---

## Categories

### GET /categories

Returns all categories. Public.

**Response 200:**

```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": [{ "id": 1, "name": "Instant Noodles" }]
}
```

---

## Authentication endpoints

### POST /auth/login

Logs the administrator in and establishes a session. Public, but **rate-limited to 5 failed attempts per IP per 15 minutes.** Successful logins are not counted.

**Request body:**

```json
{ "email": "nnawa_admin@gmail.com", "password": "Success100%" }
```

**Response 200:**

```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": { "isAuthenticated": true, "email": "nnawa_admin@gmail.com" }
}
```

**Errors:** `401` with a generic "Invalid email or password." on failure (the message does not reveal whether the email exists); `429` when the rate limit is exceeded.

### POST /auth/logout

Ends the current session and clears the session cookie.

**Response 200:**

```json
{ "success": true, "message": "Logged out successfully.", "data": null }
```

### GET /auth/me

Reports whether the current request is authenticated. Always returns `200`.

**Response 200 (authenticated):**

```json
{
  "success": true,
  "message": "Authenticated.",
  "data": { "isAuthenticated": true, "email": "nnawa_admin@gmail.com" }
}
```

**Response 200 (not authenticated):**

```json
{
  "success": true,
  "message": "Not authenticated.",
  "data": { "isAuthenticated": false }
}
```
