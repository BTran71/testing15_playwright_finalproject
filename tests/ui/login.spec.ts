import { expect, test } from "../../fixtures/page-fixture";
test.describe.serial("TC01: Login Page Test", () => {
  let account;
  let password;
  test("TC_Login_01: Verify that user can login successfully with valid account", async ({
    page,
    homePage,
    loginPage,
  }) => {
    account = "testing142";
    password = "testing142";
    await page.goto("/");
    
    // await homePage.getTopBarComponent().navigateToCoursePage();
    await homePage.getTopBarComponent().navigateToLoginPage();

    await loginPage.enterAccounttInput(account);

    await loginPage.enterPasswordInput(password);

    await loginPage.clickLoginButton();

    const successLbl = page.getByRole("heading", {
      name: "Đăng nhập thành công",
    });
    await expect(successLbl).toBeVisible();
  });
});
