import axios from "axios";
import Cite from "citation-js";

const formatTimestamp = (data) => {
  return data.map((dataPoint) => {
    dataPoint["added_to_index_formatted"] = new Date(
      dataPoint["added_to_index"] * 1000
    ).toLocaleDateString("en-gb", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "utc",
    });
    return dataPoint;
  });
};

const truncate = (string) =>
  string.length > 40 ? `${string.substring(0, 40)}...` : string;

const formatAuthorNames = (data) => {
  return data.map((dataPoint) => {
    dataPoint["author_names"] = dataPoint.contributors
      .map((contributor) => contributor.name)
      .join(", ");
    dataPoint["author_names_truncated"] = truncate(dataPoint["author_names"]);
    return dataPoint;
  });
};

const retrieveCitation = async doi => {
  const cjs = await Cite.inputAsync(doi);
  return {
    doi: cjs[0].DOI,
    url: cjs[0].URL,
    publisher: cjs[0].publisher,
  };
}

const addPublicationInfo = async (data) =>
  Promise.all(
    data.map(async (dataPoint) => {
      dataPoint.publications = await Promise.all(
        dataPoint["publication_links"].map(retrieveCitation)
      );
      return dataPoint;
    })
  );

const fetchData = async (url = process.env.STATIC_DATA_URL) => {
  // Fetching from URL rather than using dynamic imports as will eventually use ingest API
  return await axios
    .get(url)
    .then((res) => res.data)
    .then(formatTimestamp)
    .then(formatAuthorNames)
    .then(addPublicationInfo);
};

module.exports = fetchData;
