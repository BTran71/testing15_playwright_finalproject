import { Locator, Page, test } from "@playwright/test";
import { CourseListingPage } from "./CourseListingPage";
import { RouteConstants } from "../constants/RouteConstants";
import { TimeOutConstants } from "../constants/TimeOutConstants";

/**
 * CategoryNavigation: trang "Khóa học theo danh mục" (/danhmuckhoahoc/<mã>).
 */
export class CategoryNavigation extends CourseListingPage {
  private readonly banner: Locator;
  private readonly categoryChip: Locator;

  constructor(page: Page) {
    super(page);
    this.banner = page.locator("div.titleCourse");
    this.categoryChip = page.locator(".courseCateName .listCourseTitle");
  }

  /**
   * Mở trực tiếp URL /danhmuckhoahoc/<mã> và chờ lưới card render khớp data.
   * Cửa sổ chờ response dùng TIME_OUT_MEDIUM vì tính từ TRƯỚC khi goto.
   */
  async open(
    categoryCode: string,
    timeOut: number = TimeOutConstants.TIME_OUT_MEDIUM,
  ) {
    await test.step(`Mở trang danh mục ${categoryCode} bằng URL trực tiếp`, async () => {
      const apiDone = this.waitForApiResponse(
        [RouteConstants.API_COURSE_BY_CATEGORY, `maDanhMuc=${categoryCode}`],
        timeOut,
      );
      await this.page.goto(RouteConstants.category(categoryCode), {
        waitUntil: "domcontentloaded",
      });
      await this.waitForCountToMatchResponse(this.courseCards, await apiDone);
    });
  }

  /**
   * Điều hướng như user thật: hover menu DANH MỤC rồi click lĩnh vực.
   */
  async openViaMenu(
    categoryCode: string,
    timeOut: number = TimeOutConstants.TIME_OUT_API,
  ) {
    await test.step(`Điều hướng tới danh mục ${categoryCode} qua menu DANH MỤC`, async () => {
      const topBar = this.getTopBarComponent();
      await topBar.hoverCategory();
      const apiDone = this.waitForApiResponse(
        [RouteConstants.API_COURSE_BY_CATEGORY, `maDanhMuc=${categoryCode}`],
        timeOut,
      );
      await topBar.getCategoryMenuItem(categoryCode).click();
      await this.waitForCountToMatchResponse(this.courseCards, await apiDone);
    });
  }

  /** Banner "Khóa học theo danh mục". */
  getBanner(): Locator {
    return this.banner;
  }

  getBannerTitle(): Locator {
    return this.banner.locator("h3");
  }

  /** Chip tên lĩnh vực phía trên lưới card (vd "Lập trình Backend"). */
  getCategoryChip(): Locator {
    return this.categoryChip;
  }

  // ===== thành phần riêng trên card của trang danh mục =====
  getCardFavoriteBadge(index = 0): Locator {
    return this.courseCards.nth(index).getByText(/Yêu thích/i);
  }

  /** Dòng mô tả ngắn trên thân card. */
  getCardDescription(index = 0): Locator {
    return this.courseCards.nth(index).locator(".cardBodyGlobal h6");
  }

  /** 3 thông tin thời lượng trên thân card (giờ / tuần / cấp độ). */
  getCardDurationInfos(index = 0): Locator {
    return this.courseCards
      .nth(index)
      .locator(".cardIcon")
      .first()
      .locator("span");
  }

  getCardTeacher(index = 0): Locator {
    return this.courseCards.nth(index).locator(".cardFooter .titleMaker span");
  }
}
