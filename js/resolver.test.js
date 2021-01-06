const resolve = require("./resolver");
const axios = require("axios");
// Use the real data to mock the HTTP request.
// Using HTTP for grabbing data for future compatability and page load times.
const data = require("../data/data.json");

jest.mock("axios");

test("resolves published data", async () => {
  axios.get.mockImplementationOnce(() => Promise.resolve({ data: data }));
  const response = await resolve();

  // Ensure is ordered by descending timestamp
  expect(response[0]["added_to_index"]).toBeGreaterThanOrEqual(
    response[response.length - 1]["added_to_index"]
  );

  response.forEach((dataPoint, i) => {
    [
      "uuid",
      "added_to_index",
      "added_to_index_formatted",
      "array_express_accessions",
      "author_names",
      "contributors",
      "dcp_url",
      "insdc_project_accessions",
      "project_core",
      "publications",
    ].forEach((prop) => expect(dataPoint).toHaveProperty(prop));

    expect(dataPoint.added_to_index_formatted).toEqual(
      expect.stringContaining("")
    );
    expect(dataPoint.author_names).toEqual(expect.stringContaining(""));
    expect(typeof dataPoint["added_to_index"]).toBe("number");

    ["doi", "journal_title", "title", "url"].forEach((prop) =>
      dataPoint["publications"] && dataPoint["publications"].forEach((pub) => expect(pub).toHaveProperty(prop))
    );
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
