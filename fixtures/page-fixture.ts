import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
type MyFixture = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  //them cac page khac khi mo rong
};

export const test = base.extend<MyFixture>({
  homePage: async ({ page }, use) => {
    // set Home Page
    const homePage = new HomePage(page);

    // khai bao su dung homepage trong test
    await use(homePage);
  },

  loginPage: async ({ page }, use) => {
    // set Home Page
    const loginPage = new LoginPage(page);

    await use(loginPage);
  },

  registerPage: async ({ page }, use) => {
    // set Home Page
    const registerPage = new RegisterPage(page);

    await use(registerPage);
  },
});
export { expect } from "@playwright/test";
