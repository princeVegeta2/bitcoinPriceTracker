import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import MyRechart from '../components/MyRechart';

export default function Home() {
  const [timeframe, setTimeframe] = useState('year');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [chartData, setChartData] = useState([]);

  const clearBitcoinData = async () => {
    try {
      const response = await fetch('/api/clear-bitcoin-data', { method: 'POST' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Bitcoin data cleared from the database.');
    } catch (error) {
      console.error('Failed to clear Bitcoin data:', error);
    }
  };
  
  const updateDatabase = async () => {
    try {
      // First clear existing data
      await clearBitcoinData();
  
      // Then fetch new data
      const endDate = new Date().toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD' format
      const startDate = '2011-01-01'; // Start date for historical data
      const fetchResponse = await fetch(`/api/fetch-historical-bitcoin?startDate=${startDate}&endDate=${endDate}`, {
        method: 'POST',
      });
  
      if (fetchResponse.ok) {
        console.log('Database updated with new historical data.');
      } else {
        // Handle errors during data fetching
        const error = await fetchResponse.json();
        console.error('Failed to fetch and update historical data:', error);
      }
    } catch (error) {
      console.error('Error in updating database:', error);
    }
  };
  

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setStartDate(''); // Clear the start date
    setEndDate(''); // Clear the end date
  
    // Fetch data based on the selected timeframe
    fetchData(newTimeframe, null, null);
  };
  

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    // Set timeframe to 'custom' when start date is changed
    setTimeframe('custom');
  };
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    // Set timeframe to 'custom' when end date is changed
    setTimeframe('custom');
  };

  const fetchData = async (timeframe, start, end) => {
    let apiUrl = `/api/bitcoin-data?timeframe=${timeframe}`;
  
    // If both start and end dates are provided, append them to the query
    if (start && end) {
      apiUrl += `&startDate=${start}&endDate=${end}`;
    }
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        // If the response is not OK, throw an error with the status
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
  
      // If the response is OK, but the data array is empty, you could handle it appropriately here
      if (data.length === 0) {
        console.log('No data available for the selected timeframe.');
        // Perhaps clear the chart or show a message
        setChartData([]);
      } else {
        setChartData(data);
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error('Failed to fetch data:', error);
    }
  };

  // Fetch data when component mounts and when timeframe, startDate, or endDate changes
  useEffect(() => {
    if(timeframe === 'custom' && startDate && endDate) {
        fetchData(null, startDate, endDate);
        } else {
        fetchData(timeframe, null, null);
        }
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
      <div>
      <button onClick={updateDatabase}>Update Database</button>
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