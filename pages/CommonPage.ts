import { BasePage } from "./BasePage";
import { TopBarComponent } from "./components/TopBarComponent";
import { Page } from "@playwright/test";

export class CommonPage extends BasePage {
  private topBarComponent: TopBarComponent;

  constructor(page: Page) {
    super(page);
    this.topBarComponent = new TopBarComponent(page);
  }

  getTopBarComponent() {
    return this.topBarComponent;
  }
}
