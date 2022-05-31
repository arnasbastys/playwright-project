import { APIRequestContext, Page, APIResponse } from "@playwright/test";

export const validateLinksInPage = async (
  page: Page,
  request: APIRequestContext
) => {
  const hrefs = await page.evaluate(async () => {
    return Array.from(document.links).map((item) => item.href);
  });

  console.log({ "Checking links": hrefs });

  const linkArray = hrefs
    .filter((link) =>
      link.startsWith("mailto")
        ? console.log({ "Email address not a link": link })
        : link
    )
    .map((link) => {
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

export const randomCoordinate = () => {
  const randomLongtitude = parseFloat((Math.random() * 360 - 180).toFixed(5));
  const randomLatitude = parseFloat((Math.random() * 180 - 90).toFixed(5));

  return { latitude: randomLatitude, longitude: randomLongtitude };
};
