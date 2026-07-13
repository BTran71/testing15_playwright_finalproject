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
}
