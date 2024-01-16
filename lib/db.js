const { Pool } = require('pg');

// const connectionString = process.env.ELEPHANTSQL_URI; 
const connectionString = 'postgres://fcqkzxeq:uq5_UG-y1OCenPY_QczPd3HMjl6AW6gC@horton.db.elephantsql.com/fcqkzxeq';

const pool = new Pool({
  connectionString,
});

// SQL command to create the table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS bitcoin_prices (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  price NUMERIC NOT NULL
);`;

pool.connect((err, client, done) => {
  if (err) throw err;

  client.query(createTableQuery, (err, res) => {
    done();

    if (err) {
      console.log(err.stack);
    } else {
      console.log('Table is successfully created or already exists');
    }
  });
});

module.exports = pool;