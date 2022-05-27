import { expect, test } from "@playwright/test";
import { validateLinksInPage } from "../helpers/utilities";

test.describe("Parse links", () => {
  test("Parse all links and check if they are < 400", async ({
    page,
    request,
  }) => {
    await page.goto("https://developer.mozilla.org/");
    await validateLinksInPage(page, request);
  });

  test("Set geolocation and evaluate it in browser context", async ({
    page,
  }) => {
    const geolocation = { latitude: 59.95, longitude: 30.31667 };

    await page.context().grantPermissions(["geolocation"]);
    await page.context().setGeolocation(geolocation);

    await page.goto("https://developer.mozilla.org/en-US/docs/Web/API");

    await page.locator("text=Geolocation API").click();

    await expect(page.locator("h1")).toContainText("Geolocation API");

    await page.locator("text=Using the Geolocation API").first().click();

    const contextGeolocation = await page.evaluate(
      () =>
        new Promise((resolve) =>
          navigator.geolocation.getCurrentPosition((position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          })
        )
    );

    expect(geolocation).toEqual(contextGeolocation);
  });

});
