'use client';

import ReactECharts from 'echarts-for-react';
import { useTelemetry } from '../api';

export default function TelemetryChart({ driverNumber, sessionKey }: { driverNumber: number | string, sessionKey: number | string }) {
  const { data, isLoading, error } = useTelemetry(driverNumber, sessionKey);

  console.log('TelemetryChart Data:', data, 'Error:', error);

  if (isLoading) return <p>Loading high-speed telemetry...</p>;
  if (!data || !Array.isArray(data) || data.length === 0) return <p>No telemetry available for this session (Driver {driverNumber})</p>;

  // Filter and map data for the chart
  const times = data.map(d => new Date(d.date).toLocaleTimeString());
  const speeds = data.map(d => d.speed);
  const rpms = data.map(d => d.rpm);
  
  const options = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Speed (km/h)', 'RPM'],
      textStyle: { color: '#8b949e' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: times,
      axisLabel: { color: '#8b949e' }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Speed',
        axisLabel: { color: '#8b949e' },
        splitLine: { lineStyle: { color: '#30363d' } }
      },
      {
        type: 'value',
        name: 'RPM',
        axisLabel: { color: '#8b949e' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Speed (km/h)',
        type: 'line',
        data: speeds,
        smooth: true,
        itemStyle: { color: '#ff2800' }
      },
      {
        name: 'RPM',
        type: 'line',
        yAxisIndex: 1,
        data: rpms,
        smooth: true,
        itemStyle: { color: '#58a6ff' }
      }
    ]
  };

  return <ReactECharts option={options} style={{ height: 350, width: '100%' }} />;
}
