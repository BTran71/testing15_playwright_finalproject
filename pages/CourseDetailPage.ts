import { Locator, Page, test } from "@playwright/test";
import { CourseListingPage } from "./CourseListingPage";
import { RouteConstants } from "../constants/RouteConstants";
import { TimeOutConstants } from "../constants/TimeOutConstants";

/**
 * CourseDetailPage: trang chi tiết khóa học (/chitiet/<mã khóa học>).
 * Kế thừa CourseListingPage để tái dùng bộ getter card cho khu vực
 * "Khóa học tham khảo" (card cùng markup .cardGlobal với trang danh mục).
 */
export class CourseDetailPage extends CourseListingPage {
  private readonly courseTitle: Locator;
  private readonly banner: Locator;
  private readonly introBlocks: Locator;
  private readonly willLearnBox: Locator;
  private readonly curriculumSections: Locator;
  private readonly sidebar: Locator;

  constructor(page: Page) {
    super(page);
    this.courseTitle = page.locator("h4.titleDetailCourse");
    this.banner = page.locator("div.titleCourse");
    this.introBlocks = page.locator(".detailCourseIntro");
    this.willLearnBox = page.locator(".boxCourseLearn");
    this.curriculumSections = page.locator(".courseDetailItem");
    this.sidebar = page.locator(".sideBarCourseDetail");
  }

  /**
   * Mở trang chi tiết và chờ render xong; trả về payload API
   * LayThongTinKhoaHoc (null nếu không bắt được response) để test có thể
   * đối chiếu dữ liệu hiển thị với dữ liệu backend.
   */
  async open(courseId: string): Promise<any | null> {
    let payload: any | null = null;
    await test.step(`Mở trang chi tiết khóa học ${courseId}`, async () => {
      const apiDone = this.waitForApiResponse(
        [RouteConstants.API_COURSE_DETAIL, `maKhoaHoc=${courseId}`],
        TimeOutConstants.TIME_OUT_MEDIUM,
      );
      await this.page.goto(RouteConstants.courseDetail(courseId), {
        waitUntil: "domcontentloaded",
      });
      const response = await apiDone;
      if (response && response.ok()) {
        payload = await response.json().catch(() => null);
      }
      await this.courseTitle
        .waitFor({
          state: "visible",
          timeout: TimeOutConstants.TIME_OUT_RENDER,
        })
        .catch(() => {});
    });
    return payload;
  }

  /** Reload trang chi tiết (F5) và chờ render lại. */
  async reload() {
    await test.step("Reload trang chi tiết và chờ render lại", async () => {
      const apiDone = this.waitForApiResponse(
        RouteConstants.API_COURSE_DETAIL,
        TimeOutConstants.TIME_OUT_MEDIUM,
      );
      await this.page.reload({ waitUntil: "domcontentloaded" });
      await apiDone;
      await this.courseTitle
        .waitFor({
          state: "visible",
          timeout: TimeOutConstants.TIME_OUT_RENDER,
        })
        .catch(() => {});
    });
  }

  // ===== banner & thông tin cơ bản =====
  /** Banner div.titleCourse: <h3>Thông tin khóa học</h3><p>Tiến lên và...</p> */
  getBanner(): Locator {
    return this.banner;
  }

  getBannerTitle(): Locator {
    return this.banner.locator("h3");
  }

  getBannerSubtitle(): Locator {
    return this.banner.locator("p");
  }

  /** Tên khóa học hiển thị trên trang chi tiết. */
  getCourseTitle(): Locator {
    return this.courseTitle;
  }

  /** Cả 3 khối thông tin cơ bản: Giảng viên / Lĩnh vực / Đánh giá. */
  getIntroBlocks(): Locator {
    return this.introBlocks;
  }

  /** Khối thông tin cơ bản theo nhãn (vd "Giảng viên", "Lĩnh vực"). */
  getIntroBlock(label: string): Locator {
    return this.introBlocks.filter({ hasText: label });
  }

  /** Khối đánh giá (sao + điểm + số lượt "N đánh giá"). */
  getRatingBlock(): Locator {
    return this.introBlocks.filter({ hasText: "đánh giá" });
  }

