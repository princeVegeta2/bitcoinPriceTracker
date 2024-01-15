// pages/api/fetch-bitcoin.js
import fetch from 'node-fetch';
import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      console.log(data);
      const price = data.bpi.USD.rate_float;
      const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

      const insertQuery = 'INSERT INTO bitcoin_prices (date, price) VALUES ($1, $2)';
      await pool.query(insertQuery, [date, price]);

      res.status(200).json({ message: 'Bitcoin price fetched and stored' });
    } catch (error) {
      console.error('Error fetching or storing Bitcoin price:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
