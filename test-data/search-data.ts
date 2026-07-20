/**
 * Dữ liệu test cho chức năng Tìm kiếm khóa học.
 * Các từ khóa "tồn tại" dựa trên dữ liệu thực tế của site (khóa lập trình FE/React...).
 */
export const SEARCH_DATA = {
  /** Từ khóa chắc chắn có kết quả trên site (TC_2 dùng "Lập trình Backend") */
  validKeyword: "Lập trình Backend",
  /** Từ khóa hợp lệ khác - không dấu (TC_4) */
  validKeywordNoAccent: "lap trinh backend",
  /** Từ khóa có dấu tiếng Việt (TC_5) */
  validKeywordAccent: "Lập trình web",
  /** Từ khóa dùng cho các test HOA/thường, trim, đăng nhập... */
  simpleKeyword: "Java",
  /** Một phần của từ khóa - partial match (TC_14) */
  partialKeyword: "back",
  /** Từ khóa gần như chắc chắn KHÔNG có kết quả (TC_8) */
  notFoundKeyword: "xyzkhongton123",
  /** Chỉ ký tự đặc biệt (TC_7) */
  specialChars: "@#$%",
  /** Số dương (TC_11) */
  positiveNumber: "12312354",
  /** Số âm / thập phân (TC_12) */
  negativeNumber: "-12.5",
  /** Chuỗi rất dài (> 100 ký tự) (TC_13) */
  veryLong: "a".repeat(116),
  /** Từ khóa có khoảng trắng đầu/cuối cần được trim (TC_10) */
  withSpaces: "  Java  ",
  /** Chỉ toàn khoảng trắng (TC_9) */
  whitespaceOnly: "   ",
  /**
   * Mật khẩu dùng khi TC_19 tự đăng ký tài khoản mới để test tìm kiếm
   * ở trạng thái đã đăng nhập (tài khoản demo cũ bị site reset thường xuyên).
   */
  registerPassword: "Testing15@",
};
