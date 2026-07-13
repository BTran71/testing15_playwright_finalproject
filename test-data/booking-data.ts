import { faker } from "@faker-js/faker";
import { IBookingData } from "../type/booking.type";

export const bookingData: IBookingData = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  totalprice: faker.number.int({
    min: 100,
    max: 1000,
  }),
  depositpaid: faker.datatype.boolean(),
  bookingdates: {
    checkin: faker.date.past(),
    checkout: faker.date.future(),
  },
  additionalneeds: faker.helpers.arrayElement([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Extra pillows",
    "Late checkout",
  ]),
};

export const updateBookingData: IBookingData = {
  firstname: faker.person.firstName(),
  lastname: faker.person.lastName(),
  totalprice: faker.number.int({
    min: 100,
    max: 1000,
  }),
  depositpaid: faker.datatype.boolean(),
  bookingdates: {
    checkin: faker.date.past(),
    checkout: faker.date.future(),
  },
  additionalneeds: faker.helpers.arrayElement([
    "Breakfast",
    "Lunch",
    "Dinner",
    "Extra pillows",
    "Late checkout",
  ]),
};
