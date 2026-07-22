import { Locator, Page } from "@playwright/test";
import { CourseListingPage } from "./CourseListingPage";
import { RouteConstants } from "../constants/RouteConstants";
import { TimeOutConstants } from "../constants/TimeOutConstants";

/**
 * CourseCatalogPage: trang "Danh sách khóa học" (/khoahoc).
 * Kế thừa lưới card từ CourseListingPage; bổ sung banner, khu thống kê,
 * thanh phân trang (ul.paginationPages) và vòng tròn loading (#preloader).
 * Dữ liệu đổ qua API phân trang LayDanhSachKhoaHoc_PhanTrang (12 card/trang).
 */
export class CourseCatalogPage extends CourseListingPage {
  private readonly pagination: Locator;
  private readonly preloader: Locator;
  private readonly statsBoxes: Locator;
  private readonly header: Locator;
  private readonly banner: Locator;

  constructor(page: Page) {
    super(page);
    this.pagination = page.locator("ul.paginationPages");
    this.preloader = page.locator("#preloader");
    this.statsBoxes = page.locator(".coursesBoxItem");
    this.header = page.locator("section.header");
    this.banner = page.locator("div.titleCourse");
  }

  /**
   * Mở trang /khoahoc và chờ lưới card render khớp data API phân trang.
   * Cửa sổ chờ response dùng TIME_OUT_MEDIUM (15s) vì tính từ TRƯỚC khi goto:
   * phải gánh cả thời gian goto + boot app + gọi API trên site demo chậm.
   */
  async open(timeOut: number = TimeOutConstants.TIME_OUT_MEDIUM) {
    const apiDone = this.waitForApiResponse(
      RouteConstants.API_COURSE_LIST_PAGED,
      timeOut,
    );
    await this.page.goto(RouteConstants.COURSE_LIST, {
      waitUntil: "domcontentloaded",
    });
    await this.waitForCountToMatchResponse(this.courseLinks, await apiDone);
  }

  // ===== banner, thống kê, header, loading =====
  /** Khối banner div.titleCourse: <h3>Khóa học</h3><p>Bắt đầu hành trình nào!!!</p>
   *  (DOM viết thường, CSS uppercase hóa khi hiển thị). */
  getBanner(): Locator {
    return this.banner;
  }

  getBannerTitle(): Locator {
    return this.banner.locator("h3");
  }

  getBannerSubtitle(): Locator {
    return this.banner.locator("p");
  }

  /** 6 ô thống kê (Chương trình học, Nhà sáng tạo...). */
  getStatsBoxes(): Locator {
    return this.statsBoxes;
  }

  getHeader(): Locator {
    return this.header;
  }

  /** Vòng tròn loading hiển thị trong lúc gọi API (#preloader). */
  getPreloader(): Locator {
    return this.preloader;
  }

  // ===== thanh phân trang =====
  getPagination(): Locator {
    return this.pagination;
  }

  getPrevButton(): Locator {
    return this.pagination.getByRole("button", { name: "Previous page" });
  }

  getNextButton(): Locator {
    return this.pagination.getByRole("button", { name: "Next page" });
  }

  /** Dấu "..." trên thanh phân trang. */
  getDotsButton(): Locator {
    return this.pagination
      .getByRole("button")
      .filter({ hasText: /^\.\.\.$/ })
      .first();
  }

  /** Nút số trang n (trang active có aria-label "... is your current page"). */
  getPageButton(n: number): Locator {
    return this.pagination.getByRole("button", {
      name: new RegExp(`^Page ${n}( is your current page)?$`),
    });
  }

  /** Số trang đang active trên thanh phân trang. */
  async getActivePageNumber(): Promise<number> {
    const text = await this.pagination.locator("li.active a").textContent();
    return Number(text?.trim());
  }

  /** Số trang cuối cùng (số đứng ngay trước nút "Sau"). */
  async getLastPageNumber(): Promise<number> {
    const text = await this.pagination
      .locator("li:nth-last-child(2) a")
      .textContent();
    return Number(text?.trim());
  }

  /** Click 1 điều khiển phân trang và chờ danh sách tải lại khớp data API. */
  private async clickAndWaitReload(
    control: Locator,
    timeOut: number = TimeOutConstants.TIME_OUT_API,
  ) {
    const apiDone = this.waitForApiResponse(
      RouteConstants.API_COURSE_LIST_PAGED,
      timeOut,
    );
    await control.click();
    await this.waitForCountToMatchResponse(this.courseLinks, await apiDone);
  }

  async goToPage(n: number) {
    await this.clickAndWaitReload(this.getPageButton(n));
  }

  async goToNextPage() {
    await this.clickAndWaitReload(this.getNextButton());
  }

  async goToPreviousPage() {
    await this.clickAndWaitReload(this.getPrevButton());
  }

  async clickPaginationDots() {
    await this.clickAndWaitReload(this.getDotsButton());
  }

  /** Reload trang (F5) và chờ danh sách tải lại. */
  async reload() {
    const apiDone = this.waitForApiResponse(
      RouteConstants.API_COURSE_LIST_PAGED,
    );
    await this.page.reload({ waitUntil: "domcontentloaded" });
    await this.waitForCountToMatchResponse(this.courseLinks, await apiDone);
  }

  /** Bấm Back của trình duyệt để quay lại danh sách và chờ tải lại. */
  async goBackToList() {
    const apiDone = this.waitForApiResponse(
      RouteConstants.API_COURSE_LIST_PAGED,
    );
    await this.page.goBack({ waitUntil: "domcontentloaded" });
    await this.waitForCountToMatchResponse(this.courseLinks, await apiDone);
  }
}
