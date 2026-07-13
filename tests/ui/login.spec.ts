import { expect, test } from "../../fixtures/page-fixture";

test("TC_Login_01: Verify that user can login successfully with valid account", async ({
  page,
  homePage,
  loginPage,
}) => {
  const account = "testing142";
  const password = "testing142";
  await page.goto("/");
  await homePage.getTopBarComponent().navigateToCoursePage();
  await homePage.getTopBarComponent().navigateToLoginPage();

  await loginPage.enterAccounttInput(account);

  await loginPage.enterPasswordInput(password);

  await loginPage.clickLoginButton();

  const successLbl = page.getByRole("heading", {
    name: "Đăng nhập thành công",
  });
  await expect(successLbl).toBeVisible();
});
