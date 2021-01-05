import axios from "axios";

const reportError = (func) => (dataPoint) => {
  try {
    return func(dataPoint);
  } catch (e) {
    throw new Error(`Error in project ${dataPoint.uuid}: ${e.message}`);
  }
};

const formatTimestamp = (dataPoint) => {
  if (!dataPoint.added_to_index) {
    throw new Error("No timestamp");
  }
  dataPoint["added_to_index_formatted"] = new Date(
    dataPoint["added_to_index"] * 1000
  ).toLocaleDateString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "utc",
  });
  return dataPoint;
};

const formatAuthorNames = (dataPoint) => {
  dataPoint["author_names"] = dataPoint.contributors
    .map((contributor) => contributor.name)
    .join(", ");
  return dataPoint;
};

const fetchData = (url = process.env.STATIC_DATA_URL) => {
  // Fetching from URL rather than using dynamic imports asc will eventually use ingest API
  return axios
    .get(url)
    .then((res) => res.data)
    .then(
      (data) =>
        data.map(
          ({ uuid, added_to_index, dcp_url, publications, content }) => ({
            uuid,
            added_to_index,
            dcp_url,
            publications,
            ...content,
          })
        ) // Flatten
    )
    .then((data) =>
      data.map(reportError(formatTimestamp)).map(reportError(formatAuthorNames))
    );
};

module.exports = fetchData;
