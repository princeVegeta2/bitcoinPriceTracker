"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import MyRechart from '../components/MyRechart';

export default function Home() {
  const [timeframe, setTimeframe] = useState('day');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [chartData, setChartData] = useState([]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    // Later, fetch data based on new start date
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    // Later, fetch data based on new end date
  };

  // Dummy data-fetching function
  const fetchData = () => {
    // Update with real data fetching logic later
    setChartData([
      { date: '2024-01-01', price: 42000 },
      { date: '2024-01-02', price: 43000 },
      { date: '2024-01-03', price: 44000 },
      // More data...
    ]);
  };

  useEffect(() => {
    fetchData();
  }, [timeframe, startDate, endDate]);

  return (
    <main className={styles.main}>
      <h1>Bitcoin Price Tracker</h1>
      
      {/* Timeframe Buttons */}
      <div>
        <button onClick={() => setTimeframe('day')}>Last Day</button>
        <button onClick={() => setTimeframe('week')}>Last Week</button>
        <button onClick={() => setTimeframe('month')}>Last Month</button>
        <button onClick={() => setTimeframe('year')}>Last Year</button>
      </div>

      {/* Date Range Picker */}
      <div>
        <label>
          Start Date:
          <input type="date" onChange={handleStartDateChange} />
        </label>
        <label>
          End Date:
          <input type="date" onChange={handleEndDateChange} />
        </label>
      </div>

      {/* Bitcoin Chart */}
      <MyRechart data={chartData} />
    </main>
  );
}
