import { expect, test } from "../../fixtures/page-fixture";
import { COURSE_LIST_DATA } from "../../test-data/course-list-data";
import { SEARCH_DATA } from "../../test-data/search-data";

/**
 * Chức năng: DANH SÁCH KHÓA HỌC /khoahoc (Epic Khám Phá Khóa Học - US-02)
 * Nguồn: sheet "Danh sách khóa học" (TC_1 -> TC_30) - map 1:1 TC_LIST_xx <-> TC_xx.
 *
 * Toàn bộ logic chờ API/phân trang nằm ở tầng pages (CourseCatalogPage).
 */

/** Bỏ dấu tiếng Việt + đưa dữ liệu về dạng chữ thường (lowercase) để so tên khóa học với tên file ảnh (TC_8). */
function normalizeForImageMatch(text: string): string[] {
  const plain = text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
  return plain.split(/[^a-z0-9]+/).filter((token) => token.length >= 4);
}

test.describe("Danh sách khóa học", () => {
  test.beforeEach(async ({ courseCatalogPage }) => {
    await courseCatalogPage.open();
  });

  test("TC_LIST_01: Trang Danh sách khóa học tải thành công", async ({
    page,
    courseCatalogPage,
  }) => {
    await expect(page).toHaveURL(/\/khoahoc/);
    // đủ các khu vực chính: banner, lưới card, phân trang, footer
    await expect(courseCatalogPage.getBanner()).toBeVisible();
    expect(await courseCatalogPage.courseCount()).toBeGreaterThan(0);
    await expect(courseCatalogPage.getPagination()).toBeVisible();
    await expect(
      courseCatalogPage.getFooterComponent().getFooter(),
    ).toBeVisible();
  });

  test("TC_LIST_02: Header hiển thị logo, ô tìm kiếm, menu và nút Đăng nhập", async ({
    courseCatalogPage,
  }) => {
    const topBar = courseCatalogPage.getTopBarComponent();
    await expect(topBar.getLogo()).toBeVisible();
    await expect(topBar.getSearchInput()).toBeVisible();
    await expect(topBar.getCategoryLink()).toBeVisible();
    await expect(topBar.getCourseLink()).toBeVisible();
    await expect(topBar.getBlogLink()).toBeVisible();
    await expect(topBar.getEventLink()).toBeVisible();
    await expect(topBar.getInformationLink()).toBeVisible();
    await expect(topBar.getLoginButton()).toBeVisible();
  });

  test("TC_LIST_03: Banner hiển thị tiêu đề trang và dòng phụ", async ({
    courseCatalogPage,
  }) => {
    await expect(courseCatalogPage.getBannerTitle()).toHaveText(
      COURSE_LIST_DATA.bannerTitle,
    );
    await expect(courseCatalogPage.getBannerSubtitle()).toHaveText(
      COURSE_LIST_DATA.bannerSubtitle,
    );
  });

  test("TC_LIST_04: Khu vực thống kê hiển thị đủ 6 ô kèm số liệu", async ({
    courseCatalogPage,
  }) => {
    await expect(courseCatalogPage.getStatsBoxes()).toHaveCount(6);
    for (const label of COURSE_LIST_DATA.statsLabels) {
      const box = courseCatalogPage.getStatsBoxes().filter({ hasText: label });
      await expect(box).toBeVisible();
      await expect(box.locator("p")).toHaveText(/^\d+$/);
    }
  });

  test("TC_LIST_05: Section Danh sách khóa học hiển thị heading và lưới card", async ({
    page,
    courseCatalogPage,
  }) => {
    await expect(
      page.getByText(COURSE_LIST_DATA.sectionHeading).first(),
    ).toBeVisible();
    await expect(courseCatalogPage.getCourseCards().first()).toBeVisible();
  });

  test("TC_LIST_06: Footer hiển thị thông tin liên hệ, liên kết, form tư vấn và mạng xã hội", async ({
    courseCatalogPage,
  }) => {
    const footer = courseCatalogPage.getFooterComponent();
    await footer.getFooter().scrollIntoViewIfNeeded();
    await expect(footer.getFooter()).toContainText(
      COURSE_LIST_DATA.footerHotline,
    );
    await expect(footer.getFooter()).toContainText(
      COURSE_LIST_DATA.footerEmail,
    );
    await expect(footer.getFooter()).toContainText("Liên kết");
    await expect(footer.getFooter()).toContainText("Khóa học");
    await expect(footer.getFooter()).toContainText("Đăng kí tư vấn");
    await expect(footer.getConsultNameInput()).toBeVisible();
    await expect(footer.getConsultSubmitButton()).toBeVisible();
    expect(await footer.getSocialIcons().count()).toBeGreaterThanOrEqual(3);
  });

  test("TC_LIST_07: Card khóa học hiển thị đủ hình ảnh, tên, giá, đánh giá", async ({
    courseCatalogPage,
  }) => {
    const cardCount = await courseCatalogPage.courseCount();
    expect(cardCount).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      await expect(courseCatalogPage.getCardImage(i)).toBeVisible();
      await expect(courseCatalogPage.getCardName(i)).not.toBeEmpty();
      await expect(courseCatalogPage.getCardPrices(i)).toHaveCount(2);
      await expect(courseCatalogPage.getCardStarIcon(i)).toBeVisible();
    }
  });

  // BUG đã ghi nhận khi test manual - nhiều card dùng ảnh placeholder không khớp
  // code hiện tại chỉ so sánh tên khóa học với tên file ảnh, chưa xác định được nội dung ảnh có thật sự sai hay không.
  test("TC_LIST_08: Hình ảnh trên card đúng với khóa học tương ứng (BUG đã ghi nhận)", async ({
    courseCatalogPage,
  }) => {
    const pairs = await courseCatalogPage.getCardNameImagePairs();
    expect(pairs.length).toBeGreaterThan(0);
    const mismatches = pairs.filter(({ name, src }) => {
      const tokens = normalizeForImageMatch(name);
      const fileName = src.toLowerCase();
      return tokens.length > 0 && !tokens.some((t) => fileName.includes(t));
    });
    expect(mismatches).toEqual([]);
  });

  test("TC_LIST_09: Tên khóa học hiển thị trên mọi card", async ({
    courseCatalogPage,
  }) => {
    const names = await courseCatalogPage.getAllCardNames();
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) {
      expect(name.trim().length).toBeGreaterThan(0);
    }
  });

  test("TC_LIST_10: Giá hiển thị đúng định dạng, giá gốc gạch ngang", async ({
    courseCatalogPage,
  }) => {
    const cardCount = await courseCatalogPage.courseCount();
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const prices = courseCatalogPage.getCardPrices(i);
      await expect(prices).toHaveCount(2);
      await expect(prices.nth(0)).toHaveText(COURSE_LIST_DATA.pricePattern);
      await expect(prices.nth(1)).toHaveText(COURSE_LIST_DATA.pricePattern);
      // giá gốc có gạch ngang
      await expect(prices.nth(0)).toHaveCSS(
        "text-decoration-line",
        "line-through",
      );
    }
  });

  test("TC_LIST_11: Đánh giá hiển thị sao, điểm và số lượt", async ({
    courseCatalogPage,
  }) => {
    const cardCount = await courseCatalogPage.courseCount();
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      await expect(courseCatalogPage.getCardStarIcon(i)).toBeVisible();
      await expect(courseCatalogPage.getCardRatingScore(i)).toHaveText(
        /^\d(\.\d)?$/,
      );
      await expect(courseCatalogPage.getCardRatingCount(i)).toHaveText(
        /^\(\d+\)$/,
      );
    }
  });

  test("TC_LIST_12: Layout card đồng nhất kích thước", async ({
    courseCatalogPage,
  }) => {
    const cards = courseCatalogPage.getCourseCards();
    const count = await cards.count();
    expect(count).toBeGreaterThan(1);
    const first = await cards.first().boundingBox();
    expect(first).not.toBeNull();
    for (let i = 1; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.width - first!.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(box!.height - first!.height)).toBeLessThanOrEqual(1);
    }
  });

  test("TC_LIST_13: Hover lên card đổi con trỏ sang pointer", async ({
    courseCatalogPage,
  }) => {
    const card = courseCatalogPage.getCourseCards().first();
    await card.hover();
    await expect(card).toHaveCSS("cursor", "pointer");
  });

  test("TC_LIST_14: Thanh phân trang hiển thị Trước, Sau, số trang và dấu ...", async ({
    courseCatalogPage,
  }) => {
    await expect(courseCatalogPage.getPagination()).toBeVisible();
    await expect(courseCatalogPage.getPrevButton()).toContainText("Trước");
    await expect(courseCatalogPage.getNextButton()).toContainText("Sau");
    await expect(courseCatalogPage.getPageButton(1)).toBeVisible();
    await expect(courseCatalogPage.getPageButton(2)).toBeVisible();
    await expect(courseCatalogPage.getDotsButton()).toBeVisible();
  });

  test("TC_LIST_15: Click trang số 2, điều hướng sang trang 2 và cập nhật danh sách", async ({
    courseCatalogPage,
  }) => {
    const namesPage1 = await courseCatalogPage.getAllCardNames();
    await courseCatalogPage.goToPage(2);
    expect(await courseCatalogPage.getActivePageNumber()).toBe(2);
    expect(await courseCatalogPage.courseCount()).toBeGreaterThan(0);
    const namesPage2 = await courseCatalogPage.getAllCardNames();
    expect(namesPage2.join("|")).not.toBe(namesPage1.join("|"));
  });

  test("TC_LIST_16: Click nút Sau / Trước điều hướng sang đúng trang kế tiếp / trước đó", async ({
    courseCatalogPage,
  }) => {
    await courseCatalogPage.goToNextPage();
    expect(await courseCatalogPage.getActivePageNumber()).toBe(2);
    await courseCatalogPage.goToPreviousPage();
    expect(await courseCatalogPage.getActivePageNumber()).toBe(1);
  });

  test("TC_LIST_17: Ở trang 1 click Trước không chuyển về trang 0", async ({
    page,
    courseCatalogPage,
  }) => {
    await expect(courseCatalogPage.getPrevButton()).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await courseCatalogPage.getPrevButton().click({ force: true });
    await page.waitForTimeout(500); // chờ phủ định: xác nhận KHÔNG có điều hướng
    expect(await courseCatalogPage.getActivePageNumber()).toBe(1);
  });

  test("TC_LIST_18: Ở trang cuối click Sau không vượt quá trang cuối", async ({
    page,
    courseCatalogPage,
  }) => {
    const lastPage = await courseCatalogPage.getLastPageNumber();
    await courseCatalogPage.goToPage(lastPage);
    expect(await courseCatalogPage.getActivePageNumber()).toBe(lastPage);
    await expect(courseCatalogPage.getNextButton()).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await courseCatalogPage.getNextButton().click({ force: true });
    await page.waitForTimeout(500); // chờ phủ định: xác nhận KHÔNG có điều hướng
    expect(await courseCatalogPage.getActivePageNumber()).toBe(lastPage);
  });

  test("TC_LIST_19: Click dấu ... nhảy tới trang kế tiếp trong nhóm bị lược bớt", async ({
    courseCatalogPage,
  }) => {
    await courseCatalogPage.clickPaginationDots();
    // từ trang 1, "..." đưa tới trang 4 (trang kế tiếp của nhóm 1-2-3 đang hiện)
    expect(await courseCatalogPage.getActivePageNumber()).toBe(4);
    expect(await courseCatalogPage.courseCount()).toBeGreaterThan(0);
  });

  // BUG đã ghi nhận Fail khi test manual - đang ở trang 3, nhấn F5 thì danh sách
  // trở về trang 1 chứ không giữ nguyên trang đang xem (AC-2.9).
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_LIST_20: Reload giữ nguyên trang phân trang đang xem (BUG đã ghi nhận khi test manual)", async ({
    courseCatalogPage,
  }) => {
    await courseCatalogPage.goToPage(3);
    expect(await courseCatalogPage.getActivePageNumber()).toBe(3);
    await courseCatalogPage.reload();
    // reload xong vẫn phải hiển thị danh sách hợp lệ...
    expect(await courseCatalogPage.courseCount()).toBeGreaterThan(0);
    await expect(courseCatalogPage.getPagination()).toBeVisible();
    // ...và giữ nguyên trang 3 như trước khi reload
    expect(await courseCatalogPage.getActivePageNumber()).toBe(3);
  });

  test("TC_LIST_21: Click card điều hướng sang trang chi tiết", async ({
    page,
    courseCatalogPage,
  }) => {
    await courseCatalogPage.openFirstRealCourse();
    await expect(page).toHaveURL(/\/chitiet\/.+/);
  });

  test("TC_LIST_22: Double click card điều hướng sang trang chi tiết", async ({
    page,
    courseCatalogPage,
  }) => {
    await courseCatalogPage.openFirstRealCourse(true);
    await expect(page).toHaveURL(/\/chitiet\/.+/);
  });

  // BUG đã ghi nhận Fail khi test manual - Back từ trang chi tiết làm danh sách reset
  // về trang 1, không giữ trang 3 (số trang không được lưu trên URL /khoahoc).
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_LIST_23: Back từ trang chi tiết giữ nguyên trạng thái phân trang (BUG đã ghi nhận)", async ({
    page,
    courseCatalogPage,
  }) => {
    test.slow(); // chuyển trang + mở chi tiết + back
    await courseCatalogPage.goToPage(3);
    expect(await courseCatalogPage.getActivePageNumber()).toBe(3);
    await courseCatalogPage.openFirstRealCourse();
    await expect(page).toHaveURL(/\/chitiet\/.+/);
    await courseCatalogPage.goBackToList();
    expect(await courseCatalogPage.getActivePageNumber()).toBe(3);
  });

  test("TC_LIST_24: Vòng tròn loading hiển thị khi tải dữ liệu rồi ẩn đi", async ({
    courseCatalogPage,
  }) => {
    // click phân trang KHÔNG qua goToPage để tự quan sát trạng thái loading
    await courseCatalogPage.getPageButton(2).click();
    await expect(courseCatalogPage.getPreloader()).toBeVisible({
      timeout: 4000,
    });
    await expect(courseCatalogPage.getPreloader()).toBeHidden({
      timeout: 10000,
    });
    await expect(courseCatalogPage.getCourseCards().first()).toBeVisible();
  });

  test("TC_LIST_25: Scroll xuống cuối / lên đầu trang không vỡ layout, header cố định", async ({
    courseCatalogPage,
  }) => {
    await courseCatalogPage.scrollToBottom();
    await expect(
      courseCatalogPage.getFooterComponent().getFooter(),
    ).toBeInViewport();
    // khi cuộn, header được ghim cố định phía trên (class headerFixed)
    await expect(courseCatalogPage.getHeader()).toHaveClass(/headerFixed/);
    await courseCatalogPage.scrollToTop();
    await expect(courseCatalogPage.getBanner()).toBeInViewport();
    expect(await courseCatalogPage.courseCount()).toBeGreaterThan(0);
  });

  // BUG đã ghi nhận Fail khi test manual - mất mạng chỉ hiển thị vòng tròn loading,
  // không có thông báo "Vui lòng kết nối mạng" (AC-2.13).
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_LIST_28: Hiển thị thông báo khi mất kết nối mạng", async ({
    page,
    context,
    courseCatalogPage,
  }) => {
    await context.setOffline(true);
    await courseCatalogPage.getPageButton(2).click();
    await expect(
      page.getByText(COURSE_LIST_DATA.offlineMessage).first(),
    ).toBeVisible({ timeout: 4000 });
  });

  test("TC_LIST_29: Danh sách hoạt động đúng khi chưa đăng nhập", async ({
    page,
    courseCatalogPage,
  }) => {
    await expect(
      courseCatalogPage.getTopBarComponent().getLoginButton(),
    ).toBeVisible(); // xác nhận đang ở trạng thái chưa đăng nhập
    expect(await courseCatalogPage.courseCount()).toBeGreaterThan(0);
    await expect(courseCatalogPage.getPagination()).toBeVisible();
    await courseCatalogPage.openFirstRealCourse();
    await expect(page).toHaveURL(/\/chitiet\/.+/);
  });

  test("TC_LIST_30: Danh sách hoạt động đúng khi đã đăng nhập", async ({
    page,
    loginPage,
    registerPage,
    courseCatalogPage,
  }) => {
    test.slow(); // register + login + duyệt danh sách
    // Tài khoản trên site demo bị reset thường xuyên nên đăng ký mới rồi
    // đăng nhập bằng chính tài khoản đó (theo pattern của searching TC_19).
    const account = "tsg6" + Date.now().toString(36);
    const password = SEARCH_DATA.registerPassword;

    await courseCatalogPage.getTopBarComponent().navigateToLoginPage();
    await loginPage.clickTranslateRegisterButton();
    await registerPage.enterAccountInput(account);
    await registerPage.enterFullnameInput("Testing Playwright");
    await registerPage.enterPasswordInput(password);
    await registerPage.enterEmailInput(`${account}@gmail.com`);
    await registerPage.enterPhoneNumber("0912345678");
    await registerPage.chooseGroupCode();
    await registerPage.clickRegisterButton();
    await expect(page.getByText("Đăng kí thành công")).toBeVisible();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(800);
    await registerPage.clickReturnLoginButton();
    await page.waitForTimeout(500);

    await loginPage.enterAccounttInput(account);
    await loginPage.enterPasswordInput(password);
    await loginPage.clickLoginButton();
    // đăng nhập thành công: site rời trang /login (quay về trang trước đó)
    // và nút Đăng nhập trên header biến mất
    await expect(page).not.toHaveURL(/\/login/, { timeout: 20000 });
    await expect(
      courseCatalogPage.getTopBarComponent().getLoginButton(),
    ).toBeHidden();

    // đã đăng nhập: danh sách, card, phân trang vẫn hoạt động nhất quán
    await courseCatalogPage.open();
    expect(await courseCatalogPage.courseCount()).toBeGreaterThan(0);
    await expect(courseCatalogPage.getPagination()).toBeVisible();
    await courseCatalogPage.openFirstRealCourse();
    await expect(page).toHaveURL(/\/chitiet\/.+/);
  });
});

test.describe("Danh sách khóa học - Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("TC_LIST_26: Layout responsive trên mobile, card vừa màn hình, scroll được", async ({
    courseCatalogPage,
  }) => {
    await courseCatalogPage.open();
    const card = courseCatalogPage.getCourseCards().first();
    await expect(card).toBeVisible();
    // card không tràn ra ngoài viewport mobile
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(376);
    // scroll xuống cuối trang vẫn tới được footer
    await courseCatalogPage.scrollToBottom();
    await expect(
      courseCatalogPage.getFooterComponent().getFooter(),
    ).toBeInViewport();
  });
});

test.describe("Danh sách khóa học - Tablet", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("TC_LIST_27: Layout responsive trên tablet, card vừa màn hình, scroll được", async ({
    courseCatalogPage,
  }) => {
    await courseCatalogPage.open();
    const card = courseCatalogPage.getCourseCards().first();
    await expect(card).toBeVisible();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(769);
    await courseCatalogPage.scrollToBottom();
    await expect(
      courseCatalogPage.getFooterComponent().getFooter(),
    ).toBeInViewport();
  });
});
