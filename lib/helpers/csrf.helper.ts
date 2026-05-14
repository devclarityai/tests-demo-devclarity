import { APIRequestContext } from "@playwright/test";

export async function getCsrfToken(
  request: APIRequestContext,
  url: string,
): Promise<string> {
  const response = await request.get(url);
  const html = await response.text();
  const match = html.match(/name="authenticity_token"\s+value="([^"]+)"/);
  if (!match) throw new Error(`No CSRF token found at ${url}`);
  return match[1];
}
