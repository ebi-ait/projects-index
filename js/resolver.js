import axios from "axios";
import Cite from "citation-js";

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

const retrieveCitation = async ({ doi, url }) => {
  if (!doi) {
    throw new Error("Publication has no doi.");
  }
  const cjs = await Cite.inputAsync(doi);
  return {
    doi,
    url: cjs[0].URL,
    publisher: cjs[0].publisher,
  };
};

const addPublicationInfo = async (dataPoint) => {
  if (!dataPoint.publications) {
    dataPoint.publications = [];
  }

  try {
    dataPoint.publications = await Promise.all(
      dataPoint.publications.map(retrieveCitation)
    );
  } catch (e) {
    throw new Error(`Error in project ${dataPoint.uuid}: ${e.message}`);
  }

  return dataPoint;
};

const fetchData = (url = process.env.STATIC_DATA_URL) => {
  // Fetching from URL rather than using dynamic imports asc will eventually use ingest API
  return axios
    .get(url)
    .then((res) => res.data)
    .then(
      (data) =>
        data.map(({ uuid, added_to_index, dcp_url, content }) => ({
          uuid,
          added_to_index,
          dcp_url,
          ...content,
        })) // Flatten
    )
    .then((data) => Promise.all(data.map(addPublicationInfo)))
    .then((data) =>
      data.map(reportError(formatTimestamp)).map(reportError(formatAuthorNames))
    );
};

module.exports = fetchData;
