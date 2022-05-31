import { expect, test } from "@playwright/test";
import { randomCoordinate, validateLinksInPage } from "../helpers/utilities";

test.describe("Parse links", () => {
  test("Validate links and screenshot of personal landing page", async ({
    page,
    request,
  }) => {
    await page.goto("https://arnasbastys.lt/dist/");
    await validateLinksInPage(page, request);
    await expect(page).toHaveScreenshot();
  });

  test("Set geolocation and evaluate it in browser context", async ({
    page,
  }) => {
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
  
  test("Test todo list with websockets", async ({page}) => {
    await page.goto("http://todomvc-socketstream.herokuapp.com");

    page.on('websocket', ws => {
      console.log(`WebSocket opened: ${ws.url()}>`);
    });

    await page.fill('#new-todo', 'Websocket test');

    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Enter')

    await expect(page.locator('#todo-list li').last()).toHaveText('Websocket test')
  })

});
