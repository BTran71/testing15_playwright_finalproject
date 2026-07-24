import { Locator, Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";

/**
 * CourseListingPage: lớp cơ sở cho MỌI trang hiển thị lưới khóa học
 * (danh sách khóa học, kết quả tìm kiếm, khóa học theo danh mục).
 *
 * Điểm chung: mỗi card khóa học là/gói 1 link chi tiết dạng a[href*="/chitiet/"].
 * Số link chi tiết = số khóa học đang hiển thị.
 */
export class CourseListingPage extends CommonPage {
  protected readonly courseLinks: Locator;
  protected readonly courseCards: Locator;

  constructor(page: Page) {
    super(page);
    this.courseLinks = page.locator('a[href*="/chitiet/"]');
    this.courseCards = page.locator(".cardGlobal");
  }

  getCourseCards(): Locator {
    return this.courseCards;
  }

  /** Số lượng khóa học đang hiển thị (đếm theo link chi tiết). */
  async courseCount(): Promise<number> {
    return this.courseLinks.count();
  }

  /**
   * Số lượng CARD đang hiển thị (đếm theo .cardGlobal). Dùng thay courseCount()
   * ở các trang mà 1 card chứa nhiều link chi tiết (vd trang danh mục có thêm
   * nút "Xem chi tiết" trong overlay -> số link = 2 lần số card).
   */
  async cardCount(): Promise<number> {
    return this.courseCards.count();
  }

  // ===== getters cho từng thành phần trên card thứ i (0-based) =====
  /** Hình ảnh chính của card (img đầu tiên; img thứ hai là avatar tác giả). */
  getCardImage(index = 0): Locator {
    return this.courseCards.nth(index).locator("img").first();
  }

  /** Badge tên khóa học trên card. */
  getCardName(index = 0): Locator {
    return this.courseCards.nth(index).locator(".stikerCard");
  }

  /** 2 dòng giá (giá gốc gạch ngang + giá khuyến mãi) của card. */
  getCardPrices(index = 0): Locator {
    return this.courseCards.nth(index).locator(".cardFooter p");
  }

  getCardStarIcon(index = 0): Locator {
    return this.courseCards.nth(index).locator(".cardFooter i.fa-star");
  }

  /** Điểm đánh giá (vd "4.9"). */
  getCardRatingScore(index = 0): Locator {
    return this.courseCards.nth(index).locator(".cardFooter span.textStar");
  }

  /** Số lượt đánh giá (vd "(7840)"). */
  getCardRatingCount(index = 0): Locator {
    return this.courseCards
      .nth(index)
      .locator(".cardFooter span.colorCardTitle");
  }

  /** Tên tất cả khóa học đang hiển thị (đọc từ badge trên card). */
  async getAllCardNames(): Promise<string[]> {
    return this.courseCards.locator(".stikerCard").allTextContents();
  }

  /** Cặp { tên khóa học, url hình ảnh } của mọi card đang hiển thị. */
  async getCardNameImagePairs(): Promise<{ name: string; src: string }[]> {
    const count = await this.courseCards.count();
    const pairs: { name: string; src: string }[] = [];
    for (let i = 0; i < count; i++) {
      pairs.push({
        name: (await this.getCardName(i).textContent()) ?? "",
        src: (await this.getCardImage(i).getAttribute("src")) ?? "",
      });
    }
    return pairs;
  }

  /**
   * Số kết quả đọc trực tiếp từ nhãn "Hiển thị N kết quả" của trang.
   * Trả về -1 nếu không tìm thấy nhãn.
   */
  async resultLabelCount(): Promise<number> {
    const text = await this.page
      .getByText(/Hi[eể]n th[iị]\s*\d+\s*k[eế]t qu/i)
      .first()
      .textContent()
      .catch(() => null);
    const match = text?.match(/(\d+)/);
    return match ? Number(match[1]) : -1;
  }

  /**
   * dữ liệu thật của site có vài card với mã khóa học rỗng (vd href="/chitiet/").
   * Trả về index card đầu tiên có MÃ khóa học hợp lệ (>= 2 ký tự sau /chitiet/).
   */
  private async firstRealCourseIndex(): Promise<number> {
    const count = await this.courseLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await this.courseLinks.nth(i).getAttribute("href");
      if (href && /\/chitiet\/.{2,}/.test(href)) return i;
    }
    throw new Error("Không tìm thấy card khóa học có mã hợp lệ");
  }

  /** Click (hoặc double click) vào card khóa học đầu tiên có mã hợp lệ. */
  async openFirstRealCourse(useDoubleClick = false): Promise<void> {
    const card = this.courseLinks.nth(await this.firstRealCourseIndex());
    if (useDoubleClick) await card.dblclick();
    else await card.click();
  }
}
