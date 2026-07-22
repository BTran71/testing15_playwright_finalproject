import { Locator, Page } from "@playwright/test";
import { BasePage } from "../BasePage";

/** Footer chung của mọi trang (section.footerPages). */
export class FooterComponent extends BasePage {
  private readonly footer: Locator;

  constructor(page: Page) {
    super(page);
    this.footer = page.locator("section.footerPages");
  }

  getFooter(): Locator {
    return this.footer;
  }

  /** Ô "Họ và tên" của form Đăng kí tư vấn. */
  getConsultNameInput(): Locator {
    return this.footer.getByPlaceholder("Họ và tên");
  }

  getConsultSubmitButton(): Locator {
    return this.footer.getByRole("button", { name: /Đăng kí/i });
  }

  /** Icon mạng xã hội (facebook, twitter, instagram...). */
  getSocialIcons(): Locator {
    return this.footer.locator("i.iconFooter");
  }
}
