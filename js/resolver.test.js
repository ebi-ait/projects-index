const resolve = require("./resolver");
const axios = require("axios");
// Use the real data to mock the HTTP request.
// Using HTTP for grabbing data for future compatability and page load times.
const data = require("../data/data.json");

jest.mock("axios");

test("resolves published data", async () => {
  axios.get.mockImplementationOnce(() => Promise.resolve({ data: data }));

  expect(await resolve()).toEqual(data);
  expect(axios.get).toHaveBeenCalled();
});

test("errors properly", async () => {
  axios.get.mockImplementationOnce(() =>
    Promise.reject(new Error("Some Error Message"))
  );

  await expect(resolve()).rejects.toThrow();
  expect(axios.get).toHaveBeenCalled();
});
