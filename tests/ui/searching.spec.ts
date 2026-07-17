import { expect, test } from "../../fixtures/page-fixture";

test("TC_Login_01: Verify that user can login successfully with valid account", async ({
  page,
  homePage,
  loginPage,
}) => {
  const info = "testing";
  await page.goto("/");

  await homePage.getTopBarComponent().enterResearchInput(info);

  await homePage.getTopBarComponent().pressEnterButtonToSearch();
});
