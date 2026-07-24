import { expect, test } from "../../fixtures/page-fixture";
import { CATEGORY_DATA } from "../../test-data/category-data";

/**
 * Chức năng: ĐIỀU HƯỚNG KHÓA HỌC THEO DANH MỤC (Epic Khám Phá Khóa Học - US-04)
 * Nguồn: sheet "Điều hướng theo danh mục" (TC_1 -> TC_12) - map 1:1
 * TC_CATE_xx <-> TC_xx.
 *
 * Các case là BUG đã ghi nhận Fail trong sheet (TC_6, TC_10, TC_12) được
 * assert theo ĐÚNG expected result của sheet -> chạy sẽ FAIL cho tới khi dev
 * fix bug. Fail của các case này là KẾT QUẢ ĐÚNG, khớp status Fail trong sheet.
 *
 * Site là môi trường demo, dữ liệu thay đổi liên tục -> không hardcode số
 * lượng khóa học, chỉ assert quan hệ (>0, khác nhau giữa các lĩnh vực).
 *
 * Toàn bộ logic chờ API/điều hướng nằm ở tầng pages (CategoryNavigation).
 */

test.describe("Điều hướng khóa học theo danh mục", () => {
  test("TC_CATE_01: Menu DANH MỤC liệt kê đầy đủ 6 lĩnh vực", async ({
    homePage,
  }) => {
    await homePage.open();
    const topBar = homePage.getTopBarComponent();
    await topBar.hoverCategory();
    // đúng 6 lĩnh vực, đúng tên, đúng thứ tự trên menu
    await expect(topBar.getCategoryMenuItems()).toHaveText(
      CATEGORY_DATA.categories.map((category) => category.name),
    );
  });

  test("TC_CATE_02: Chọn lĩnh vực từ menu điều hướng tới trang danh mục có khóa học", async ({
    page,
    homePage,
    categoryNavigationPage,
  }) => {
    await homePage.open();
    await categoryNavigationPage.openViaMenu("BackEnd");

    await expect(page).toHaveURL(/\/danhmuckhoahoc\/BackEnd/);
    await expect(categoryNavigationPage.getBannerTitle()).toHaveText(
      CATEGORY_DATA.bannerTitle,
    );
    expect(await categoryNavigationPage.cardCount()).toBeGreaterThan(0);
  });

  test("TC_CATE_03: Tên lĩnh vực hiển thị đúng với danh mục đã chọn", async ({
    homePage,
    categoryNavigationPage,
  }) => {
    test.slow(); // duyệt lần lượt 3 lĩnh vực qua menu
    await homePage.open();
    // đại diện 3 lĩnh vực theo cột Test Data của sheet
    for (const { code, name } of CATEGORY_DATA.categories.filter((c) =>
      ["BackEnd", "Design", "DiDong"].includes(c.code),
    )) {
      await categoryNavigationPage.openViaMenu(code);
      await expect(categoryNavigationPage.getCategoryChip()).toHaveText(name);
    }
  });

  test("TC_CATE_04: Mỗi lĩnh vực hiển thị danh sách khóa học khác nhau", async ({
    categoryNavigationPage,
  }) => {
    test.slow(); // mở lần lượt 3 trang danh mục
    const nameSets: string[] = [];
    for (const code of ["BackEnd", "FrontEnd", "DiDong"]) {
      await categoryNavigationPage.open(code);
      nameSets.push((await categoryNavigationPage.getAllCardNames()).join("|"));
    }
    expect(nameSets[0]).not.toBe(nameSets[1]);
    expect(nameSets[1]).not.toBe(nameSets[2]);
    expect(nameSets[0]).not.toBe(nameSets[2]);
  });

  test("TC_CATE_05: Truy cập trực tiếp URL danh mục hợp lệ hiển thị đúng trang", async ({
    page,
    categoryNavigationPage,
  }) => {
    await categoryNavigationPage.open("FrontEnd");
    await expect(page).toHaveURL(/\/danhmuckhoahoc\/FrontEnd/);
    await expect(categoryNavigationPage.getCategoryChip()).toHaveText(
      "Lập trình Front end",
    );
    expect(await categoryNavigationPage.cardCount()).toBeGreaterThan(0);
  });

  // BUG đã ghi nhận khi test manual - URL danh mục không tồn tại chỉ hiển thị
  // lưới rỗng + tên lĩnh vực trống, KHÔNG có thông báo "Không có khóa học".
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_CATE_06: Hiển thị thông báo khi truy cập URL của danh mục không hợp lệ", async ({
    page,
    categoryNavigationPage,
  }) => {
    await categoryNavigationPage.open(CATEGORY_DATA.invalidCode);
    await expect(
      page.getByText(new RegExp(CATEGORY_DATA.emptyMessage, "i")).first(),
    ).toBeVisible({ timeout: 4000 });
  });

  test("TC_CATE_07: Card khóa học trong danh mục hiển thị đủ thông tin, layout đồng nhất", async ({
    categoryNavigationPage,
  }) => {
    await categoryNavigationPage.open("BackEnd");
    const cardTotal = await categoryNavigationPage.cardCount();
    expect(cardTotal).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(cardTotal, 3); i++) {
      await expect(categoryNavigationPage.getCardImage(i)).toBeVisible();
      await expect(
        categoryNavigationPage.getCardFavoriteBadge(i),
      ).toBeVisible();
      await expect(categoryNavigationPage.getCardName(i)).not.toBeEmpty();
      await expect(
        categoryNavigationPage.getCardDescription(i),
      ).not.toBeEmpty();
      await expect(categoryNavigationPage.getCardDurationInfos(i)).toHaveCount(
        3,
      );
      await expect(categoryNavigationPage.getCardTeacher(i)).not.toBeEmpty();
      await expect(categoryNavigationPage.getCardPrices(i)).toHaveCount(2);
    }

    // các card đồng nhất kích thước (so 6 card đầu)
    const cards = categoryNavigationPage.getCourseCards();
    const first = await cards.first().boundingBox();
    expect(first).not.toBeNull();
    for (let i = 1; i < Math.min(cardTotal, 6); i++) {
      const box = await cards.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.width - first!.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(box!.height - first!.height)).toBeLessThanOrEqual(1);
    }
  });

  test("TC_CATE_08: Hover lên card đổi con trỏ sang pointer", async ({
    categoryNavigationPage,
  }) => {
    await categoryNavigationPage.open("BackEnd");
    const card = categoryNavigationPage.getCourseCards().first();
    await card.hover();
    await expect(card).toHaveCSS("cursor", "pointer");
  });

  test("TC_CATE_09: Click khóa học trong danh mục điều hướng sang trang chi tiết", async ({
    page,
    categoryNavigationPage,
  }) => {
    await categoryNavigationPage.open("FrontEnd");
    await categoryNavigationPage.openFirstRealCourse();
    await expect(page).toHaveURL(/\/chitiet\/.+/);
  });

  // BUG đã ghi nhận khi test manual - trang chi tiết LUÔN hiển thị
  // "LẬP TRÌNH FRONT-END CHUYÊN NGHIỆP" cho mọi khóa học, không khớp
  // khóa học đã chọn. Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_CATE_10: Tên khóa học trên trang chi tiết khớp với card đã chọn", async ({
    page,
    categoryNavigationPage,
    courseDetailPage,
  }) => {
    test.slow(); // mở lần lượt 2 khóa học để đối chiếu
    for (const index of [0, 1]) {
      await categoryNavigationPage.open("FrontEnd");
      const cardName = (
        await categoryNavigationPage.getCardName(index).textContent()
      )?.trim();
      expect(cardName).toBeTruthy();
      await categoryNavigationPage.getCourseCards().nth(index).click();
      await expect(page).toHaveURL(/\/chitiet\//);
      await expect(courseDetailPage.getCourseTitle()).toContainText(cardName!, {
        ignoreCase: true,
        timeout: 4000,
      });
    }
  });

  test("TC_CATE_11: Trường Lĩnh vực trên trang chi tiết nhất quán với danh mục đã chọn", async ({
    page,
    categoryNavigationPage,
    courseDetailPage,
  }) => {
    test.slow(); // kiểm tra 2 danh mục
    for (const { code, name } of CATEGORY_DATA.categories.filter((c) =>
      ["FrontEnd", "BackEnd"].includes(c.code),
    )) {
      await categoryNavigationPage.open(code);
      await categoryNavigationPage.openFirstRealCourse();
      await expect(page).toHaveURL(/\/chitiet\//);
      await expect(courseDetailPage.getCategoryFieldValue()).toHaveText(name);
    }
  });

  // BUG đã ghi nhận khi test manual - card KHÔNG có nhãn lĩnh vực riêng (badge
  // trên ảnh là tên khóa học), và danh mục chứa khóa học không liên quan.
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_CATE_12: Card trong danh mục hiển thị nhãn lĩnh vực đúng với danh mục", async ({
    categoryNavigationPage,
  }) => {
    await categoryNavigationPage.open("BackEnd");
    const cardTotal = await categoryNavigationPage.cardCount();
    expect(cardTotal).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(cardTotal, 3); i++) {
      await expect(categoryNavigationPage.getCardName(i)).toContainText(
        /backend/i,
        { timeout: 2000 },
      );
    }
  });
});
