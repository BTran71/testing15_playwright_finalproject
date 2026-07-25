import { Locator, Page, test, TestInfo } from "@playwright/test";
import { CommonPage } from "./CommonPage";
import { TimeOutConstants } from "../constants/TimeOutConstants";

/**
 * CourseListingPage: lớp cơ sở cho MỌI trang hiển thị lưới khóa học
 * (danh sách khóa học, kết quả tìm kiếm, khóa học theo danh mục).
 *
 * Điểm chung: mỗi card khóa học là 1 link chi tiết dạng a[href*="/chitiet/"].
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

  // ===== các thành phần có ở card kiểu "đầy đủ" (trang danh mục, khóa học
  // tham khảo ở trang chi tiết): badge Yêu thích, mô tả, thời lượng, giảng viên =====
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

  /** Tên tất cả khóa học đang hiển thị (đọc từ badge trên card). */
  async getAllCardNames(): Promise<string[]> {
    return this.courseCards.locator(".stikerCard").allTextContents();
  }

  /**
   * Tọa độ + kích thước của TẤT CẢ card
   */
  async getCardBoxes(): Promise<
    { x: number; y: number; width: number; height: number }[]
  > {
    await this.waitForFirstCard();
    return this.courseCards.evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        };
      }),
    );
  }

  /**
   * Chờ card đầu tiên hiển thị trước khi đếm/duyệt lưới. Cần thiết vì
   * count()/getAttribute() KHÔNG tự chờ - gọi ngay sau khi mở trang có thể
   * dính lúc React chưa render xong danh sách.
   */
  protected async waitForFirstCard(): Promise<void> {
    await this.courseLinks
      .first()
      .waitFor({ state: "visible", timeout: TimeOutConstants.TIME_OUT_RENDER })
      .catch(() => {}); // trang không có card nào thì để caller tự xử lý
  }

  /**
   * href link chi tiết của TẤT CẢ card đang hiển thị (theo thứ tự card).
   * Dùng để rà soát card có mã khóa học rỗng (href="/chitiet/" -> dẫn tới 404).
   */
  async getAllCardHrefs(): Promise<string[]> {
    await this.waitForFirstCard();
    const count = await this.courseCards.count();
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      hrefs.push((await this.courseCards.nth(i).getAttribute("href")) ?? "");
    }
    return hrefs;
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
   * QUÉT LINK CARD + TỰ CHỤP BẰNG CHỨNG - method trọn gói cho các bug case
   * "card link thiếu courseId".
   */
  async scanInvalidCourseLinks(
    testInfo: TestInfo,
    label: string,
  ): Promise<string[]> {
    const hrefs = await this.getAllCardHrefs();
    const invalid = hrefs
      .map((href, index) => ({ href, index }))
      .filter(({ href }) => !/\/chitiet\/.{2,}/.test(href))
      .map(
        ({ href, index }) => `${label} - card thứ ${index + 1}: href="${href}"`,
      );

    // mỗi test chỉ cần 1 ảnh bằng chứng 404, đã có rồi thì thôi
    const alreadyAttached = testInfo.attachments.some((a) =>
      a.name.startsWith("bang-chung-404"),
    );
    if (!alreadyAttached) {
      const attached = await this.attachEvidenceOfEmptyCourseLink(
        testInfo,
        hrefs,
        label,
      );
      if (attached) {
        // quay lại trang vừa quét để phần còn lại của test chạy bình thường
        await this.page.goBack({ waitUntil: "domcontentloaded" });
        await this.waitForFirstCard();
      }
    }
    return invalid;
  }

  /**
   * BẰNG CHỨNG BUG "card link rỗng -> 404": nếu trong danh sách href có card
   * mang link /chitiet/ RỖNG (thiếu hẳn courseId) thì click vào chính card đó,
   * chờ trang 404 "Có gì đó sai ở đây" hiện ra rồi chụp ảnh đính vào report.
   */
  private async attachEvidenceOfEmptyCourseLink(
    testInfo: TestInfo,
    hrefs: string[],
    label: string,
  ): Promise<boolean> {
    const emptyIdIndex = hrefs.findIndex((href) => /\/chitiet\/?$/.test(href));
    if (emptyIdIndex < 0) return false;
    await test.step("Chụp bằng chứng 404 từ card có link thiếu courseId", async () => {
      await this.courseCards.nth(emptyIdIndex).click();
      await this.page
        .getByText(/Có gì đó sai/i)
        .waitFor({ state: "visible", timeout: 4000 })
        .catch(() => {}); // 404 không hiện chữ thì vẫn chụp trạng thái thật
      await this.page.waitForTimeout(1000); // chờ hình minh họa 404 load
      await this.attachScreenshot(
        testInfo,
        `bang-chung-404_${label}-card-${emptyIdIndex + 1}`,
      );
    });
    return true;
  }

  /**
   * dữ liệu thật của site có vài card với mã khóa học rỗng (vd href="/chitiet/").
   * Trả về index card đầu tiên có MÃ khóa học hợp lệ (>= 2 ký tự sau /chitiet/).
   */
  private async firstRealCourseIndex(): Promise<number> {
    await this.waitForFirstCard();
    const count = await this.courseLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await this.courseLinks.nth(i).getAttribute("href");
      if (href && /\/chitiet\/.{2,}/.test(href)) return i;
    }
    throw new Error("Không tìm thấy card khóa học có mã hợp lệ");
  }

  /**
   * Hover vào card hợp lệ đầu tiên có overlay rồi click nút "Xem chi tiết"
   * trong overlay (TC_2 sheet Xem chi tiết khóa học).
   */
  async openCourseViaDetailButton(): Promise<void> {
    await test.step('Hover card và click nút "Xem chi tiết" trong overlay', async () => {
      await this.waitForFirstCard();
      const count = await this.courseCards.count();
      for (let i = 0; i < count; i++) {
        const card = this.courseCards.nth(i);
        const href = await card.getAttribute("href");
        const detailButton = card.locator(".subCard button");
        if (
          href &&
          /\/chitiet\/.{2,}/.test(href) &&
          (await detailButton.count()) > 0
        ) {
          await card.hover();
          await detailButton.click();
          return;
        }
      }
      throw new Error('Không tìm thấy card có nút "Xem chi tiết" hợp lệ');
    });
  }

  /** Click (hoặc double click) vào card khóa học đầu tiên có mã hợp lệ. */
  async openFirstRealCourse(useDoubleClick = false): Promise<void> {
    const action = useDoubleClick ? "Double click" : "Click";
    await test.step(`${action} vào card khóa học hợp lệ đầu tiên`, async () => {
      const card = this.courseLinks.nth(await this.firstRealCourseIndex());
      if (useDoubleClick) await card.dblclick();
      else await card.click();
    });
  }
}
