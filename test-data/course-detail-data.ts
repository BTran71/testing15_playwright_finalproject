/**
 * Dữ liệu test cho trang Xem chi tiết khóa học (/chitiet/<mã>).
 * Mã khóa học lấy theo cột Test Data của sheet "Xem chi tiết khóa học".
 */
export const COURSE_DETAIL_DATA = {
  /** Mã khóa học chính dùng cho hầu hết các test */
  primaryCourseId: "000123456",
  /** Mã khóa học thứ hai để đối chiếu dữ liệu giữa 2 khóa khác nhau */
  secondaryCourseId: "1009991",
  /** Text theo DOM (hiển thị UPPERCASE là do CSS text-transform) */
  bannerTitle: "Thông tin khóa học",
  bannerSubtitle: "Tiến lên và không chần chừ",
  /** 5 dòng thông tin trong khu vực đăng ký */
  regInfoLabels: ["Ghi danh", "Thời gian", "Bài học", "Video", "Trình độ"],
  couponPlaceholder: "Nhập mã",
  /** Khóa học tham khảo hiển thị tối đa 4 card */
  maxRefCards: 4,
  /** Tài khoản cố định dùng cho TC_11 (kiểm tra header khi đã đăng nhập). */
  loginAccount: "thu",
  loginPassword: "Thu123456@",
} as const;
