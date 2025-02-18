import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function App() {
  const [sensorData, setSensorData] = useState([]);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState('');

  const fetchSensorData = async () => {
    try {
      const response = await axios.get('https://health-monitoring-backend.vercel.app/api/sensors');
      const data = response.data;
      setSensorData(data);

      if (data.length > 0) {
        const latestData = data[data.length - 1];
        handleAlert(latestData);
        generateAIRecommendation(latestData);
      }
    } catch (err) {
      setError('Error fetching sensor data');
      console.error(err);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchSensorData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAlert = (latestData) => {
    if (!latestData) return;
    const { pulse, spo2, temperature } = latestData;
    
    if (pulse < 50) {
      setAlertMessage('⚠️ Low BPM - Possible bradycardia risk.');
    } else if (pulse > 120) {
      setAlertMessage('⚠️ High BPM - Possible tachycardia risk.');
    } else if (spo2 < 90) {
      setAlertMessage('⚠️ Low SpO2 - Risk of hypoxia. Seek medical advice!');
    } else if (temperature > 38) {
      setAlertMessage('⚠️ High Temperature - Possible fever detected!');
    } else {
      setAlertMessage('✅ Vitals are within normal range.');
    }
  };

  const generateAIRecommendation = (latestData) => {
    if (!latestData) return;

    const { pulse, spo2, temperature } = latestData;
    let recommendation = '';

    if (spo2 < 90) {
      recommendation = '🚑 Oxygen levels are low! Consider seeking medical attention.';
    } else if (pulse > 100) {
      recommendation = '💓 High heart rate detected. Reduce stress and stay hydrated.';
    } else if (pulse < 60) {
      recommendation = '🫀 Low heart rate detected. Monitor for dizziness or fatigue.';
    } else if (temperature > 38) {
      recommendation = '🤒 Fever detected. Stay hydrated and rest well.';
    } else {
      recommendation = '✅ Your vitals look good! Keep maintaining a healthy lifestyle.';
    }
    
    setAiRecommendation(recommendation);
  };

  const pulseData = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'Pulse Rate (BPM)',
      data: sensorData.map(item => item.pulse),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    }]
  };

  const spo2Data = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'SpO2 (%)',
      data: sensorData.map(item => item.spo2),
      borderColor: 'rgba(255, 99, 132, 1)',
      fill: false,
    }]
  };

  const tempData = {
    labels: sensorData.map((_, index) => `Reading ${index + 1}`),
    datasets: [{
      label: 'Temperature (°C)',
      data: sensorData.map(item => item.temperature),
      borderColor: 'rgba(255, 159, 64, 1)',
      fill: false,
    }]
  };

  return (
    <div className="App">
      <h1>Remote Health Monitoring Dashboard</h1>

      {error && <p className="error">{error}</p>}
      {alertMessage && <div className="alert">{alertMessage}</div>}

      <div className="sensor-boxes">
        <div className="sensor-box">
          <h2>Pulse Rate</h2>
          <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].pulse : '--'} BPM</p>
        </div>
        <div className="sensor-box">
          <h2>SpO2</h2>
          <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].spo2 : '--'} %</p>
        </div>
        <div className="sensor-box">
          <h2>Temperature</h2>
          <p>{sensorData.length > 0 ? sensorData[sensorData.length - 1].temperature : '--'} °C</p>
        </div>
      </div>

      <div className="suggestion-box">
        <h2>💡 AI Suggestion</h2>
        <p>{aiRecommendation || "No suggestion available yet."}</p>
      </div>

      <div className="chart-container"><Line data={pulseData} /></div>
      <div className="chart-container"><Line data={spo2Data} /></div>
      <div className="chart-container"><Line data={tempData} /></div>

      
    </div>
  );
}

export default App;
