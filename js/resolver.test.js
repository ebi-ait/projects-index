const resolve = require("./resolver");
const axios = require("axios");
// Use the real data to mock the HTTP request.
// Using HTTP for grabbing data for future compatability and page load times.
const data = require("../data/data.json");

jest.mock("axios");

test("resolves published data", async () => {
  axios.get.mockImplementationOnce(() => Promise.resolve({ data: data }));
  const response = await resolve();

  response.forEach((dataPoint, i) => {
    const expected = data[i];
    expect(dataPoint.uuid).toEqual(expected.uuid);
    expect(dataPoint.dcp_url).toEqual(expected.dcp_url);
    expect(dataPoint.core).toEqual(expected.content.core);
    expect(dataPoint.added_to_index).toEqual(expected.added_to_index);
    expect(dataPoint.added_to_index_formatted).toEqual(
      expect.stringContaining("")
    );
    expect(dataPoint).toHaveProperty("array_express_accessions");
    expect(dataPoint.author_names).toEqual(expect.stringContaining(""));
    expect(dataPoint).toHaveProperty("contributors");
    expect(dataPoint).toHaveProperty("insdc_project_accessions");
    expect(dataPoint).toHaveProperty("publications");
    expect(dataPoint).toHaveProperty("author_names");
    expect(dataPoint).toHaveProperty("added_to_index");
    expect(dataPoint).toHaveProperty("dcp_url");
  });

  expect(axios.get).toHaveBeenCalled();
});

test("errors properly", async () => {
  axios.get.mockImplementationOnce(() =>
    Promise.reject(new Error("Some Error Message"))
  );

  await expect(resolve()).rejects.toThrow();
  expect(axios.get).toHaveBeenCalled();
});
