/** Dữ liệu kiểm thử cho trang Danh sách khóa học (/khoahoc). */
export const COURSE_LIST_DATA = {
  /** Text theo DOM (hiển thị UPPERCASE là do CSS text-transform) */
  bannerTitle: "Khóa học",
  bannerSubtitle: "Bắt đầu hành trình nào!!!",
  sectionHeading: "Danh sách khóa học",
  /** 6 ô thống kê theo sheet TC_4 */
  statsLabels: [
    "Chương trình học",
    "Nhà sáng tạo",
    "Nhà thiết kế",
    "Bài giảng",
    "Video",
    "Lĩnh vực",
  ],
  footerHotline: "1800-123-4567",
  footerEmail: "devit@gmail.com",
  /** Thông báo kỳ vọng khi mất mạng (AC-2.13) */
  offlineMessage: "Vui lòng kết nối mạng",
  /** Định dạng giá "800.000đ" / "400.000đ" */
  pricePattern: /^\d{1,3}(\.\d{3})*đ$/,
} as const;
