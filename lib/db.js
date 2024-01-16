const { Pool } = require('pg');

const connectionString = process.env.ELEPHANTSQL_URI; 

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
