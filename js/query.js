import axios from "axios";
const SOLR_URL = process.env.SOLR_URL;

const query = (val) => {
  return axios
    .get(`${SOLR_URL}/query?q=${val}`)
    .then((res) => res.data.response.docs)
    .then((docs) => docs.map((project) => project.uuid));
};

export default query;
