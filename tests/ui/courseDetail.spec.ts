import { expect, test } from "../../fixtures/page-fixture";
import { COURSE_DETAIL_DATA } from "../../test-data/course-detail-data";
import { COURSE_LIST_DATA } from "../../test-data/course-list-data";
import { CATEGORY_DATA } from "../../test-data/category-data";

/**
 * Chức năng: XEM CHI TIẾT KHÓA HỌC /chitiet/<mã> (Epic Khám Phá Khóa Học - US-03)
 * Nguồn: sheet "Xem chi tiết khóa học" (TC_1 -> TC_54) - map TC_DETAIL_xx <-> TC_xx.
 */

test.describe("Xem chi tiết khóa học", () => {
  // BUG đã ghi nhận khi test maunal - một số card trên trang chủ có link
  // /chitiet/ KHÔNG kèm courseId -> click ra trang 404.
  // Test assert theo expected result -> FAIL cho tới khi dev fix data.
  test("TC_DETAIL_01: Card khóa học trên trang chủ điều hướng tới trang chi tiết hợp lệ", async ({
    homePage,
    courseListingPage,
  }, testInfo) => {
    await homePage.open();
    expect(await courseListingPage.cardCount()).toBeGreaterThan(0);
    // quét link mọi card; gặp card link rỗng thì method tự chụp trang 404
    // đính vào report làm bằng chứng
    const invalidCards = await courseListingPage.scanInvalidCourseLinks(
      testInfo,
      "trang-chu",
    );
    expect(invalidCards).toEqual([]);
  });

  test('TC_DETAIL_02: Click button "Xem chi tiết" trên card điều hướng đúng', async ({
    page,
    homePage,
    courseListingPage,
    courseDetailPage,
  }) => {
    await homePage.open();
    await courseListingPage.openCourseViaDetailButton();
    await expect(page).toHaveURL(/\/chitiet\/.+/);
    await expect(courseDetailPage.getCourseTitle()).toBeVisible();
  });

  test("TC_DETAIL_03: Truy cập trực tiếp URL hợp lệ hiển thị trang chi tiết", async ({
    page,
    courseDetailPage,
  }) => {
    test.slow(); // mở lần lượt 2 courseId
    for (const courseId of [
      COURSE_DETAIL_DATA.primaryCourseId,
      COURSE_DETAIL_DATA.secondaryCourseId,
    ]) {
      await courseDetailPage.open(courseId);
      await expect(page).toHaveURL(new RegExp(`/chitiet/${courseId}`));
      await expect(courseDetailPage.getCourseTitle()).toBeVisible();
      await expect(courseDetailPage.getSidebar()).toBeVisible();
    }
  });

  test("TC_DETAIL_05: Reload trang giữ nguyên dữ liệu hiển thị", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const titleBefore = await courseDetailPage.getCourseTitle().textContent();
    await courseDetailPage.reload();
    await expect(courseDetailPage.getCourseTitle()).toHaveText(titleBefore!);
    expect(await courseDetailPage.cardCount()).toBeGreaterThan(0);
  });

  test("TC_DETAIL_06: Back và Forward của trình duyệt điều hướng đúng", async ({
    page,
    homePage,
    courseListingPage,
    courseDetailPage,
  }) => {
    await homePage.open();
    await courseListingPage.openFirstRealCourse();
    await expect(page).toHaveURL(/\/chitiet\/.+/);

    await page.goBack({ waitUntil: "domcontentloaded" });
    await expect(page).not.toHaveURL(/\/chitiet\//);

    await page.goForward({ waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/chitiet\/.+/);
    await expect(courseDetailPage.getCourseTitle()).toBeVisible();
  });

  test('TC_DETAIL_08: Button "Quay về trang chủ" trên trang lỗi 404 điều hướng về trang chủ', async ({
    page,
    homePage,
    categoryNavigationPage,
    courseDetailPage,
  }) => {
    test.slow(); // trang chủ -> danh mục -> trang 404 -> trang chủ
    // Theo steps sheet: vào danh mục "Lập trình di động", click card có link
    // /chitiet/ rỗng (bug TC_9 sheet Điều hướng theo danh mục) -> trang 404
    await homePage.open();
    await categoryNavigationPage.openViaMenu("DiDong");
    const hrefs = await categoryNavigationPage.getAllCardHrefs();
    const brokenIndex = hrefs.findIndex((href) => /\/chitiet\/?$/.test(href));
    if (brokenIndex >= 0) {
      await categoryNavigationPage.getCourseCards().nth(brokenIndex).click();
    } else {
      // data đã được dọn (hết card link rỗng) -> vào thẳng trang 404 để
      // giữ đúng precondition "Đang ở trang lỗi 404"
      await courseDetailPage.open404Page();
    }
    await expect(courseDetailPage.get404Message()).toBeVisible();

    await courseDetailPage.get404BackToHomeButton().click();
    // hệ thống chuyển hướng về trang chủ /trangchu
    await expect(page).toHaveURL(/\/trangchu/);
  });

  test("TC_DETAIL_09: Trang chi tiết hiển thị đầy đủ các khu vực chính", async ({
    page,
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getBanner()).toBeVisible();
    await expect(courseDetailPage.getIntroBlocks()).toHaveCount(3);
    await expect(courseDetailPage.getWillLearnBox()).toBeVisible();
    await expect(
      page.getByText("Nội dung khóa học", { exact: true }),
    ).toBeVisible();
    await expect(courseDetailPage.getSidebar()).toBeVisible();
    await expect(page.getByText("Khóa học tham khảo").first()).toBeVisible();
    expect(await courseDetailPage.cardCount()).toBeGreaterThan(0);
  });

  test("TC_DETAIL_10: Header hiển thị đầy đủ khi chưa đăng nhập", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const topBar = courseDetailPage.getTopBarComponent();
    await expect(topBar.getLogo()).toBeVisible();
    await expect(topBar.getSearchInput()).toBeVisible();
    await expect(topBar.getCategoryLink()).toBeVisible();
    await expect(topBar.getCourseLink()).toBeVisible();
    await expect(topBar.getBlogLink()).toBeVisible();
    await expect(topBar.getEventLink()).toBeVisible();
    await expect(topBar.getInformationLink()).toBeVisible();
    await expect(topBar.getLoginButton()).toBeVisible();
  });

  test("TC_DETAIL_11: Header hiển thị đầy đủ khi đã đăng nhập", async ({
    page,
    homePage,
    loginPage,
    courseDetailPage,
  }) => {
    test.slow(); // đăng nhập + mở trang chi tiết
    // Đăng nhập bằng tài khoản cố định theo cột Test Data của sheet
    await homePage.open();
    await homePage.getTopBarComponent().navigateToLoginPage();
    await loginPage.enterAccounttInput(COURSE_DETAIL_DATA.loginAccount);
    await loginPage.enterPasswordInput(COURSE_DETAIL_DATA.loginPassword);
    await loginPage.clickLoginButton();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 20000 });

    // Đã đăng nhập: truy cập trực tiếp trang chi tiết và kiểm tra header
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const topBar = courseDetailPage.getTopBarComponent();
    await expect(topBar.getLogo()).toBeVisible();
    await expect(topBar.getSearchInput()).toBeVisible();
    await expect(topBar.getSearchInput()).toHaveAttribute(
      "placeholder",
      "Tìm kiếm",
    );
    await expect(topBar.getCategoryLink()).toBeVisible();
    await expect(topBar.getCourseLink()).toBeVisible();
    await expect(topBar.getBlogLink()).toBeVisible();
    await expect(topBar.getEventLink()).toBeVisible();
    await expect(topBar.getInformationLink()).toBeVisible();
    // avatar user hiển thị ở góc phải, KHÔNG còn button "Đăng nhập"
    await expect(topBar.getUserAvatar()).toBeVisible();
    await expect(topBar.getLoginButton()).toBeHidden();
  });

  test("TC_DETAIL_12: Logo hiển thị đúng khi điều hướng từ trang chủ vào chi tiết", async ({
    page,
    homePage,
    categoryNavigationPage,
  }) => {
    test.slow(); // trang chủ -> danh mục -> chi tiết
    await homePage.open();
    await categoryNavigationPage.openViaMenu("BackEnd");
    await categoryNavigationPage.openFirstRealCourse();
    await expect(page).toHaveURL(/\/chitiet\/.+/);
    expect(
      await categoryNavigationPage.getTopBarComponent().isLogoLoaded(),
    ).toBe(true);
  });

  // BUG đã ghi nhận khi test maunal - logo dùng src tương đối "./logo.png" nên
  // khi truy cập TRỰC TIẾP URL /chitiet/<id> ảnh bị 404 (naturalWidth = 0).
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_DETAIL_13: Logo hiển thị đúng khi truy cập trực tiếp URL ", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const topBar = courseDetailPage.getTopBarComponent();
    await expect(topBar.getLogo()).toBeVisible();
    expect(await topBar.isLogoLoaded()).toBe(true);
  });

  test("TC_DETAIL_14: Scroll xuống header ghim cố định và hiện nút back-to-top", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await courseDetailPage.scrollToBottom();
    await expect(courseDetailPage.getTopBarComponent().getLogo()).toBeVisible(); // header vẫn hiển thị khi đã cuộn xuống cuối
    await expect(courseDetailPage.getBackToTopButton()).toBeVisible();
  });

  test("TC_DETAIL_15: Banner hiển thị tiêu đề và slogan", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getBannerTitle()).toHaveText(
      COURSE_DETAIL_DATA.bannerTitle,
    );
    await expect(courseDetailPage.getBannerSubtitle()).toContainText(
      COURSE_DETAIL_DATA.bannerSubtitle,
    );
  });

  // BUG đã ghi nhận khi test maunal - tên khóa học hiển thị LUÔN là
  // "LẬP TRÌNH FRONT-END CHUYÊN NGHIỆP", không khớp dữ liệu backend.
  // Test đối chiếu với payload API LayThongTinKhoaHoc -> FAIL cho tới khi dev fix.
  test("TC_DETAIL_16: Tên khóa học hiển thị đúng dữ liệu backend ", async ({
    courseDetailPage,
  }) => {
    const payload = await courseDetailPage.open(
      COURSE_DETAIL_DATA.primaryCourseId,
    );
    expect(
      payload?.tenKhoaHoc,
      "Không đọc được tenKhoaHoc từ API",
    ).toBeTruthy();
    await expect(courseDetailPage.getCourseTitle()).toContainText(
      payload.tenKhoaHoc,
      { ignoreCase: true, timeout: 4000 },
    );
  });

  test("TC_DETAIL_17: Hiển thị Giảng viên, Lĩnh vực và Đánh giá", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const instructor = courseDetailPage.getIntroBlock("Giảng viên");
    await expect(instructor).toBeVisible();
    await expect(instructor.locator("img")).toBeVisible(); // avatar giảng viên
    await expect(
      instructor.locator(".instrutorTitle p").nth(1),
    ).not.toBeEmpty();

    const category = courseDetailPage.getIntroBlock("Lĩnh vực");
    await expect(category).toBeVisible();
    await expect(courseDetailPage.getCategoryFieldValue()).not.toBeEmpty();

    const rating = courseDetailPage.getRatingBlock();
    await expect(rating).toBeVisible();
    await expect(rating).toContainText(/\d(\.\d)?/); // điểm đánh giá
    await expect(rating).toContainText(/\d+\s*đánh giá/); // số lượt đánh giá
  });

  test("TC_DETAIL_18: Mô tả khóa học hiển thị đầy đủ, không lỗi dữ liệu", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const description = courseDetailPage.getDescription();
    await expect(description).toBeVisible();
    const text = (await description.textContent()) ?? "";
    expect(text.trim().length).toBeGreaterThan(0);
    expect(text).not.toMatch(/undefined|null/i);
  });

  test('TC_DETAIL_19: Phần "Những gì bạn sẽ học" hiển thị danh sách 2 cột', async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getWillLearnBox()).toContainText(
      "Những gì bạn sẽ học",
    );
    expect(await courseDetailPage.getWillLearnItems().count()).toBeGreaterThan(
      0,
    );
    await expect(courseDetailPage.getWillLearnColumns()).toHaveCount(2);
  });

  test('TC_DETAIL_20: Phần "Nội dung khóa học" hiển thị đủ các mục học', async ({
    page,
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(
      page.getByText("Nội dung khóa học", { exact: true }),
    ).toBeVisible();
    const sectionCount = await courseDetailPage.getCurriculumSections().count();
    expect(sectionCount).toBeGreaterThan(0);
    for (let i = 0; i < sectionCount; i++) {
      await expect(courseDetailPage.getSectionTitle(i)).toHaveText(/Mục \d+/);
      expect(await courseDetailPage.getLessonRows(i).count()).toBeGreaterThan(
        0,
      );
    }
  });

  test('TC_DETAIL_22: Button "Xem trước" hiển thị trên mỗi mục học và click được', async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const sectionCount = await courseDetailPage.getCurriculumSections().count();
    const previewButtons = courseDetailPage.getPreviewButtons();
    await expect(previewButtons).toHaveCount(sectionCount);
    for (let i = 0; i < sectionCount; i++) {
      await expect(previewButtons.nth(i)).toBeVisible();
      await expect(previewButtons.nth(i)).toBeEnabled();
    }
  });

  test('TC_DETAIL_23: Phần "Khóa học tham khảo" hiển thị dưới nội dung khóa học', async ({
    page,
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const refTitle = page.getByText("Khóa học tham khảo").first();
    await refTitle.scrollIntoViewIfNeeded();
    await expect(refTitle).toBeVisible();
    // nằm BÊN DƯỚI phần "Nội dung khóa học"
    const curriculumBox = await courseDetailPage
      .getCurriculumSections()
      .first()
      .boundingBox();
    const refBox = await refTitle.boundingBox();
    expect(refBox!.y).toBeGreaterThan(curriculumBox!.y);
  });

  test("TC_DETAIL_24: Khóa học tham khảo hiển thị tối đa 4 card cùng hàng", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const cardTotal = await courseDetailPage.cardCount();
    expect(cardTotal).toBeGreaterThan(0);
    expect(cardTotal).toBeLessThanOrEqual(COURSE_DETAIL_DATA.maxRefCards);

    // đo mọi card trong cùng 1 khoảnh khắc để không dính xô layout khi load ảnh
    const boxes = await courseDetailPage.getCardBoxes();
    for (const box of boxes.slice(1)) {
      expect(Math.abs(box.y - boxes[0].y)).toBeLessThanOrEqual(2); // cùng 1 hàng
    }
  });

  test("TC_DETAIL_25: Card khóa học tham khảo đồng nhất kích thước", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const boxes = await courseDetailPage.getCardBoxes();
    expect(boxes.length).toBeGreaterThan(1);
    for (const box of boxes.slice(1)) {
      expect(Math.abs(box.width - boxes[0].width)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.height - boxes[0].height)).toBeLessThanOrEqual(1);
    }
  });

  test("TC_DETAIL_26: Hình ảnh trên card tham khảo load thành công", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const cardTotal = await courseDetailPage.cardCount();
    for (let i = 0; i < cardTotal; i++) {
      const image = courseDetailPage.getCardImage(i);
      await expect(image).toBeVisible();
      await expect
        .poll(() => courseDetailPage.isImageLoaded(image), {
          timeout: 10000,
          message: `Ảnh card thứ ${i + 1} không load được`,
        })
        .toBe(true);
    }
  });

  test('TC_DETAIL_27: Badge "Yêu thích" hiển thị trên card tham khảo', async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const cardTotal = await courseDetailPage.cardCount();
    for (let i = 0; i < cardTotal; i++) {
      await expect(courseDetailPage.getCardFavoriteBadge(i)).toBeVisible();
    }
  });

  // BUG đã ghi nhận khi test maunal - nhãn trên card tham khảo hiển thị sai data
  // (không phải tên lĩnh vực hợp lệ). Test assert nhãn phải là 1 trong 6 lĩnh
  // vực của hệ thống -> FAIL cho tới khi dev fix.
  test("TC_DETAIL_28: Nhãn lĩnh vực trên card tham khảo hiển thị đúng dữ liệu ", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const validNames = CATEGORY_DATA.categories.map((c) =>
      c.name.toLowerCase(),
    );
    const labels = await courseDetailPage.getAllCardNames();
    expect(labels.length).toBeGreaterThan(0);
    const invalidLabels = labels.filter(
      (label) => !validNames.includes(label.trim().toLowerCase()),
    );
    expect(invalidLabels).toEqual([]);
  });

  test("TC_DETAIL_30: Thời lượng / số tuần / trình độ hiển thị trên card tham khảo", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const cardTotal = await courseDetailPage.cardCount();
    for (let i = 0; i < cardTotal; i++) {
      await expect(courseDetailPage.getCardDurationInfos(i)).toHaveCount(3);
    }
  });

  test("TC_DETAIL_31: Thông tin giảng viên hiển thị trên card tham khảo", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const cardTotal = await courseDetailPage.cardCount();
    for (let i = 0; i < cardTotal; i++) {
      await expect(courseDetailPage.getCardTeacher(i)).not.toBeEmpty();
    }
  });

  test("TC_DETAIL_32: Giá trên card tham khảo đúng định dạng, giá gốc gạch ngang", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const cardTotal = await courseDetailPage.cardCount();
    for (let i = 0; i < Math.min(cardTotal, 3); i++) {
      const prices = courseDetailPage.getCardPrices(i);
      await expect(prices).toHaveCount(2);
      await expect(prices.nth(0)).toHaveText(COURSE_LIST_DATA.pricePattern);
      await expect(prices.nth(0)).toHaveCSS(
        "text-decoration-line",
        "line-through",
      );
    }
  });

  // BUG đã ghi nhận khi test maunal - thumbnail khu đăng ký không thay đổi theo
  // khóa học (mọi courseId đều hiển thị cùng 1 ảnh).
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_DETAIL_34: Thumbnail khu đăng ký hiển thị và thay đổi theo khóa học ", async ({
    courseDetailPage,
  }, testInfo) => {
    test.slow(); // mở lần lượt 2 courseId để đối chiếu
    // chụp BẰNG CHỨNG của cả 2 khóa học trước, assert sau - dù fail kiểu nào
    // (mất ảnh hay ảnh không đổi) report cũng có đủ ảnh đối chiếu
    const sources: (string | null)[] = [];
    const loadedFlags: boolean[] = [];
    for (const courseId of [
      COURSE_DETAIL_DATA.primaryCourseId,
      COURSE_DETAIL_DATA.secondaryCourseId,
    ]) {
      await courseDetailPage.open(courseId);
      await courseDetailPage.getSidebar().scrollIntoViewIfNeeded();
      await courseDetailPage.attachScreenshot(
        testInfo,
        `bang-chung-thumbnail_khoa-${courseId}`,
      );
      const thumbnail = courseDetailPage.getSidebarThumbnail();
      sources.push(await thumbnail.getAttribute("src"));
      loadedFlags.push(await courseDetailPage.isImageLoaded(thumbnail));
    }

    // thumbnail phải load được (không mất/vỡ ảnh)...
    expect(
      loadedFlags,
      `Trạng thái load thumbnail của 2 khóa học: ${JSON.stringify(loadedFlags)}`,
    ).toEqual([true, true]);
    // ...và phải thay đổi tương ứng khi đổi courseId
    expect(sources[1]).not.toBe(sources[0]);
  });

  test("TC_DETAIL_35: Giá khóa học trong khu đăng ký hiển thị đúng định dạng", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getSidebarPrice()).toHaveText(
      /\d{1,3}(\.\d{3})*đ/,
    );
    await expect(
      courseDetailPage.getSidebarPrice().locator("i.fa-bolt"),
    ).toBeVisible();
  });

  test('TC_DETAIL_36: Button "Đăng ký" hiển thị và ở trạng thái enable', async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getRegisterButton()).toBeVisible();
    await expect(courseDetailPage.getRegisterButton()).toBeEnabled();
  });

  test("TC_DETAIL_37: Khu đăng ký hiển thị đủ 5 dòng thông tin chi tiết", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getSidebarInfoRows()).toHaveCount(5);
    for (const label of COURSE_DETAIL_DATA.regInfoLabels) {
      await expect(
        courseDetailPage.getSidebarInfoRows().filter({ hasText: label }),
      ).toHaveCount(1);
    }
  });

  test("TC_DETAIL_38: Ô nhập mã giảm giá hiển thị và nhập được", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const couponInput = courseDetailPage.getCouponInput();
    await expect(couponInput).toBeVisible();
    await expect(couponInput).toBeEditable();
    await couponInput.fill("MA_GIAM_GIA");
    await expect(couponInput).toHaveValue("MA_GIAM_GIA");
  });

  test("TC_DETAIL_39: Footer hiển thị đầy đủ trên trang chi tiết", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const footer = courseDetailPage.getFooterComponent();
    await footer.getFooter().scrollIntoViewIfNeeded();
    await expect(footer.getFooter()).toContainText(
      COURSE_LIST_DATA.footerHotline,
    );
    await expect(footer.getFooter()).toContainText(
      COURSE_LIST_DATA.footerEmail,
    );
    await expect(footer.getConsultNameInput()).toBeVisible();
    await expect(footer.getConsultSubmitButton()).toBeVisible();
  });

  // BUG đã ghi nhận khi test maunal - click tiêu đề mục học nhưng danh sách
  // bài học KHÔNG thu gọn lại (accordion không hoạt động).
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_DETAIL_40: Đóng/mở danh sách bài học của mục học ", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const firstSectionLessons = courseDetailPage.getLessonRows(0);
    expect(await firstSectionLessons.count()).toBeGreaterThan(0);
    await expect(firstSectionLessons.first()).toBeVisible();

    await courseDetailPage.getSectionTitle(0).click();
    // sau khi click, danh sách bài học của mục đó phải thu gọn (ẩn đi)
    await expect(firstSectionLessons.first()).toBeHidden({ timeout: 4000 });
  });

  // BUG đã ghi nhận khi test maunal - click "Xem trước" không có phản ứng,
  // không mở được trình phát video.
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test('TC_DETAIL_41: Click "Xem trước" mở trình phát video ', async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await courseDetailPage.getPreviewButtons().first().click();
    await expect(courseDetailPage.getPreviewPlayer()).toBeVisible({
      timeout: 4000,
    });
  });

  // BUG đã ghi nhận khi test maunal - click khóa học tham khảo: URL đổi sang
  // courseId mới nhưng NỘI DUNG trang không cập nhật theo khóa học mới.
  // Test assert theo expected result -> FAIL cho tới khi dev fix.
  test("TC_DETAIL_51: Nội dung cập nhật khi chuyển sang khóa học tham khảo ", async ({
    page,
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    const titleBefore = await courseDetailPage.getCourseTitle().textContent();

    // tìm card tham khảo hợp lệ trỏ tới khóa học KHÁC khóa hiện tại
    const hrefs = await courseDetailPage.getAllCardHrefs();
    const targetIndex = hrefs.findIndex(
      (href) =>
        /\/chitiet\/.{2,}/.test(href) &&
        !href.includes(COURSE_DETAIL_DATA.primaryCourseId),
    );
    expect(
      targetIndex,
      "Không có card tham khảo hợp lệ",
    ).toBeGreaterThanOrEqual(0);
    const targetId = hrefs[targetIndex].split("/chitiet/")[1];

    await courseDetailPage.getCourseCards().nth(targetIndex).click();
    await expect(page).toHaveURL(new RegExp(`/chitiet/${targetId}`));
    // nội dung trang phải đổi theo khóa học mới
    await expect(courseDetailPage.getCourseTitle()).not.toHaveText(
      titleBefore!,
      { timeout: 4000 },
    );
  });
});

