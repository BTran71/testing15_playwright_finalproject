import { CommonPage } from "./CommonPage";
import { Page } from "@playwright/test";
import { RouteConstants } from "../constants/RouteConstants";

export class HomePage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  //   phát triển thêm phương thức cho homepage

  /**
   * Mở trang chủ và chờ API load danh sách khóa học hoàn tất,
   * để response này không gây nhiễu cho lần chờ response khi search ngay sau đó.
   */
  async open() {
    await this.page.goto(RouteConstants.HOME, {
      waitUntil: "domcontentloaded",
    });
    await this.waitForApiResponse(RouteConstants.API_COURSE_LIST);
  }
}
