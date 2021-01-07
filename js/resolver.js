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
      data.map(
        ({
          insdc_project_accessions,
          array_express_accessions,
          geo_series_accessions,
          publications,
          ...rest
        }) => ({
          // These properties might be null but better treated as always arrays
          insdc_project_accessions: insdc_project_accessions || [],
          array_express_accessions: array_express_accessions || [],
          geo_series_accessions: geo_series_accessions || [],
          publications: publications || [],
          ...rest,
        })
      )
    )
    .then((data) =>
      data.map(reportError(formatTimestamp)).map(reportError(formatAuthorNames))
    )
    .then((data) =>
      data.sort((a, b) => (a.added_to_index <= b.added_to_index ? 1 : -1))
    );
};

module.exports = fetchData;
