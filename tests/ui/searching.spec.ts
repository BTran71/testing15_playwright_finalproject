import { expect, test } from "../../fixtures/page-fixture";
import { SEARCH_DATA } from "../../test-data/search-data";
import { HomePage } from "../../pages/HomePage";

/**
 * Chức năng: TÌM KIẾM KHÓA HỌC (Epic Course Discovery - US-01)
 * Nguồn: User Story US-01 + testcase sheet "Tìm kiếm khóa học".
 */

//  nhập từ khóa rồi nhấn Enter để tìm kiếm
async function doSearch(homePage: HomePage, keyword: string) {
  const topBar = homePage.getTopBarComponent();
  await topBar.enterResearchInput(keyword);
  await topBar.pressEnterButtonToSearch();
}

test.describe("Tìm kiếm khóa học", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("TC_SEARCH_01: Hiển thị ô tìm kiếm trên trang chủ", async ({ page }) => {
    await expect(page.getByRole("textbox", { name: "Tìm kiếm" })).toBeVisible();
  });

  test("TC_SEARCH_02: Tìm với từ khóa hợp lệ -> có kết quả", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await doSearch(homePage, SEARCH_DATA.validKeyword);

    await expect(page).toHaveURL(
      new RegExp(`/timkiem/${SEARCH_DATA.validKeyword}`, "i"),
    );
    await searchResultPage.waitForResults();
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_03: Tìm với từ khóa không dấu -> có kết quả", async ({
    homePage,
    searchResultPage,
  }) => {
    await doSearch(homePage, SEARCH_DATA.validKeywordNoAccent);
    await searchResultPage.waitForResults();
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_04: Tìm với một phần của từ khóa (partial match)", async ({
    homePage,
    searchResultPage,
  }) => {
    await doSearch(homePage, "rea"); // một phần của "react"
    await searchResultPage.waitForResults();
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_05: Không phân biệt HOA/thường", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await doSearch(homePage, SEARCH_DATA.validKeyword.toUpperCase());
    await searchResultPage.waitForResults();
    const upperCount = await searchResultPage.courseCount();

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await doSearch(homePage, SEARCH_DATA.validKeyword.toLowerCase());
    await searchResultPage.waitForResults();
    const lowerCount = await searchResultPage.courseCount();

    expect(upperCount).toBe(lowerCount);
    expect(lowerCount).toBeGreaterThan(0);
  });

  test("TC_SEARCH_06: Trim khoảng trắng đầu/cuối -> vẫn ra kết quả", async ({
    homePage,
    searchResultPage,
  }) => {
    await doSearch(homePage, SEARCH_DATA.withSpaces);
    await searchResultPage.waitForResults();
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_07: Từ khóa không tồn tại -> 0 kết quả", async ({
    homePage,
    searchResultPage,
  }) => {
    await doSearch(homePage, SEARCH_DATA.notFoundKeyword);
    await searchResultPage.waitForResults();
    expect(await searchResultPage.courseCount()).toBe(0);
  });

  test("TC_SEARCH_08: Chuỗi rất dài (>100 ký tự) -> 0 kết quả, không lỗi", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await doSearch(homePage, SEARCH_DATA.veryLong);
    await searchResultPage.waitForResults();
    expect(await searchResultPage.courseCount()).toBe(0);
    await expect(page.getByRole("textbox", { name: "Tìm kiếm" })).toBeVisible();
  });

  test("TC_SEARCH_09: Bỏ trống ô tìm kiếm -> không điều hướng sang trang kết quả", async ({
    page,
    homePage,
  }) => {
    await homePage.getTopBarComponent().pressEnterButtonToSearch();
    await expect(page).not.toHaveURL(/\/timkiem\//);
  });
});
