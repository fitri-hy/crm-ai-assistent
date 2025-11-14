const axios = require("axios");

module.exports = async function apiLoader(source) {
  const result = {};

  for (const key of Object.keys(source.endpoints)) {
    const url = source.baseURL + source.endpoints[key];
    const resp = await axios.get(url);
    result[key] = resp.data;
  }

  return result;
};
