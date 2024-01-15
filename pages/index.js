import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import MyRechart from '../components/MyRechart';

export default function Home() {
  const [timeframe, setTimeframe] = useState('year');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [chartData, setChartData] = useState([]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    // Reset both the state and the input fields
    setStartDate('');
    setEndDate('');
    fetchData(newTimeframe, null, null);
  };
  

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const fetchData = async (timeframe, start, end) => {
    let apiUrl = `/api/bitcoin-data?timeframe=${timeframe}`;
    if (start && end) {
      apiUrl += `&startDate=${start}&endDate=${end}`;
    }
    const res = await fetch(apiUrl);
    const data = await res.json();
    setChartData(data);
  };

  // Fetch data when component mounts and when timeframe, startDate, or endDate changes
  useEffect(() => {
    fetchData(timeframe, startDate, endDate);
  }, [timeframe, startDate, endDate]);

  return (
    <main className={styles.main}>
      <h1>Bitcoin Price Tracker</h1>
      {/* Timeframe Buttons */}
      <div>
        <button onClick={() => handleTimeframeChange('day')}>Last Day</button>
        <button onClick={() => handleTimeframeChange('week')}>Last Week</button>
        <button onClick={() => handleTimeframeChange('month')}>Last Month</button>
        <button onClick={() => handleTimeframeChange('year')}>Last Year</button>
      </div>

      {/* Date Range Picker */}
      <div>
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </label>
        <label>
          End Date:
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </label>
      </div>

      {/* Bitcoin Chart */}
      <MyRechart data={chartData} />
    </main>
  );
}