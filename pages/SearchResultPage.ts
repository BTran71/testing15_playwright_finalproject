import { Locator, Page } from "@playwright/test";
import { CourseListingPage } from "./CourseListingPage";

/**
 * SearchResultPage: trang kết quả tìm kiếm (/timkiem/<tuKhoa>).
 */
export class SearchResultPage extends CourseListingPage {
  constructor(page: Page) {
    super(page);
  }

  /** True nếu không có khóa học nào khớp từ khóa. */
  async hasNoResult(): Promise<boolean> {
    return (await this.courseCount()) === 0;
  }
}
