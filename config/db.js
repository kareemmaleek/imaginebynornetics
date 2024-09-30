const { createPool } = require("mysql");

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  port: "3306",
  database: "imaginebynornetics",
});

pool.getConnection((err) => {
  if (err) {
    return console.log("DB Connection Error!");
  }
  console.log("DB Connected!");
});

const execQuery = (query, arr) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query(query, arr, (err, data) => {
        if (err) {
          console.log("Error when executing query...");
          reject(err);
        }
        resolve(data);
      });
    } catch (err) {
      reject(data);
    }
  });
};

module.exports = { execQuery };
