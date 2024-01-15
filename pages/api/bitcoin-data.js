// pages/api/bitcoin-data.js
import pool from '../../lib/db';

export default async function handler(req, res) {
  const { method, query } = req;
  let dataQuery = 'SELECT * FROM bitcoin_prices';
  const queryParams = [];

  if (query.startDate && query.endDate) {
    dataQuery += ' WHERE date BETWEEN $1 AND $2';
    queryParams.push(query.startDate, query.endDate);
  } else if (query.timeframe) {
    const now = new Date();
    let pastDate = new Date();

    switch (query.timeframe) {
      case 'day':
        pastDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        pastDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        pastDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        pastDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        // If the timeframe is not recognized, send an error or default to some timeframe
        return res.status(400).json({ error: 'Invalid timeframe specified' });
    }

    dataQuery += ' WHERE date >= $1';
    queryParams.push(pastDate.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
  }

  dataQuery += ' ORDER BY date DESC';

  if (method === 'GET') {
    try {
        const { rows } = await pool.query(dataQuery, queryParams);
        // Format the date to 'YYYY-MM-DD' before sending the response
        const formattedData = rows.map((row) => ({
          ...row,
          // UTC
          date: new Date(row.date.getTime() + row.date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
        }));
        res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
