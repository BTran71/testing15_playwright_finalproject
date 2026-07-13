import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { TimeOutConstants } from "../../constants/TimeOutConstants";
import { test, expect } from "@playwright/test";
export class TopBarComponent extends BasePage {
  private lnkLogin: Locator;
  private lnkCourse: Locator;
  private lnkBlog: Locator;
  private lnkEvent: Locator;
  private lnkInformation: Locator;
  private ddlCategory: Locator;
  private searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.lnkLogin = page.getByRole("button", { name: "Đăng nhập" });
    this.ddlCategory = page.getByRole("link", { name: "Danh mục" });
    this.lnkCourse = page.getByRole("link", { name: "Khóa học", exact: true });
    this.lnkBlog = page.getByRole("link", { name: "Blog" });
    this.lnkEvent = page.getByRole("link", { name: "Sự kiện", exact: true });
    this.lnkInformation = page.getByRole("link", { name: "Thông tin" });
    this.searchInput = page.getByRole("textbox", { name: "Tìm kiếm" });
  }

  async navigateToLoginPage() {
    // timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
    await this.lnkLogin.click();

    // await this.click(this.lnkLogin, timeOut);
  }

  async navigateToBlogPage(
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await this.click(this.lnkBlog, timeOut);
  }

  async navigateToEventPage(
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await this.click(this.lnkEvent, timeOut);
  }

  async navigateToInformationPage(
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await this.click(this.lnkInformation, timeOut);
  }

  async navigateToCoursePage(
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await this.click(this.lnkCourse, timeOut);
  }

  async hoverCategory(timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT) {
    await this.ddlCategory.hover();
  }

  async enterResearchInput(info: string) {
    await this.searchInput.fill(info);
  }

  async pressEnterButtonToSearch() {
    await this.searchInput.press("Enter");
  }
  // async chooseCourse(timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT) {}
}
