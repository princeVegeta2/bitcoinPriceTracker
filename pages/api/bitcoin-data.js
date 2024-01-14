// pages/api/bitcoin-data.js
import pool from '../../lib/db';

const getBitcoinData = async () => {
  const query = 'SELECT * FROM bitcoin_prices ORDER BY date DESC';
  const res = await pool.query(query);
  return res.rows;
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const data = await getBitcoinData();
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    // ... other cases
  }
}
