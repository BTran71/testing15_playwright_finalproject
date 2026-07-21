import { expect, test } from "../../fixtures/page-fixture";
import { SEARCH_DATA } from "../../test-data/search-data";

/**
 * Chức năng: TÌM KIẾM KHÓA HỌC (Epic Course Discovery - US-01)
 * Testcase sheet "Tìm kiếm khóa học" (TC_1 -> TC_22)
 */

test.describe("Tìm kiếm khóa học", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test("TC_SEARCH_01: Hiển thị ô tìm kiếm và icon kính lúp trên trang chủ", async ({
    homePage,
  }) => {
    const searchBox = homePage.getTopBarComponent().getSearchInput();
    await expect(searchBox).toBeVisible();
    await expect(searchBox).toHaveAttribute("placeholder", "Tìm kiếm");
    // icon kính lúp là background-image của chính ô input
    const bgImage = await searchBox.evaluate(
      (el) => getComputedStyle(el).backgroundImage,
    );
    expect(bgImage).toMatch(/search/i);
  });

  test("TC_SEARCH_02: Nhấn Enter với từ khóa hợp lệ -> điều hướng và có kết quả", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await homePage.getTopBarComponent().searchCourse(SEARCH_DATA.validKeyword);

    await expect(page).toHaveURL(/\/timkiem\//);
    expect(searchResultPage.getDecodedUrl()).toContain(
      SEARCH_DATA.validKeyword,
    );
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
    // khóa học có tên khớp từ khóa hiển thị trong danh sách kết quả
    await expect(
      page.getByText(SEARCH_DATA.validKeyword).first(),
    ).toBeVisible();
  });

  // test("TC_SEARCH_03: Click icon kính lúp kích hoạt tìm kiếm (BUG đã ghi nhận khi test manual)", async ({
  //   page,
  //   homePage,
  // }) => {
  //   test.fail(); // Fail - click icon không kích hoạt tìm kiếm, chỉ Enter mới chạy
  //   const topBar = homePage.getTopBarComponent();
  //   await topBar.enterResearchInput(SEARCH_DATA.simpleKeyword);
  //   await topBar.clickSearchIcon();
  //   await page.waitForTimeout(2500); // đủ thời gian để điều hướng nếu icon hoạt động
  //   expect(page.url()).toContain("/timkiem");
  // });

  test("TC_SEARCH_03: Click icon kính lúp kích hoạt tìm kiếm", async ({
    page,
    homePage,
  }) => {
    const keyword = SEARCH_DATA.simpleKeyword;
    const topBar = homePage.getTopBarComponent();

    await topBar.enterResearchInput(keyword);
    await topBar.clickSearchIcon();

    await expect(page).toHaveURL((url) => {
      const decodedPath = decodeURIComponent(url.pathname);

      return decodedPath.includes("/timkiem") && decodedPath.includes(keyword);
    });
  });

  test("TC_SEARCH_04: Tìm với từ khóa không dấu -> có kết quả", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage
      .getTopBarComponent()
      .searchCourse(SEARCH_DATA.validKeywordNoAccent);
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_05: Tìm với từ khóa có dấu tiếng Việt -> có kết quả", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage
      .getTopBarComponent()
      .searchCourse(SEARCH_DATA.validKeywordAccent);
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_06: Bỏ trống ô tìm kiếm -> hiển thị thông báo Vui lòng điền vào ô trống", async ({
    page,
    homePage,
  }) => {
    await homePage.getTopBarComponent().pressEnterButtonToSearch();
    await expect(page.getByText(/Vui lòng điền/i).first()).toBeVisible({
      timeout: 4000,
    });
  });

  test("TC_SEARCH_07: Ký tự đặc biệt -> 0 kết quả, không lỗi", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage.getTopBarComponent().searchCourse(SEARCH_DATA.specialChars);
    expect(await searchResultPage.resultLabelCount()).toBe(0);
    expect(await searchResultPage.courseCount()).toBe(0);
  });

  test("TC_SEARCH_08: Từ khóa không tồn tại -> 0 kết quả", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage
      .getTopBarComponent()
      .searchCourse(SEARCH_DATA.notFoundKeyword);
    expect(await searchResultPage.resultLabelCount()).toBe(0);
    expect(await searchResultPage.courseCount()).toBe(0);
  });

  test("TC_SEARCH_09: Chỉ toàn khoảng trắng -> 0 kết quả (BUG đã ghi nhận theo AC)", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage
      .getTopBarComponent()
      .searchCourse(SEARCH_DATA.whitespaceOnly);
    expect(await searchResultPage.resultLabelCount()).toBe(0);
  });

  test("TC_SEARCH_10: Trim khoảng trắng đầu/cuối -> kết quả giống từ khóa đã trim", async ({
    homePage,
    searchResultPage,
  }) => {
    test.slow(); // 2 lần search liên tiếp
    await homePage.getTopBarComponent().searchCourse(SEARCH_DATA.simpleKeyword);
    const trimmedCount = await searchResultPage.courseCount();

    await homePage.open();
    await homePage.getTopBarComponent().searchCourse(SEARCH_DATA.withSpaces);
    const withSpacesCount = await searchResultPage.courseCount();

    expect(trimmedCount).toBeGreaterThan(0);
    expect(withSpacesCount).toBe(trimmedCount);
  });

  test("TC_SEARCH_11: Nhập số dương -> 0 kết quả, không lỗi hệ thống", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage
      .getTopBarComponent()
      .searchCourse(SEARCH_DATA.positiveNumber);
    expect(await searchResultPage.resultLabelCount()).toBe(0);
    expect(await searchResultPage.courseCount()).toBe(0);
  });

  test("TC_SEARCH_12: Nhập số âm / thập phân -> 0 kết quả, không lỗi hệ thống", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage
      .getTopBarComponent()
      .searchCourse(SEARCH_DATA.negativeNumber);
    expect(await searchResultPage.resultLabelCount()).toBe(0);
    expect(await searchResultPage.courseCount()).toBe(0);
  });

  test("TC_SEARCH_13: Nhập chuỗi hơn 100 ký tự -> 0 kết quả, layout không vỡ", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage.getTopBarComponent().searchCourse(SEARCH_DATA.veryLong);
    expect(await searchResultPage.resultLabelCount()).toBe(0);
    expect(await searchResultPage.courseCount()).toBe(0);
    await expect(homePage.getTopBarComponent().getSearchInput()).toBeVisible();
  });

  test("TC_SEARCH_14: Nhập một phần của từ khóa (partial match) -> có kết quả", async ({
    homePage,
    searchResultPage,
  }) => {
    await homePage
      .getTopBarComponent()
      .searchCourse(SEARCH_DATA.partialKeyword);
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_15: Copy-paste từ khóa vào ô tìm kiếm -> có kết quả", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    // insertText mô phỏng thao tác paste (chỉ bắn input event, không gõ từng phím)
    const topBar = homePage.getTopBarComponent();
    const searchBox = topBar.getSearchInput();
    await searchBox.click();
    await page.keyboard.insertText(SEARCH_DATA.validKeyword);
    await expect(searchBox).toHaveValue(SEARCH_DATA.validKeyword);
    await topBar.submitSearchAndWaitResults();
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_16: Icon kính lúp không đè lên text khi nhập chuỗi dài", async ({
    homePage,
  }) => {
    const searchBox = homePage.getTopBarComponent().getSearchInput();
    await searchBox.click();
    const boxBefore = await searchBox.boundingBox();

    const longText = "chuoi rat dai ".repeat(10); // ~140 ký tự (< 200)
    await searchBox.fill(longText);
    await expect(searchBox).toHaveValue(longText);

    // ô input không bị icon làm biến dạng và icon vẫn hiển thị ở nền
    const boxAfter = await searchBox.boundingBox();
    expect(boxAfter?.width).toBe(boxBefore?.width);
    const bgImage = await searchBox.evaluate(
      (el) => getComputedStyle(el).backgroundImage,
    );
    expect(bgImage).toMatch(/search/i);
  });

  test("TC_SEARCH_17: Xóa từ khóa sau khi nhập -> ô trở về mặc định với placeholder", async ({
    homePage,
  }) => {
    const topBar = homePage.getTopBarComponent();
    await topBar.enterResearchInput(SEARCH_DATA.simpleKeyword);
    await topBar.clearSearchInput();

    const searchBox = topBar.getSearchInput();
    await expect(searchBox).toHaveValue("");
    await expect(searchBox).toHaveAttribute("placeholder", "Tìm kiếm");
  });

  test("TC_SEARCH_18: Tìm kiếm nhiều lần liên tiếp -> kết quả cập nhật theo từ khóa mới", async ({
    homePage,
    searchResultPage,
  }) => {
    test.slow(); // 2 lần search liên tiếp
    const topBar = homePage.getTopBarComponent();

    await topBar.searchCourse(SEARCH_DATA.partialKeyword);
    expect(searchResultPage.getDecodedUrl()).toContain(
      SEARCH_DATA.partialKeyword,
    );
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);

    // đang ở trang kết quả, nhập từ khóa mới đè lên từ khóa cũ rồi Enter
    await topBar.searchCourse(SEARCH_DATA.simpleKeyword);
    expect(searchResultPage.getDecodedUrl()).toContain(
      SEARCH_DATA.simpleKeyword,
    );
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_19: Tìm kiếm với từ khóa hợp lệ khi đã đăng nhập", async ({
    page,
    homePage,
    loginPage,
    registerPage,
    searchResultPage,
  }) => {
    test.slow(); // register + login + search
    // Tài khoản trên site demo bị reset thường xuyên nên đăng ký mới rồi
    // đăng nhập bằng chính tài khoản đó (theo pattern của register.spec).
    const account = "tsg6" + Date.now().toString(36);
    const password = SEARCH_DATA.registerPassword;

    await homePage.getTopBarComponent().navigateToLoginPage();
    await loginPage.clickTranslateRegisterButton();
    await registerPage.enterAccountInput(account);
    await registerPage.enterFullnameInput("Testing Playwright");
    await registerPage.enterPasswordInput(password);
    await registerPage.enterEmailInput(`${account}@gmail.com`);
    await registerPage.enterPhoneNumber("0912345678");
    await registerPage.chooseGroupCode();
    await registerPage.clickRegisterButton();
    await expect(page.getByText("Đăng kí thành công")).toBeVisible();
    // modal swal không chặn form bên dưới; chuyển sang panel đăng nhập luôn
    await page.keyboard.press("Escape");
    await page.waitForTimeout(800);
    await registerPage.clickReturnLoginButton();
    await page.waitForTimeout(500);

    // dùng từng method riêng của LoginPage (không dùng login() gộp vì hàm đó
    // còn click thêm link Quên mật khẩu + nút Đăng ký sau khi submit)
    await loginPage.enterAccounttInput(account);
    await loginPage.enterPasswordInput(password);
    await loginPage.clickLoginButton();
    // đăng nhập thành công: site tự chuyển về trang chủ và nút Đăng nhập biến mất
    await expect(page).toHaveURL(/demo2\.cybersoft\.edu\.vn\/?$/, {
      timeout: 15000,
    });
    await expect(page.getByRole("button", { name: "Đăng nhập" })).toBeHidden();

    await homePage.open();
    await homePage.getTopBarComponent().searchCourse(SEARCH_DATA.simpleKeyword);
    await expect(page).toHaveURL(/\/timkiem\//);
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });

  test("TC_SEARCH_20: Không phân biệt chữ HOA/thường (3 biến thể cùng kết quả)", async ({
    homePage,
    searchResultPage,
  }) => {
    test.slow(); // 3 lần search liên tiếp
    const variants = ["backend", "BACKEND", "BaCkEnD"];
    const counts: number[] = [];

    for (const keyword of variants) {
      await homePage.open();
      await homePage.getTopBarComponent().searchCourse(keyword);
      counts.push(await searchResultPage.courseCount());
    }

    expect(counts[0]).toBeGreaterThan(0);
    expect(counts[1]).toBe(counts[0]);
    expect(counts[2]).toBe(counts[0]);
  });
});

test.describe("Tìm kiếm khóa học - Mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("TC_SEARCH_21: Ô tìm kiếm hiển thị và dùng được trên mobile (BUG đã ghi nhận)", async ({
    homePage,
  }) => {
    await homePage.open();
    await expect(
      homePage.getTopBarComponent().getSearchInput(),
    ).toBeInViewport();
  });
});

test.describe("Tìm kiếm khóa học - Tablet", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("TC_SEARCH_22: Ô tìm kiếm hiển thị và hoạt động đúng trên tablet", async ({
    page,
    homePage,
    searchResultPage,
  }) => {
    await homePage.open();
    await expect(
      homePage.getTopBarComponent().getSearchInput(),
    ).toBeInViewport();

    await homePage.getTopBarComponent().searchCourse(SEARCH_DATA.simpleKeyword);
    await expect(page).toHaveURL(/\/timkiem\//);
    expect(await searchResultPage.courseCount()).toBeGreaterThan(0);
  });
});
