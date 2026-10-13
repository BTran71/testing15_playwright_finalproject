import { Locator, Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";

export class LoginPage extends CommonPage {
  private accountInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private translateToRegisterButton: Locator;
  private lnkForgetPassword: Locator;

  constructor(page: Page) {
    super(page);
    this.accountInput = page
      .locator("form")
      .filter({ hasText: "Đăng nhậphoặc sử dụng tài kho" })
      .getByPlaceholder("Tài khoản");
    this.passwordInput = page
      .locator("form")
      .filter({ hasText: "Đăng nhậphoặc sử dụng tài kho" })
      .getByPlaceholder("Mật khẩu");
    this.loginButton = page
      .locator("form")
      .filter({ hasText: "Đăng nhậphoặc sử dụng tài kho" })
      .getByRole("button");
    this.lnkForgetPassword = page.getByRole("link", { name: "Quên mật khẩu?" });
    this.translateToRegisterButton = page.locator("#signUp");
  }

  async enterAccounttInput(account: string) {
    // await this.accountInput.fill(account);
    await this.inputText(this.accountInput, account);
  }
  async enterPasswordInput(password: string) {
    // await this.passwordInput.fill(password);
    await this.inputText(this.passwordInput, password);
  }

  async clickLoginButton() {
    // await this.loginButton.click();
    await this.click(this.loginButton);
  }

  async clickForgetPasswordLink() {
    // await this.lnkForgetPassword.click();
    await this.click(this.lnkForgetPassword);
  }

  async clickTranslateRegisterButton() {
    // await this.translateToRegisterButton.click();
    await this.click(this.translateToRegisterButton);
  }

  async login(account: string, password: string) {
    await this.enterAccounttInput(account);
    await this.enterPasswordInput(password);
    await this.clickLoginButton();
    // await this.clickForgetPasswordLink();
    // await this.clickTranslateRegisterButton();
  }
}
