/**
 * Đường dẫn (path) của các trang trên demo2.cybersoft.edu.vn.
 * Dùng chung baseURL trong playwright.config.ts nên chỉ lưu phần path.
 */
export class RouteConstants {
  static readonly HOME = "/";
  static readonly LOGIN = "/login";
  static readonly COURSE_LIST = "/khoahoc";
  static readonly BLOG = "/blog";

  /** Trang kết quả tìm kiếm: /timkiem/<tuKhoa> */
  static search(keyword: string): string {
    return `/timkiem/${encodeURIComponent(keyword)}`;
  }

  /** Trang chi tiết khóa học: /chitiet/<maKhoaHoc> */
  static courseDetail(courseId: string): string {
    return `/chitiet/${courseId}`;
  }

  /** Trang khóa học theo danh mục: /danhmuckhoahoc/<maDanhMuc> */
  static category(categoryCode: string): string {
    return `/danhmuckhoahoc/${categoryCode}`;
  }

  /**
   * API backend trả về danh sách khóa học (trang chủ, trang tìm kiếm,
   * trang danh mục đều gọi endpoint này để đổ dữ liệu card).
   */
  static readonly API_COURSE_LIST = "/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc";
}

/** Mã danh mục (lĩnh vực) hợp lệ trên site, lấy từ menu "DANH MỤC". */
export const CATEGORY_CODES = {
  BACKEND: "BackEnd",
  DESIGN: "Design",
  MOBILE: "DiDong",
  FRONTEND: "FrontEnd",
  FULLSTACK: "FullStack",
  TUDUY: "TuDuy",
} as const;
