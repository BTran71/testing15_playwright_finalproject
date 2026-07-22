import { expect, Locator, Page, Response } from "@playwright/test";
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
   * Chờ 1 response API có URL chứa urlPart.
   */
  waitForApiResponse(
    urlParts: string | string[],
    timeOut: number = TimeOutConstants.TIME_OUT_API,
  ): Promise<Response | null> {
    const parts = Array.isArray(urlParts) ? urlParts : [urlParts];
    return this.page
      .waitForResponse(
        (res) => parts.every((part) => res.url().includes(part)),
        { timeout: timeOut },
      )
      .catch(() => null);
  }

  async waitForCountToMatchResponse(
    locator: Locator,
    response: Response | null,
    renderTimeOut: number = TimeOutConstants.TIME_OUT_RENDER,
  ): Promise<void> {
    let expected: number | null = null;
    if (response) {
      if (!response.ok()) {
        expected = 0; // API trả status lỗi khi không có dữ liệu
      } else {
        const data = await response.json().catch(() => null);
        if (Array.isArray(data)) expected = data.length;
        else if (Array.isArray(data?.items)) expected = data.items.length;
      }
    }
    if (expected !== null) {
      await expect(locator).toHaveCount(expected, { timeout: renderTimeOut });
    } else {
      // Không bắt được response (trang tải chậm vượt cửa sổ chờ API).
      // KHÔNG thể chỉ chờ "số phần tử đứng yên": lúc còn loading count = 0
      // rất ổn định nên sẽ thoát sớm. Phải chờ vòng tròn loading của app
      // (#preloader) xuất hiện (nếu có) rồi biến mất trước, sau đó mới đo
      // độ ổn định của số phần tử.
      const preloader = this.page.locator("#preloader");
      await preloader
        .waitFor({ state: "visible", timeout: 2000 })
        .catch(() => {}); // app chưa/không hiện loading thì bỏ qua
      await preloader
        .waitFor({ state: "hidden", timeout: TimeOutConstants.TIME_OUT_API })
        .catch(() => {});
      let previous = -1;
      await expect
        .poll(
          async () => {
            const current = await locator.count();
            const stable = current === previous;
            previous = current;
            return stable;
          },
          { timeout: renderTimeOut },
        )
        .toBe(true)
        .catch(() => {});
    }
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight),
    );
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /** lấy URL hiện tại của trang và chuyển các ký tự đã bị mã hóa trong URL về dạng dễ đọc. */
  getDecodedUrl(): string {
    try {
      return decodeURIComponent(this.page.url());
    } catch {
      return this.page.url();
    }
  }

  async selectOption(
    locator: Locator,
    value: string,
    timeOut: number = TimeOutConstants.TIME_OUT_DEFAULT,
  ) {
    await locator.selectOption(value, { timeout: timeOut });
  }
}
