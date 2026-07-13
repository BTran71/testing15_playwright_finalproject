import test, { expect } from "@playwright/test";

test("TC01: Verify login sucessful with valid credentials", async ({
  request,
}) => {
  const respone = await request.post(
    "https://restful-booker.herokuapp.com/auth",
    {
      data: {
        username: "admin",
        password: "password123",
      },
    },
  );
  const responeBody = await respone.json();

  console.log(responeBody);
  const token = responeBody.token;

  // console.log("respone", { respone });

  expect(respone.status()).toBe(200);
  expect(token).toBeDefined;
});
