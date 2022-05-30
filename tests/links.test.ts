import { expect, test } from "@playwright/test";
import { randomBytes } from "crypto";
import internal from "stream";
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

    const randomCoordinate = () => {
      const randomLongtitude = parseFloat((Math.random() * 360 - 180).toFixed(5))
      const randomLatitude = parseFloat((Math.random() * 180 - 90).toFixed(5))

      return { latitude: randomLatitude, longitude: randomLongtitude };
    };

    const geolocation = randomCoordinate();

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
