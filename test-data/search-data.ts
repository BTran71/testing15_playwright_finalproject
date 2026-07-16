/**
 * Dữ liệu test cho chức năng Tìm kiếm khóa học.
 * Các từ khóa "tồn tại" dựa trên dữ liệu thực tế của site (khóa lập trình FE/React...).
 */
export const SEARCH_DATA = {
  /** Từ khóa chắc chắn có kết quả trên site */
  validKeyword: "react",
  /** Từ khóa hợp lệ khác (không dấu) */
  validKeywordNoAccent: "lap trinh",
  /** Từ khóa gần như chắc chắn KHÔNG có kết quả */
  notFoundKeyword: "zzzxyzkhongtontai123",
  /** Chỉ ký tự đặc biệt */
  specialChars: "@#$%^&*",
  /** Chuỗi rất dài (> 100 ký tự) */
  veryLong: "a".repeat(120),
  /** Từ khóa có khoảng trắng đầu/cuối cần được trim */
  withSpaces: "  react  ",
};
