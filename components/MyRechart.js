import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// The chart wasn't auto-scaling on the Y axis for some reason. If you can find a better way of doing this please fix
const MyRechart = ({ data }) => {
  // Ensure data is correctly formatted
  const formattedData = data.map(item => ({
    ...item,
    // Convert price to a number if it's a string
    // I know that my price data fetches a number, I kept this incase it will be used with other databases
    price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
  }));
  
  const sortedData = formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  // Find the max and min price in the data for the YAxis domain
  const prices = sortedData.map(item => item.price);
  const maxY = Math.max(...prices);
  const minY = Math.min(...prices);
  // Add a buffer of 10% of the range for the Y-axis to ensure all points are visible
  const buffer = (maxY - minY) * 0.1;

  return (
    <LineChart
      width={500}
      height={300}
      data={sortedData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis 
        orientation="right"
        domain={[minY - buffer, maxY + buffer]}
        allowDataOverflow={true}
      />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
    </LineChart>
  );
};

export default MyRechart;

