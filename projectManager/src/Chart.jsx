// src/Chart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ completedTasks, totalTasks }) => {
  const data = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        label: '# of Tasks',
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return <Pie data={data} />;
};

export default Chart;
