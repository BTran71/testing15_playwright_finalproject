import test, { expect } from "@playwright/test";

test("TC02: Verify get all booking successfull", async ({ request }) => {
  const response = await request.get(
    "https://restful-booker.herokuapp.com/booking",
  );

  const responseBody = await response.json();

  console.log(responseBody);
  expect(response.status()).toBe(200);
  expect(responseBody).toBeDefined();
});