  /**
   * Giá trị trường "Lĩnh vực" trong khối giới thiệu khóa học
   * (cặp <p>Lĩnh vực</p><p>Lập trình Backend</p> trong .instrutorTitle).
   */
  getCategoryFieldValue(): Locator {
    return this.page
      .locator(".instrutorTitle")
      .filter({ hasText: "Lĩnh vực" })
      .locator("p")
      .nth(1);
  }

  // ===== mô tả & "Những gì bạn sẽ học" =====
  /** Đoạn mô tả khóa học (nằm ngay dưới hàng thông tin cơ bản). */
  getDescription(): Locator {
    return this.page.locator(".headDetailCourse ~ p").first();
  }

  getWillLearnBox(): Locator {
    return this.willLearnBox;
  }

  getWillLearnItems(): Locator {
    return this.willLearnBox.locator("li");
  }

  /** 2 cột nội dung của "Những gì bạn sẽ học". */
  getWillLearnColumns(): Locator {
    return this.willLearnBox.locator(".col-6");
  }

  // ===== "Nội dung khóa học" =====
  getCurriculumSections(): Locator {
    return this.curriculumSections;
  }

  /** Tiêu đề "Mục n: ..." của mục học thứ i. */
  getSectionTitle(index = 0): Locator {
    return this.curriculumSections.nth(index).locator(".sectionCourse span");
  }

  /** Các nút "Xem trước" trên từng mục học (KHÔNG gồm nút Đăng ký sidebar). */
  getPreviewButtons(): Locator {
    return this.page.locator(".sectionCourse button.btnPreview");
  }

  /** Danh sách dòng bài học; truyền index để lấy riêng của 1 mục. */
  getLessonRows(sectionIndex?: number): Locator {
    if (sectionIndex === undefined) {
      return this.page.locator(".lessonContent");
    }
    return this.curriculumSections.nth(sectionIndex).locator(".lessonContent");
  }

  /** Trình phát video xem trước (kỳ vọng mở ra khi click "Xem trước"). */
  getPreviewPlayer(): Locator {
    return this.page.locator("video, iframe").first();
  }

  // ===== khu vực đăng ký (sidebar) =====
  getSidebar(): Locator {
    return this.sidebar;
  }

  getSidebarThumbnail(): Locator {
    return this.sidebar.locator("img").first();
  }

  /** Giá khóa học trong sidebar (kèm icon ⚡). */
  getSidebarPrice(): Locator {
    return this.sidebar.locator(".coursePrice p");
  }

  getRegisterButton(): Locator {
    return this.sidebar.getByRole("button", { name: /Đăng ký/i });
  }

  /** 5 dòng thông tin: Ghi danh / Thời gian / Bài học / Video / Trình độ. */
  getSidebarInfoRows(): Locator {
    return this.sidebar.locator(".sideBarDetailContent li");
  }

  getCouponInput(): Locator {
    return this.sidebar.getByPlaceholder("Nhập mã");
  }

  // ===== khác =====
  /** Nút mũi tên cuộn về đầu trang (xuất hiện khi scroll xuống). */
  getBackToTopButton(): Locator {
    return this.page.locator("i.fa-arrow-up");
  }
  // ===== trang lỗi 404 (khi route /chitiet/ không hợp lệ) =====
  /** Thông báo "Có gì đó sai ở đây" trên trang lỗi 404. */
  get404Message(): Locator {
    return this.page.getByText(/Có gì đó sai/i);
  }

  /** Button "QUAY VỀ TRANG CHỦ" trên trang lỗi 404. */
  get404BackToHomeButton(): Locator {
    return this.page.getByText(/quay về trang chủ/i);
  }

  /**
   * Vào thẳng trang 404 qua route /chitiet/ thiếu mã khóa học.
   * Dùng làm đường tắt khi không muốn/không thể đi qua card lỗi.
   */
  async open404Page() {
    await this.page.goto("/chitiet/", { waitUntil: "domcontentloaded" });
    await this.get404Message()
      .waitFor({
        state: "visible",
        timeout: TimeOutConstants.TIME_OUT_RENDER,
      })
      .catch(() => {});
  }
}
