import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";
import { TimeOutConstants } from "../../constants/TimeOutConstants";
import { test, expect } from "@playwright/test";
import { RouteConstants } from "../../constants/RouteConstants";
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

  async navigateToLoginPage(
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    // ,,
    // await this.lnkLogin.click();
    await this.click(this.lnkLogin, timeOut);
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
    await this.hover(this.ddlCategory, timeOut);
  }

  /**
   * Ô tìm kiếm hiện hành theo viewport (desktop: .searchForm / mobile: .searchFormMobile
   * — cả hai cùng placeholder "Tìm kiếm", getByRole chỉ khớp ô đang hiển thị).
   */
  getSearchInput(): Locator {
    return this.searchInput;
  }

  async enterResearchInput(info: string) {
    await this.searchInput.fill(info);
  }

  async pressEnterButtonToSearch() {
    await this.searchInput.press("Enter");
  }
  // async chooseCourse(timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT) {}

  /**
   * Nhấn Enter để search và chờ KẾT QUẢ THẬT về:
   * trang kết quả render sẵn "Hiển thị 0 kết quả" trong lúc API đang chạy,
   * nên phải đăng ký chờ response TRƯỚC khi nhấn Enter rồi mới chờ nó về.
   */
  async submitSearchAndWaitResults() {
    const apiDone = this.page
      .waitForResponse(
        (res) => res.url().includes(RouteConstants.API_COURSE_LIST),
        { timeout: TimeOutConstants.TIME_OUT_API },
      )
      .catch(() => null); // trang không refetch (data có sẵn) thì bỏ qua
    await this.pressEnterButtonToSearch();
    await apiDone;
    await this.page.waitForTimeout(300); // chờ React render danh sách sau khi có data
  }

  /** Tìm kiếm trọn gói: nhập từ khóa -> Enter -> chờ kết quả thật. */
  async searchCourse(keyword: string) {
    await this.enterResearchInput(keyword);
    await this.submitSearchAndWaitResults();
  }

  /**
   * Click vào icon kính lúp của ô search
   */
  async clickSearchIcon() {
    const box = await this.searchInput.boundingBox();
    if (!box) throw new Error("Không lấy được vị trí ô tìm kiếm");
    await this.searchInput.click({
      position: { x: box.width - 10, y: box.height / 2 },
    });
  }

  /** Xóa toàn bộ nội dung trong ô tìm kiếm */
  async clearSearchInput() {
    await this.searchInput.fill("");
  }
  // async chooseCourse(timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT) {}
}
