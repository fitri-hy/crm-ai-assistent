module.exports = function mergeData(...datasets) {
  const merged = {};

  for (const data of datasets) {
    if (!data || typeof data !== "object") continue;

    for (const key of Object.keys(data)) {
      merged[key] = data[key];
    }
  }

  return merged;
};
