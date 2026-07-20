import { Locator, Page } from "@playwright/test";
import { CommonPage } from "./CommonPage.ts";

export class RegisterPage extends CommonPage {
  private accountInput: Locator;
  private passwordInput: Locator;
  private phonenumberInput: Locator;
  private emailInput: Locator;
  private fullnameInput: Locator;
  private registerButton: Locator;
  private ddlGroupCode: Locator;
  private translateToLoginButoon: Locator;

  constructor(page: Page) {
    super(page);
    this.accountInput = page
      .locator(".sign-up-container")
      .getByPlaceholder("Tài khoản");
    this.passwordInput = page
      .locator(".sign-up-container")
      .getByPlaceholder("Mật khẩu");
    this.phonenumberInput = page.getByRole("textbox", {
      name: "Số điện thoại",
    });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.fullnameInput = page.getByRole("textbox", { name: "Họ tên" });
    this.registerButton = page
      .locator(".sign-up-container")
      .getByRole("button", { name: "Đăng ký" });
    this.ddlGroupCode = page.getByRole("combobox");
    this.translateToLoginButoon = page.locator("#signIn");
  }

  async enterAccountInput(account: string) {
    await this.accountInput.fill(account);
  }

  async enterPasswordInput(password: string) {
    await this.passwordInput.fill(password);
  }

  async enterPhoneNumber(phone: string) {
    await this.phonenumberInput.fill(phone);
  }

  async enterEmailInput(email: string) {
    await this.emailInput.fill(email);
  }

  async enterFullnameInput(fullname: string) {
    await this.fullnameInput.fill(fullname);
  }

  async chooseGroupCode() {
    const options = this.ddlGroupCode.locator("option");
    const count = await options.count();

    const randomIndex = Math.floor(Math.random() * (count - 1));

    const value = await options.nth(randomIndex).getAttribute("value");

    await this.ddlGroupCode.selectOption(value!);
  }

  async clickRegisterButton() {
    await this.registerButton.click();
  }

  async clickReturnLoginButton() {
    await this.translateToLoginButoon.click();
  }

  async selectGroupCodeDropDown(value: string) {
    await this.selectOption(this.ddlGroupCode, value);
    const texts = await this.ddlGroupCode.locator("option").allTextContents();

    console.log(texts);
  }

  async register(
    account: string,
    password: string,
    rePassword: string,
    email: string,
    fullname: string,
    groupCode: string,
  ) {
    await this.enterAccountInput(account);
    await this.enterFullnameInput(fullname);
    await this.enterPasswordInput(password);
    await this.enterEmailInput(email);
    await this.enterPhoneNumber(rePassword);
    await this.chooseGroupCode();
    await this.clickRegisterButton();
    await this.clickReturnLoginButton();
    await this.selectGroupCodeDropDown(groupCode);
  }
}
