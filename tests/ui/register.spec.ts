import { expect, test } from "../../fixtures/page-fixture";
test.describe("Register Page Test", () => {
  const usedUsernames = new Set<string>();
  let account; // crypto.randomUUID();

  let password;
  let fullname;
  let email;
  const secondDigits = ["5", "7", "8", "9"];
  let phoneNumber =
    "0" +
    secondDigits[Math.floor(Math.random() * secondDigits.length)] +
    Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
  function generateAccount(length: number): string {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

    while (true) {
      let username = "";

      for (let i = 0; i < length; i++) {
        username += chars[Math.floor(Math.random() * chars.length)];
      }

      if (!usedUsernames.has(username)) {
        usedUsernames.add(username);
        return username;
      }
    }
  }

  test.beforeEach(async ({ page, homePage }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await homePage.getTopBarComponent().navigateToLoginPage();
  });

  test("RTC_01: Verify register function when account input is empty", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `example@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Tài khoản không được để trống");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_02: Verify register function when typing 1 character in account input ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(1);
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `example@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Tài khoản quá ít kí tự");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_03: Verify register function when typing 2 characters in account input ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(2);
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `${account}@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Đăng kí thành công");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_04: Verify register function when typing 3 characters in account input ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(3);
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `${account}@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Đăng kí thành công");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_05: Verify register function when typing 15 characters in account input ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(15);
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `${account}@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Đăng kí thành công");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_06: Verify register function when typing 16 characters in account input ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(16);
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `${account}@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Đăng kí thành công");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_07: Verify register function when typing 17 characters in account input ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(17);
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `${account}@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Tài khoản quá 16 kí tự");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_08: Verify the account textbox when only whitespace is entered ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = "         ";
    password = "Testing15@";
    fullname = "Testing playwright";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Tài khoản không được là khoảng trắng");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_09: Verify login function when the account was existed ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = "tran123";
    password = "Testing15@";
    fullname = "Testing playwright";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Tài khoản đã tồn tại!");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_10: Verify login function when the fullname textbox was empty ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    password = "Testing15@";
    email = `${account}` + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Tên không được để trống");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_11: Verify login function when the fullname textbox was number ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "222222";
    password = "Testing15@";
    email = `${account}` + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Chỉ nhập kí tự chữ");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_12: Verify login function when the fullname textbox was special sympols ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "%^*@";
    password = "Testing15@";
    email = `${account}` + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Chỉ nhập kí tự chữ");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_13: Verify the fullname textbox when only whitespace is entered ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    password = "Testing15@";
    fullname = "      ";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Tên không được là khoảng trắng!");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_14: Verify login function when password textbox was empty ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Mật khẩu không được để trống");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_15: Verify login function when typing 1 character in password textbox ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "T";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText(
      "Mật khẩu phải ít nhất 8 tự gồm chữ, số, và kí tự đặc biệt",
    );
    await expect(successLbl).toBeVisible();
  });

  test("RTC_16: Verify login function when typing 7 characters in password textbox ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "Tran123";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText(
      "Mật khẩu phải ít nhất 8 tự gồm chữ, số, và kí tự đặc biệt",
    );
    await expect(successLbl).toBeVisible();
  });

  test("RTC_17: Verify login function when typing 8 characters in password textbox ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "Tran123@";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Đăng kí thành công");
    await expect(successLbl).toBeVisible();
  });
  test("RTC_18: Verify login function when typing 9 characters in password textbox ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "Tran1234@";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Đăng kí thành công");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_19: Verify login function when only typing number in password textbox ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "11111111";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText(
      "Mật khẩu phải ít nhất 8 tự gồm chữ, số, và kí tự đặc biệt",
    );
    await expect(successLbl).toBeVisible();
  });

  test("RTC_20: Verify login function when only typing word in password textbox ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "khohanhla";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText(
      "Mật khẩu phải ít nhất 8 tự gồm chữ, số, và kí tự đặc biệt",
    );
    await expect(successLbl).toBeVisible();
  });

  test("RTC_21: Verify login function when only typing special symbols in password textbox ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "%^&$#@!*";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText(
      "Mật khẩu phải ít nhất 8 tự gồm chữ, số, và kí tự đặc biệt",
    );
    await expect(successLbl).toBeVisible();
  });

  test("RTC_22: Verify the password textbox when only whitespace is entered ", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    fullname = "Testing playwright";
    password = "           ";
    email = generateAccount(5) + `@gmail.com`;

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText(
      "Mật khẩu phải ít nhất 8 tự gồm chữ, số, và kí tự đặc biệt",
    );
    await expect(successLbl).toBeVisible();
  });

  test("RTC_23: Verify register function when email textbox is empty", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    password = "Testing15@";
    fullname = "Testing playwright";

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Email không được để trống");
    await expect(successLbl).toBeVisible();
  });

  test("RTC_24: Verify register function when email textbox is not correct", async ({
    page,
    loginPage,
    registerPage,
  }) => {
    account = generateAccount(5);
    password = "Testing15@";
    fullname = "Testing playwright";
    email = `${account}` + "$gmail.com";

    await loginPage.clickTranslateRegisterButton();

    await registerPage.enterAccountInput(account);

    await registerPage.enterFullnameInput(fullname);

    await registerPage.enterPasswordInput(password);

    await registerPage.enterEmailInput(email);

    await registerPage.enterPhoneNumber(phoneNumber);

    await registerPage.chooseGroupCode();

    await registerPage.clickRegisterButton();

    const successLbl = page.getByText("Email không hợp lệ");
    await expect(successLbl).toBeVisible();
  });
});
