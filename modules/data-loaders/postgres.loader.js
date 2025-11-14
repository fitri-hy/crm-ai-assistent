const { Client } = require("pg");

module.exports = async function postgresLoader(source) {
  const client = new Client(source.connection);
  await client.connect();

  const result = {};

  for (const key of Object.keys(source.tables)) {
    const tableName = source.tables[key];
    const rows = await client.query(`SELECT * FROM ${tableName}`);
    result[key] = rows.rows;
  }

  await client.end();
  return result;
};
