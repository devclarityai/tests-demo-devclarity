import { test, expect } from "@playwright/test";
import { testUsers } from "@fixtures/test-data";
import { getCsrfToken } from "@helpers/csrf.helper";

test.use({ storageState: { cookies: [], origins: [] } });

test("GET /session/new", async ({ request }) => {
  const baseUrl = process.env.BASE_URL;
  const response = await request.get(baseUrl + "/session/new");

  await expect(response).toBeOK();
});

test("POST /session - valid credentials", async ({ request }) => {
  const baseUrl = process.env.BASE_URL;
  const csrfToken = await getCsrfToken(request, baseUrl + "/session/new");
  const response = await request.post(baseUrl + "/session", {
    form: {
      authenticity_token: csrfToken,
      email_address: testUsers.testUser.email,
      password: testUsers.testUser.password,
    },
  });

  await expect(response).toBeOK();
  expect(response.url()).not.toContain("/session/new");
});

test("POST /session - invalid credentials", async ({ request }) => {
  const baseUrl = process.env.BASE_URL;
  const csrfToken = await getCsrfToken(request, baseUrl + "/session/new");
  const response = await request.post(baseUrl + "/session", {
    form: {
      authenticity_token: csrfToken,
      email_address: "invalid@example.com",
      password: "wrongpassword",
    },
  });

  expect(response.url()).toContain("/session");
});
