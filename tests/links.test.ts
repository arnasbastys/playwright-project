import { test } from '@playwright/test';
import { validateLinksInPage } from '../helpers/utilities'


test.describe('Parse links', () => {
  test('Parse all links and check if they are < 400', async ({ page, request }) => {
    await page.goto('https://www.w3.org/standards/');

    await validateLinksInPage(page, request)

  });



});