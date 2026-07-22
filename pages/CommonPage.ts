import { BasePage } from "./BasePage";
import { TopBarComponent } from "./components/TopBarComponent";
import { FooterComponent } from "./components/FooterComponent";
import { Page } from "@playwright/test";

export class CommonPage extends BasePage {
  private topBarComponent: TopBarComponent;
  private footerComponent: FooterComponent;

  constructor(page: Page) {
    super(page);
    this.topBarComponent = new TopBarComponent(page);
    this.footerComponent = new FooterComponent(page);
  }

  getTopBarComponent() {
    return this.topBarComponent;
  }
  getFooterComponent() {
    return this.footerComponent;
  }
}
