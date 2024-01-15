// pages/api/clear-bitcoin-data.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await pool.query('TRUNCATE TABLE bitcoin_prices;');
      res.status(200).json({ message: 'Bitcoin prices table cleared.' });
    } catch (error) {
      console.error('Error clearing Bitcoin prices table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
