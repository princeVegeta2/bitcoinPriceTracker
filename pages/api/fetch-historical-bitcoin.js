// pages/api/fetch-historical-bitcoin.js
import fetch from 'node-fetch';
import pool from '../../lib/db';

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;

  const fetchAndStoreHistoricalData = async (start, end) => {
    const url = `https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`;
    const response = await fetch(url);
    const data = await response.json();
    const prices = data.bpi;

    for (const [date, price] of Object.entries(prices)) {
      const insertQuery = `INSERT INTO bitcoin_prices (date, price) VALUES ($1, $2)
        ON CONFLICT (date) DO UPDATE SET price = EXCLUDED.price;`;
      await pool.query(insertQuery, [date, price]);
    }
  };

  const fetchInBatches = async (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let current = new Date(startDate);
  
    while (current <= endDate) {
      const batchStart = current.toISOString().split('T')[0];
      current.setMonth(current.getMonth() + 1);
      let batchEnd = current;
      // If batchEnd is in the future or beyond the endDate, set it to endDate
      if (batchEnd > new Date() || batchEnd > endDate) {
        batchEnd = endDate;
      }
      batchEnd = batchEnd.toISOString().split('T')[0];
  
      // Fetch and store data for the current batch
      await fetchAndStoreHistoricalData(batchStart, batchEnd);
      if (batchEnd === endDate.toISOString().split('T')[0]) break;
    }
  };
  
  if (req.method === 'POST'){
    try {
      // Call the function to fetch data in yearly batches
      await fetchInBatches(startDate, endDate);
      res.status(200).json({ message: 'Historical data fetched and stored in yearly batches.' });
      } catch (error) {
      console.error('Error fetching or storing historical Bitcoin prices:', error);
      res.status(500).json({ error: 'Internal server error' });
      }
      } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end('Method ${req.method} Not Allowed');
      }
  }
