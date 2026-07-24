/**
 * Dữ liệu test cho chức năng Điều hướng khóa học theo danh mục.
 * Mã danh mục (code) khớp CATEGORY_CODES trong RouteConstants;
 * tên (name) theo đúng text hiển thị trong dropdown menu DANH MỤC,
 * đúng THỨ TỰ xuất hiện trên menu.
 */
export const CATEGORY_DATA = {
  categories: [
    { code: "BackEnd", name: "Lập trình Backend" },
    { code: "Design", name: "Thiết kế Web" },
    { code: "DiDong", name: "Lập trình di động" },
    { code: "FrontEnd", name: "Lập trình Front end" },
    { code: "FullStack", name: "Lập trình Full Stack" },
    { code: "TuDuy", name: "Tư duy lập trình" },
  ],
  /** Mã lĩnh vực không tồn tại (TC_6) */
  invalidCode: "KhongTonTai999",
  /** Thông báo kỳ vọng khi danh mục không có khóa học (TC_6) */
  emptyMessage: "Không có khóa học",
  /** Banner của trang danh mục */
  bannerTitle: "Khóa học theo danh mục",
} as const;
