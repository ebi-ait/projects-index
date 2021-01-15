import axios from "axios";

const SOLR_URL = process.env.SOLR_URL;
const MAX_ROWS = 1000; // Large number for max rows for now as we don't have pagination

const query = (val = "*", filterInDcp) => {
  return axios
    .get(`${SOLR_URL}/query?q=${!val.length ? "*": val}${filterInDcp ? "&fq=in_dcp:true" : ""}&rows=${MAX_ROWS}`)
    .then((res) => res.data.response.docs)
    .then((docs) => docs.map((project) => project.uuid));
};

export default query;
