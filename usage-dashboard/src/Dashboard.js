import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

// register components for rendering
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  // fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}`);
        setData(response.data.usage);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSort = (key) => {
    let direction = sortConfig.direction === 'ascending' && sortConfig.key === key ? 'descending' : 'ascending';


    setSortConfig({ key, direction });

    setData((prevData) => {
      const sortedData = [...prevData].sort((a, b) => {
        if (direction === 'ascending') {
          return a[key] > b[key] ? 1 : -1;
        } else if (direction === 'descending') {
          return a[key] < b[key] ? 1 : -1;
        }
        return 0; // No sorting
      });
      return sortedData;
    });
  };

  const creditsPerDate = {};
  data.forEach((entry) => {
    const date = formatTimestamp(entry.timestamp).split(' ')[0];
    creditsPerDate[date] = (creditsPerDate[date] || 0) + entry.credits_used;
  });

  const chartData = {
    labels: Object.keys(creditsPerDate),
    datasets: [{
      label: 'Credits Used',
      data: Object.values(creditsPerDate),
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div>
      <h1>Credit Usage Dashboard</h1>
      
      {/* Bar Chart */}
      <div style={{ width: '80%', margin: '0 auto' }}>
        {/* Bar used to render bar chart*/}
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('message_id')}>
              Message ID {sortConfig.key === 'message_id' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
            </th>
            <th onClick={() => handleSort('timestamp')}>
              Timestamp {sortConfig.key === 'timestamp' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
            </th>
            <th onClick={() => handleSort('reportname')}>
              Report Name {sortConfig.key === 'reportname' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
            </th>
            <th onClick={() => handleSort('credits_used')}>
              Credits Used {sortConfig.key === 'credits_used' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : '↕'}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.message_id}>
              <td>{entry.message_id}</td>
              <td>{formatTimestamp(entry.timestamp)}</td>
              <td>{entry.reportname || ''}</td>
              <td>{entry.credits_used.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
