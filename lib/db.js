const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bitcoin_db',
  password: 'FDOjsf1123saadsdAFJN2!!',
  port: 5432,
});

module.exports = pool;
