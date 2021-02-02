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
    timeZone: "utc",
  });
  return dataPoint;
};

const formatAuthorNames = (dataPoint) => {
  dataPoint.contributors = dataPoint.contributors.map((contributor) => {
    const names = contributor.name.split(",");
    const formatted_name = `${
      names[names.length - 1]
    } ${names[0][0].toUpperCase()}`;
    return {
      formatted_name,
      ...contributor,
    };
  });
  return dataPoint;
};

const formatOrgans = (dataPoint) => {
  if (!dataPoint.organ) return dataPoint
  dataPoint.organ_names = dataPoint.organ.ontologies.map(
    (ontology) => ontology.ontology_label
  );
  return dataPoint;
};

const hoistEga = (dataPoint) => {
  // Ideally EGA accessions would be part of the schema
  // However, they are listed in supplementary_links so we need to "hoist" them to their own field
  const egaStudiesRegex = /.*\/studies\/(EGAS\d*).*/i;
  const egaDatasetsRegex = /.*\/studies\/(EGAD\d*).*/i;
  dataPoint["ega_studies_accessions"] = dataPoint["supplementary_links"]
    .map((link) => egaStudiesRegex.exec(link))
    .filter((match) => match && match.length)
    .map((match) => match[1]);

  dataPoint["ega_datasets_accessions"] = dataPoint["supplementary_links"]
    .map((link) => egaDatasetsRegex.exec(link))
    .filter((match) => match && match.length)
    .map((match) => match[1]);

  return dataPoint;
};

const fetchData = (url = process.env.STATIC_DATA_URL) => {
  // Fetching from URL rather than using dynamic imports as will eventually use ingest API
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
    .then((data) =>
      data.map(
        ({
          insdc_project_accessions,
          array_express_accessions,
          geo_series_accessions,
          supplementary_links,
          publications,
          ...rest
        }) => ({
          // These properties might be null but better treated as always arrays
          insdc_project_accessions: insdc_project_accessions || [],
          array_express_accessions: array_express_accessions || [],
          geo_series_accessions: geo_series_accessions || [],
          supplementary_links: supplementary_links || [],
          publications: publications || [],
          ...rest,
        })
      )
    )
    .then((data) =>
      data
        .map(reportError(hoistEga))
        .map(reportError(formatOrgans))
        .map(reportError(formatTimestamp))
        .map(reportError(formatAuthorNames))
    )
    .then((data) =>
      data.sort((a, b) => (a.added_to_index <= b.added_to_index ? 1 : -1))
    );
};

module.exports = fetchData;
