import { expect, test } from "../../fixtures/page-fixture";

test("Verify register function with POM(Page Object Model)", async ({
  page,
  homePage,
  loginPage,
  registerPage,
}) => {
  const account = crypto.randomUUID();
  const password = "testing15_playwright";
  const fullname = "Testing playwright";
  const email = `${account}@gmail.com`;
  const phoneNumber = Math.random().toString().slice(2, 12);

  await page.goto("/");
  await homePage.getTopBarComponent().navigateToLoginPage();

  await loginPage.clickTranslateRegisterButton();

  await registerPage.enterAccountInput(account);

  await registerPage.enterFullnameInput(fullname);

  await registerPage.enterPasswordInput(password);

  await registerPage.enterEmailInput(email);

  await registerPage.enterPhoneNumber(phoneNumber);

  await registerPage.chooseGroupCode();

  await registerPage.clickRegisterButton();

  const successLbl = page.getByRole("heading", { name: "Đăng ký thành công" });
  await expect(successLbl).toBeVisible();
});
