import { Locator, Page } from "@playwright/test";
import { CourseListingPage } from "./CourseListingPage";
import { RouteConstants } from "../constants/RouteConstants";
import { TimeOutConstants } from "../constants/TimeOutConstants";

/**
 * CategoryNavigation: trang "Khóa học theo danh mục" (/danhmuckhoahoc/<mã>).
 * Kế thừa lưới card từ CourseListingPage; bổ sung chip tên lĩnh vực và
 * các thành phần riêng của card danh mục (badge Yêu thích, mô tả, thời lượng,
 * giảng viên).
 *
 * LƯU Ý: mỗi card ở trang này chứa 2 link chi tiết (chính card + nút
 * "Xem chi tiết" trong overlay) nên đếm số khóa học phải dùng cardCount()
 * (.cardGlobal), KHÔNG dùng courseCount() (đếm link, bị nhân đôi).
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
    const apiDone = this.waitForApiResponse(
      [RouteConstants.API_COURSE_BY_CATEGORY, `maDanhMuc=${categoryCode}`],
      timeOut,
    );
    await this.page.goto(RouteConstants.category(categoryCode), {
      waitUntil: "domcontentloaded",
    });
    await this.waitForCountToMatchResponse(this.courseCards, await apiDone);
  }

  /**
   * Điều hướng như user thật: hover menu DANH MỤC rồi click lĩnh vực.
   * Dùng khi test yêu cầu thao tác qua menu (TC_1 -> TC_4).
   */
  async openViaMenu(
    categoryCode: string,
    timeOut: number = TimeOutConstants.TIME_OUT_API,
  ) {
    const topBar = this.getTopBarComponent();
    await topBar.hoverCategory();
    const apiDone = this.waitForApiResponse(
      [RouteConstants.API_COURSE_BY_CATEGORY, `maDanhMuc=${categoryCode}`],
      timeOut,
    );
    await topBar.getCategoryMenuItem(categoryCode).click();
    await this.waitForCountToMatchResponse(this.courseCards, await apiDone);
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
    return this.courseCards.nth(index).locator(".cardIcon").first().locator("span");
  }

  getCardTeacher(index = 0): Locator {
    return this.courseCards.nth(index).locator(".cardFooter .titleMaker span");
  }
}
