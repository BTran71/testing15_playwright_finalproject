import { expect, test } from "../../fixtures/page-fixture";
test.describe("Login Page Test", () => {
  let account;
  let password;
  test.beforeEach(async ({ page, homePage }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await homePage.getTopBarComponent().navigateToLoginPage();
  });
  test("TC_Login_01: Verify login function when account textbox is empty", async ({
    page,
    loginPage,
  }) => {
    password = "testing142";

    await loginPage.enterPasswordInput(password);

    await loginPage.clickLoginButton();

    const successLbl = page.getByText("Tài khoản hoặc mật khẩu không");
    await expect(successLbl).toBeVisible();
  });

  test("TC_Login_02: Verify login function when the account is not registed", async ({
    page,
    loginPage,
  }) => {
    account = "ngochien897";
    password = "Ngochien846%";

    await loginPage.enterAccounttInput(account);

    await loginPage.enterPasswordInput(password);

    await loginPage.clickLoginButton();

    const successLbl = page.getByText("Tài khoản hoặc mật khẩu không");
    await expect(successLbl).toBeVisible();
  });

  test("TC_Login_03: Verify login function when password textbox is empty", async ({
    page,
    loginPage,
  }) => {
    account = "testing15";

    await loginPage.enterAccounttInput(account);

    await loginPage.clickLoginButton();

    const successLbl = page.getByText("Tài khoản hoặc mật khẩu không");
    await expect(successLbl).toBeVisible();
  });

  test("TC_Login_04: Verify login function when the password is incorrect", async ({
    page,
    loginPage,
  }) => {
    account = "hienle456";
    password = "testing5";

    await loginPage.enterAccounttInput(account);

    await loginPage.enterPasswordInput(password);

    await loginPage.clickLoginButton();

    const successLbl = page.getByText("Tài khoản hoặc mật khẩu không");
    await expect(successLbl).toBeVisible();
  });

  test("TC_Login_05: Verify that user can login successfully with valid account", async ({
    page,
    loginPage,
  }) => {
    account = "bao1234567";
    password = "Caocon7102002@";

    await loginPage.enterAccounttInput(account);

    await loginPage.enterPasswordInput(password);

    await loginPage.clickLoginButton();

    const successLbl = page.getByRole("link").filter({ hasText: /^$/ }).nth(1);
    await expect(successLbl).toBeVisible();
  });

  test("TC_Login_06: Verify when user click forget password link", async ({
    page,
    loginPage,
  }) => {
    await loginPage.clickForgetPasswordLink();

    const successLbl = page.getByRole("heading", { name: "Quên mật khẩu" });
    await expect(successLbl).toBeVisible();
  });

  test("TC_Login_07: Verify when user click register button", async ({
    page,
    loginPage,
  }) => {
    await loginPage.clickTranslateRegisterButton();
    const successLbl = page.getByRole("heading", { name: "ĐĂNG KÝ" });
    await expect(successLbl).toBeVisible();
  });
});
