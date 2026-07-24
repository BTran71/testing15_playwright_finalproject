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
  /** Link chi tiết khóa học trên trang kết quả — cùng selector với CourseListingPage. */
  private resultCourseLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.lnkLogin = page.getByRole("button", { name: "Đăng nhập" });
    this.ddlCategory = page.getByRole("link", { name: "Danh mục" });
    this.lnkCourse = page.getByRole("link", { name: "Khóa học", exact: true });
    this.lnkBlog = page.getByRole("link", { name: "Blog" });
    this.lnkEvent = page.getByRole("link", { name: "Sự kiện", exact: true });
    this.lnkInformation = page.getByRole("link", { name: "Thông tin" });
    this.searchInput = page.getByRole("textbox", { name: "Tìm kiếm" });
    this.resultCourseLinks = page.locator('a[href*="/chitiet/"]');
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

  // ===== getters cho các test kiểm tra hiển thị header =====
  getLogo(): Locator {
    return this.page.locator(".textLogo img");
  }
  getCategoryLink(): Locator {
    return this.ddlCategory;
  }
  getCourseLink(): Locator {
    return this.lnkCourse;
  }
  getBlogLink(): Locator {
    return this.lnkBlog;
  }
  getEventLink(): Locator {
    return this.lnkEvent;
  }
  getInformationLink(): Locator {
    return this.lnkInformation;
  }
  getLoginButton(): Locator {
    return this.lnkLogin;
  }

  /** 6 link lĩnh vực trong dropdown menu DANH MỤC (menu desktop). */
  getCategoryMenuItems(): Locator {
    return this.page.locator('.menuHeader a[href^="/danhmuckhoahoc/"]');
  }

  /** Link 1 lĩnh vực trong dropdown DANH MỤC theo mã danh mục. */
  getCategoryMenuItem(categoryCode: string): Locator {
    return this.page.locator(
      `.menuHeader a[href="${RouteConstants.category(categoryCode)}"]`,
    );
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

  async submitSearchAndWaitResults(
    apiTimeOut: number = TimeOutConstants.TIME_OUT_API,
    renderTimeOut: number = TimeOutConstants.TIME_OUT_RENDER,
  ) {
    const apiDone = this.waitForApiResponse(
      [RouteConstants.API_COURSE_LIST, "tenKhoaHoc="],
      apiTimeOut,
    );
    await this.pressEnterButtonToSearch();
    const response = await apiDone;

    // chờ đã điều hướng sang trang kết quả để không đếm nhầm card của trang chủ
    await this.page
      .waitForURL(/\/timkiem\//, { timeout: apiTimeOut })
      .catch(() => {});

    await this.waitForCountToMatchResponse(
      this.resultCourseLinks,
      response,
      renderTimeOut,
    );
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
