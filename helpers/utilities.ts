import { APIRequestContext, Page, APIResponse } from "@playwright/test";

export const validateLinksInPage = async (
  page: Page,
  request: APIRequestContext
) => {
  const hrefs = await page.evaluate(async () => {
    return Array.from(document.links).map((item) => item.href);
  });

  console.log({ "Checking links": hrefs });

  const linkArray = hrefs.map((link) => {
    return request.get(link);
  });

  const results = await Promise.all(linkArray.map((p) => p.catch((e) => e)));

  const validResults = results.filter((result) =>
    result instanceof Error
      ? console.log({ "Failed requests": result })
      : result
  );

  validResults.forEach((response: APIResponse) => {
    if (response.status() > 399) {
      console.log({
        "URL with status higher than 399": response.status(),
        URL: response.url(),
      });
    }
  });
};
