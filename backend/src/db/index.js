require("dotenv").config();
const { Pool } = require("pg");

const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    };

if (process.env.PGSSL === "true") {
  config.ssl = { rejectUnauthorized: false };
}

module.exports = new Pool(config);
