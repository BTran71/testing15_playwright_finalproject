import { Locator, Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";

/** CourseDetailPage: trang chi tiết khóa học (/chitiet/<mã khóa học>). */
export class CourseDetailPage extends CommonPage {
  private readonly courseTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.courseTitle = page.locator("h4.titleDetailCourse");
  }

  /** Tên khóa học hiển thị trên trang chi tiết. */
  getCourseTitle(): Locator {
    return this.courseTitle;
  }

  /**
   * Giá trị trường "Lĩnh vực" trong khối giới thiệu khóa học
   * (cặp <p>Lĩnh vực</p><p>Lập trình Backend</p> trong .instrutorTitle).
   */
  getCategoryFieldValue(): Locator {
    return this.page
      .locator(".instrutorTitle")
      .filter({ hasText: "Lĩnh vực" })
      .locator("p")
      .nth(1);
  }
}
