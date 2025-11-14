const mysql = require("mysql2/promise");

module.exports = async function mysqlLoader(source) {
  const conn = await mysql.createConnection(source.connection);
  const result = {};

  for (const key of Object.keys(source.tables)) {
    const tableName = source.tables[key];
    const [rows] = await conn.query(`SELECT * FROM ${tableName}`);
    result[key] = rows;
  }

  await conn.end();
  return result;
};
