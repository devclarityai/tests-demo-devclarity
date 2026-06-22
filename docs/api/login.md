# API v1 - Login (token issuance)

Exchange a user's email + password for a short-lived bearer token, with no browser cookie involved. Useful for scripts and integrations that authenticate once and then call the API.

## How it differs from an API key

| | Login token | API key |
|---|---|---|
| Obtained via | `POST /api/v1/login` (email + password) | `POST /api/v1/api-keys` (write key or session) |
| Lifetime | 10 minutes | Until revoked / expired |
| Access | Same as the user's browser session (no scope gate) | Scope-limited (`read` or `write`) |
| Shown | Once, in the login response | Once, at creation |
| Use | `Authorization: Bearer <token>` | `Authorization: Bearer sk_...` |

Both are passed as `Authorization: Bearer <token>` and authenticate the same set of endpoints.

---

## POST /api/v1/login

Authenticates credentials and returns a 10-minute bearer token.

**Headers**
```
Content-Type: application/json
```

**Body**
```json
{ "email_address": "admin@example.com", "password": "adminpassword123" }
```

**Response 201**
```json
{
  "token": "0rY5yFM0JsJK1LoLowjhI2GJOjWvhZ15AcwZGxte7-M",
  "token_type": "Bearer",
  "expires_at": "2026-06-21T20:49:30.782Z"
}
```

**Response 401** - invalid credentials
```json
{ "error": "Invalid email or password" }
```

### Example

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email_address":"admin@example.com","password":"adminpassword123"}' \
  | ruby -rjson -e 'puts JSON.parse(STDIN.read)["token"]')

curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/v1/resources
```

---

## DELETE /api/v1/logout

Revokes the login token used to make the request. The token stops authenticating immediately. No-op for cookie or API-key callers.

**Headers**
```
Authorization: Bearer <login token>
```

**Response 204** - no content.

**Response 401** - no valid credential on the request.

---

For the full machine-readable spec see [`openapi.yaml`](openapi.yaml).
