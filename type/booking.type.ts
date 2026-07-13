export interface IBookingData {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: IBookingdates;
  additionalneeds: string;
}
export interface IBookingdates {
  checkin: Date;
  checkout: Date;
}
