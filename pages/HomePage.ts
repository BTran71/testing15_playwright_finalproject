import { CommonPage } from "./CommonPage";
import { Page } from "@playwright/test";
import { RouteConstants } from "../constants/RouteConstants";
import { TimeOutConstants } from "../constants/TimeOutConstants";

export class HomePage extends CommonPage {
  constructor(page: Page) {
    super(page);
  }

  //   phát triển thêm phương thức cho homepage

  /**
   * Mở trang chủ và chờ API load danh sách khóa học hoàn tất,
   * để response này không gây nhiễu cho lần chờ response khi search ngay sau đó.
   */
  async open(timeOut: number = TimeOutConstants.TIME_OUT_API) {
    const apiDone = this.waitForApiResponse(
      RouteConstants.API_COURSE_LIST,
      timeOut,
    );
    await this.page.goto(RouteConstants.HOME, {
      waitUntil: "domcontentloaded",
    });
    await apiDone;
  }
}
