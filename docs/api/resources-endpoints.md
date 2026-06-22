# API v1 - Resources

All endpoints live under `/api/v1/`. No CSRF token is required.

## Authentication

Three credentials are accepted:

**1. API key (bearer token)** - recommended for scripts and integrations. Long-lived, scope-limited (`read`/`write`):

```
GET /api/v1/resources
Authorization: Bearer sk_xxxxxxxxxxxxxxxxxxxxxxxx
```

**2. Login token (bearer token)** - short-lived (10 min), full access. Exchange email + password via `POST /api/v1/login` - see [`login.md`](login.md):

```
Authorization: Bearer <login token>
```

**3. Session cookie** - for same-origin browser clients. Sign in to get one:

```
POST /session
Content-Type: application/json

{ "email_address": "user@example.com", "password": "secret" }
```

Include the resulting `session_id` cookie on subsequent requests. A missing or invalid credential returns `401 Unauthorized`.

### API key scopes

Each key is `read` or `write`. A `read` key may make `GET` requests only; a `write` key may do anything (write includes read). A `read` key attempting a mutating request gets `403 Forbidden`. Session-cookie clients are not scope-restricted.

Manage keys via the `/api/v1/api-keys` endpoints - see [`api-keys.md`](api-keys.md).

---

## GET /api/v1/resources

Returns all resources sorted alphabetically by name.

**Response 200**
```json
{
  "resources": [
    {
      "id": 1,
      "name": "Alice Smith",
      "active": true,
      "billable_hours_limit": 40.0,
      "start_date": "2024-01-15",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## GET /api/v1/resources/:id

Returns a single resource by ID.

**Response 200** - same shape as a single item from the list above.

**Response 404**
```json
{ "error": "Resource not found" }
```

---

## POST /api/v1/resources

Creates a new resource.

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "resource": {
    "name": "Alice Smith",
    "active": true,
    "billable_hours_limit": 40,
    "start_date": "2024-01-15"
  }
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `resource.name` | string | yes | Must be present |
| `resource.active` | boolean | yes | Must be true or false |
| `resource.billable_hours_limit` | number | yes | Must be greater than 0 |
| `resource.start_date` | date (YYYY-MM-DD) | no | - |

**Response 201**
```json
{
  "id": 7,
  "name": "Alice Smith",
  "active": true,
  "billable_hours_limit": 40.0,
  "start_date": "2024-01-15",
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Response 400** - missing `resource` wrapper
```json
{ "error": "param is missing or the value is empty: resource" }
```

**Response 422** - validation failure
```json
{ "errors": ["Name can't be blank", "Billable hours limit must be greater than 0"] }
```

---

## PATCH /api/v1/resources/:id

Updates an existing resource. Only include the fields you want to change.

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{
  "resource": {
    "active": false
  }
}
```

**Response 200** - full resource object (same shape as POST 201)

**Response 400** - missing `resource` wrapper

**Response 404** - resource not found

**Response 422** - validation failure

---

For the full machine-readable spec see [`openapi.yaml`](openapi.yaml).
