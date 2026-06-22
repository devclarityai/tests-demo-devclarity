# API v1 - API Keys

Manage programmatic access tokens. All endpoints live under `/api/v1/api-keys`. No CSRF token is required.

API keys are bearer tokens of the form `sk_xxxxxxxxxxxxxxxxxxxxxxxx`. The raw token is shown **only once**, in the `POST` response. Only a SHA-256 digest is stored, so a lost token cannot be recovered - revoke it and create a new one.

## Authentication & scope

These endpoints require an active credential (see [`post-clients.md`](post-clients.md)). Listing and reading keys works with any active key (or a session). **Creating, updating, and revoking a key requires a `write`-scoped key (or a session)** - a `read` key gets `403 Forbidden`.

> Note: a `write` key can mint additional keys (including other `write` keys). Treat write keys like admin credentials.

A key has a `scope`:

- `read` - may make `GET` requests only.
- `write` - may make any request (write includes read).

---

## GET /api/v1/api-keys

Lists the authenticated user's keys, newest first. The raw token is never returned - only `token_prefix` (first 11 chars) to identify a key.

**Response 200**
```json
{
  "api_keys": [
    {
      "id": 2,
      "name": "CI pipeline",
      "scope": "read",
      "token_prefix": "sk_ro_7Jq2N",
      "active": true,
      "last_used_at": "2026-06-21T14:00:00.000Z",
      "expires_at": null,
      "revoked_at": null,
      "created_at": "2026-06-20T10:00:00.000Z",
      "updated_at": "2026-06-20T10:00:00.000Z"
    }
  ]
}
```

---

## GET /api/v1/api-keys/:id

Returns a single key's metadata (no raw token).

**Response 200** - same shape as a single item in the list above.

**Response 404**
```json
{ "error": "API key not found" }
```

---

## POST /api/v1/api-keys

Creates a key. Requires a `write` scope. The response includes the raw `token` - **this is the only time it is returned.**

**Headers**
```
Content-Type: application/json
Authorization: Bearer sk_... (write scope)
```

**Body**
```json
{
  "api_key": {
    "name": "CI pipeline",
    "scope": "read",
    "expires_at": null
  }
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `api_key.name` | string | yes | Human label for the key |
| `api_key.scope` | string | no | `read` (default) or `write` |
| `api_key.expires_at` | date-time | no | Optional expiry; omit for non-expiring |

**Response 201**
```json
{
  "id": 7,
  "name": "CI pipeline",
  "scope": "read",
  "token": "sk_ro_7Jq2NbVx9dKmPf3RtZcL8aHsWy6gE4uT",
  "token_prefix": "sk_ro_7Jq2N",
  "active": true,
  "last_used_at": null,
  "expires_at": null,
  "revoked_at": null,
  "created_at": "2026-06-21T10:00:00.000Z",
  "updated_at": "2026-06-21T10:00:00.000Z"
}
```

**Response 403** - caller's key lacks `write` scope
```json
{ "error": "Forbidden: write scope required" }
```

**Response 422** - validation failure
```json
{ "errors": ["Name can't be blank", "Scope is not included in the list"] }
```

---

## PATCH /api/v1/api-keys/:id

Updates `name`, `scope`, and/or `expires_at`. The token is never reissued. Requires a `write` scope.

**Body**
```json
{
  "api_key": {
    "name": "CI pipeline (read-only)",
    "scope": "read",
    "expires_at": "2026-12-31T00:00:00.000Z"
  }
}
```

**Response 200** - full key metadata (no token).

**Response 403** - caller lacks `write` scope.

**Response 404** - key not found.

**Response 422** - validation failure.

---

## DELETE /api/v1/api-keys/:id

Soft-revokes the key. The record is retained for audit (`revoked_at` is set) and the key stops authenticating immediately. Requires a `write` scope.

**Response 200** - the revoked key's metadata (`active: false`, `revoked_at` set).

**Response 403** - caller lacks `write` scope.

**Response 404** - key not found.

---

For the full machine-readable spec see [`openapi.yaml`](openapi.yaml).
