export class TimeOutConstants {
  static readonly TIME_OUT_DEFAULT = 40000;
  static readonly TIME_OUT_MEDIUM = 15000;
  static readonly TIME_OUT_LONG = 20000;
  static readonly TIME_OUT_SHORT = 5000;
  /** Thời gian chờ tối đa cho 1 response API của site demo */
  static readonly TIME_OUT_API = 10000;
  /** Chờ TỐI ĐA cho React render UI sau khi đã có data (assertion trả về ngay khi render xong) */
  static readonly TIME_OUT_RENDER = 7000;
}
