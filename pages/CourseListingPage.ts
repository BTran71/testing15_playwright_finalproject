import { Locator, Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";

/**
 * CourseListingPage: lớp cơ sở cho MỌI trang hiển thị lưới khóa học
 * (danh sách khóa học, kết quả tìm kiếm, khóa học theo danh mục).
 *
 * Điểm chung: mỗi card khóa học là/gói 1 link chi tiết dạng a[href*="/chitiet/"].
 * Số link chi tiết = số khóa học đang hiển thị.
 */
export class CourseListingPage extends CommonPage {
  protected readonly courseLinks: Locator;
  protected readonly courseCards: Locator;

  constructor(page: Page) {
    super(page);
    this.courseLinks = page.locator('a[href*="/chitiet/"]');
    this.courseCards = page.locator(".cardGlobal");
  }

  /** Tất cả link chi tiết khóa học đang hiển thị. */
  getCourseLinks(): Locator {
    return this.courseLinks;
  }

  getCourseCards(): Locator {
    return this.courseCards;
  }

  /** Số lượng khóa học đang hiển thị (đếm theo link chi tiết). */
  async courseCount(): Promise<number> {
    return this.courseLinks.count();
  }

  async waitForResults(timeout = 15000): Promise<void> {
    await this.page
      .waitForResponse(
        (res) =>
          res.url().includes("/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc") &&
          res.ok(),
        { timeout },
      )
      .catch(() => {}); // nếu trang không refetch (đã có sẵn data) thì bỏ qua
    await this.page
      .getByText(/Hi[eể]n th[iị]\s*\d+\s*k[eế]t qu/i)
      .first()
      .waitFor({ state: "visible", timeout })
      .catch(() => {});
    // chờ React render xong danh sách sau khi có data
    await this.page.waitForTimeout(300);
  }

  async resultLabelCount(): Promise<number> {
    const text = await this.page
      .getByText(/Hi[eể]n th[iị]\s*\d+\s*k[eế]t qu/i)
      .first()
      .textContent()
      .catch(() => null);
    const match = text?.match(/(\d+)/);
    return match ? Number(match[1]) : -1;
  }

  /** Lấy href của khóa học thứ i (0-based). */
  async getCourseHref(index = 0): Promise<string | null> {
    return this.courseLinks.nth(index).getAttribute("href");
  }

  /** Click vào khóa học thứ i để sang trang chi tiết. */
  async openCourse(index = 0): Promise<void> {
    await this.courseLinks.nth(index).click();
  }

  /**
   * dữ liệu thật của site có vài card với mã khóa học rỗng (vd href="/chitiet/").
   * Helper này trả về href đầu tiên có MÃ khóa học hợp lệ (>= 2 ký tự sau /chitiet/).
   */
  async getFirstRealCourseHref(): Promise<string> {
    const count = await this.courseLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await this.courseLinks.nth(i).getAttribute("href");
      if (href && /\/chitiet\/.{2,}/.test(href)) return href;
    }
    throw new Error("Không tìm thấy card khóa học có mã hợp lệ");
  }

  /** Click vào card khóa học đầu tiên có mã hợp lệ. */
  async openFirstRealCourse(): Promise<void> {
    const count = await this.courseLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await this.courseLinks.nth(i).getAttribute("href");
      if (href && /\/chitiet\/.{2,}/.test(href)) {
        await this.courseLinks.nth(i).click();
        return;
      }
    }
    throw new Error("Không tìm thấy card khóa học có mã hợp lệ để click");
  }
}
