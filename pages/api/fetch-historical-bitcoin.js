// pages/api/fetch-historical-bitcoin.js
import fetch from 'node-fetch';
import pool from '../../lib/db';

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;

  // Function to fetch and store historical data
  async function fetchAndStoreHistoricalData(start, end) {
    const url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`;
    const response = await fetch(url);
    const data = await response.json();
    const prices = data.bpi; // Assuming the API returns a 'bpi' object with date keys

    for (const [date, price] of Object.entries(prices)) {
      // Insert or update the price for each date into the database
      const insertQuery = `INSERT INTO bitcoin_prices (date, price) VALUES ($1, $2)
        ON CONFLICT (date) DO UPDATE SET price = EXCLUDED.price;`;
      await pool.query(insertQuery, [date, price]);
    }
  }

  if (req.method === 'POST') {
    try {
      await fetchAndStoreHistoricalData(startDate, endDate);
      res.status(200).json({ message: 'Historical data fetched and stored.' });
    } catch (error) {
      console.error('Error fetching or storing historical Bitcoin prices:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
