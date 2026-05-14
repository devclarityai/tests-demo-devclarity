import type { Page, Request, Response, Locator } from "@playwright/test";

/**
 * Clicks an element and waits for a specific HTTP request/response, capturing both
 * @param page - Playwright page object
 * @param responseStatus - Expected HTTP status code (e.g., 200, 404)
 * @param url - URL fragment to match in the request/response (usually starts with "api/...")
 * @param elementToClick - The click action to perform (function or promise)
 * @returns Promise that resolves to an object with both request and response data
 * @example
 * const updateData = await clickAndGetAPIData(
 *   page,
 *   201,
 *   'api/products/*',
 *   homePage.addToCart.click()
 * );
 *
 * console.log('Request headers:', updateData.request.headers);
 * console.log('Response data:', updateData.response.data);
 */
export async function clickAndGetAPIData(
  page: Page,
  responseStatus: number,
  url: string,
  elementToClick: Locator,
  debug = false,
) {
  let capturedRequest: Request | null = null;

  // Small delay to ensure all html is loaded prior to clicking
  await page.waitForTimeout(1_000);

  // Set up request listener
  const requestListener = (request: Request) => {
    if (request.url().includes(url)) {
      capturedRequest = request;
      if (debug) {
        console.log(
          "[clickAndGetAPIData] Captured request:",
          request.method(),
          request.url(),
        );
      }
    }
  };
  page.on("request", requestListener);
  try {
    if (debug) {
      console.log(
        `[clickAndGetAPIData] Waiting for response status ${responseStatus} for URL including "${url}" and executing click action`,
      );
    }
    const [response] = await Promise.all([
      page.waitForResponse(
        (res: Response) =>
          res.url().includes(url) && res.status() === responseStatus,
      ),
      await elementToClick.click(),
    ]);
    if (!capturedRequest) {
      throw new Error(
        `[clickAndGetAPIData] No request captured for URL "${url}"`,
      );
    }
    const req: Request = capturedRequest as Request;
    if (debug) {
      console.log(
        "[clickAndGetAPIData] Response received:",
        response.status(),
        response.url(),
      );
    }

    // Safely parse request data
    let requestData = null;
    const postData = req.postData();
    if (postData && postData.trim() !== "") {
      try {
        requestData = JSON.parse(postData);
      } catch (error) {
        // If JSON parsing fails, keep the raw string
        if (debug)
          console.warn(
            "[clickAndGetAPIData] Failed to parse request postData as JSON. Using raw string.",
            error,
          );
        requestData = postData;
      }
    }
    if (debug) {
      try {
        console.log("[clickAndGetAPIData] Request headers:", req.headers());
      } catch (e) {
        console.warn("[clickAndGetAPIData] Failed to read request headers", e);
      }
      console.log("[clickAndGetAPIData] Request data:", requestData);
    }

    const respHeaders = response.headers();
    const isRedirect = responseStatus >= 300 && responseStatus < 400;
    const responseText = isRedirect ? null : await response.text();
    if (debug) {
      console.log("[clickAndGetAPIData] response headers:", respHeaders);
      const preview =
        responseText && responseText.length > 500
          ? responseText.slice(0, 500) + "…"
          : responseText;
      console.log("[clickAndGetAPIData] response data (preview):", preview);
    }

    // return request.headers, request.data, response.headers, response.data
    return {
      request: {
        headers: req.headers(),
        data: requestData,
      },
      response: {
        headers: respHeaders,
        data: responseText,
        // data: await response.json(), //this api only returns text so modifying this line
      },
    };
  } finally {
    page.off("request", requestListener);
  }
}
