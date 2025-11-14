const { MongoClient } = require("mongodb");

module.exports = async function mongoLoader(source) {
  const client = new MongoClient(source.connection.url);
  await client.connect();

  const db = client.db();
  const result = {};

  for (const key of Object.keys(source.collections)) {
    const colName = source.collections[key];
    result[key] = await db.collection(colName).find().toArray();
  }

  await client.close();
  return result;
};