test.describe("Xem chi tiết khóa học - Mobile", () => {
  test.use({ viewport: { width: 500, height: 900 } });

  test("TC_DETAIL_53: Trang chi tiết responsive trên mobile", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getBanner()).toBeVisible();
    await expect(courseDetailPage.getCourseTitle()).toBeVisible();

    // card tham khảo xếp 1 cột: 2 card đầu nằm khác hàng
    // (đo mọi card trong cùng 1 khoảnh khắc để không dính xô layout)
    const boxes = await courseDetailPage.getCardBoxes();
    expect(boxes[1].y).toBeGreaterThan(boxes[0].y);
    expect(boxes[0].x + boxes[0].width).toBeLessThanOrEqual(501);

    await courseDetailPage.scrollToBottom();
    await expect(
      courseDetailPage.getFooterComponent().getFooter(),
    ).toBeInViewport();
  });
});

test.describe("Xem chi tiết khóa học - Tablet", () => {
  test.use({ viewport: { width: 900, height: 1024 } });

  test("TC_DETAIL_54: Trang chi tiết responsive trên tablet, card tham khảo 2 cột", async ({
    courseDetailPage,
  }) => {
    await courseDetailPage.open(COURSE_DETAIL_DATA.primaryCourseId);
    await expect(courseDetailPage.getCourseTitle()).toBeVisible();

    // card tham khảo xếp 2 cột: card 1-2 cùng hàng, card 3 xuống hàng dưới
    // (đo mọi card trong cùng 1 khoảnh khắc để không dính xô layout)
    const boxes = await courseDetailPage.getCardBoxes();
    expect(Math.abs(boxes[1].y - boxes[0].y)).toBeLessThanOrEqual(2);
    expect(boxes[2].y).toBeGreaterThan(boxes[0].y);
  });
});
