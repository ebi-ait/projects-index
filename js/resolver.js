const axios = require("axios");

const fetchData = async (url = "data/data.json") => {
  return await axios.get(url);
};

module.exports = fetchData;
