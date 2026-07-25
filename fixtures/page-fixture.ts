import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { SearchResultPage } from "../pages/SearchResultPage";
import { CourseCatalogPage } from "../pages/CourseCatalogPage";
import { CategoryNavigation } from "../pages/CategoryNavigation";
import { CourseDetailPage } from "../pages/CourseDetailPage";
import { CourseListingPage } from "../pages/CourseListingPage";

type MyFixture = {
  homePage: HomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  //them cac page khac khi mo rong
  searchResultPage: SearchResultPage;
  courseCatalogPage: CourseCatalogPage;
  categoryNavigationPage: CategoryNavigation;
  courseDetailPage: CourseDetailPage;
  courseListingPage: CourseListingPage;
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

  searchResultPage: async ({ page }, use) => {
    const searchResultPage = new SearchResultPage(page);
    await use(searchResultPage);
  },

  courseCatalogPage: async ({ page }, use) => {
    const courseCatalogPage = new CourseCatalogPage(page);
    await use(courseCatalogPage);
  },

  categoryNavigationPage: async ({ page }, use) => {
    const categoryNavigationPage = new CategoryNavigation(page);
    await use(categoryNavigationPage);
  },

  courseDetailPage: async ({ page }, use) => {
    const courseDetailPage = new CourseDetailPage(page);
    await use(courseDetailPage);
  },
  courseListingPage: async ({ page }, use) => {
    const courseListingPage = new CourseListingPage(page);
    await use(courseListingPage);
  },
});
export { expect } from "@playwright/test";
