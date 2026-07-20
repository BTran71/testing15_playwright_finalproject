import { Locator, Page } from "@playwright/test";
import { TimeOutConstants } from "../constants/TimeOutConstants";

export class BasePage {
  // thuộc tính
  protected page: Page;

  // constructor
  constructor(page: Page) {
    this.page = page;
  }

  // phương thức
  async inputText(
    locator: Locator,
    text: string,
    timeOut: number = TimeOutConstants.TIME_OUT_MEDIUM,
  ) {
    await locator.fill(text, { timeout: timeOut });
  }

  async click(
    locator: Locator,
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await locator.click({ timeout: timeOut });
  }

  // di chuyển chuột tới phần tử
  async hover(
    locator: Locator,
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await locator.hover({ timeout: timeOut });
  }

  async press(
    keyboard: string,
    locator: Locator,
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await locator.press(keyboard, { timeout: timeOut });
  }

  /**
   * Chờ 1 response API có URL chứa urlPart. Không lọc theo status code vì
   * API của site trả status lỗi khi không có dữ liệu nhưng vẫn là tín hiệu
   * "đã xử lý xong". Quá timeout thì bỏ qua (trang không gọi lại API).
   */
  async waitForApiResponse(
    urlPart: string,
    timeOut: number = TimeOutConstants.TIME_OUT_API,
  ): Promise<void> {
    await this.page
      .waitForResponse((res) => res.url().includes(urlPart), {
        timeout: timeOut,
      })
      .catch(() => {});
  }

  /** lấy URL hiện tại của trang và chuyển các ký tự đã bị mã hóa trong URL về dạng dễ đọc. */
  getDecodedUrl(): string {
    try {
      return decodeURIComponent(this.page.url());
    } catch {
      return this.page.url();
    }
  }
}
