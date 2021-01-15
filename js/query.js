import axios from "axios";

const SOLR_URL = process.env.SOLR_URL;
const MAX_ROWS = 1000; // Large number for max rows for now as we don't have pagination
const queryFields = [
  {
    name: "uuid",
    boost: 2
  },
  {
    name: "content.contributors.names",
    boost: 1.5
  },
  {
    name: "content.project_core.project_title",
    boost: 1.6
  }
]

const query = (val = "") => {
  return axios
    .get(
      `${SOLR_URL}/query?` +
      'defType=dismax' +
      `&q=${val}` +
      `&rows=${MAX_ROWS}`    )
    .then((res) => res.data.response.docs)
    .then((docs) => docs.map((project) => project.uuid));
};

export default query;
