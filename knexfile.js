// Update with your config settings.

require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
console.log("Base de datos:", process.env.DB_DATABASE);
module.exports = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};
