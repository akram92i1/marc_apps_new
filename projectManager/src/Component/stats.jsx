import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function StackBars() {
  const dataset = [
    { month: 'January', finishedOnTime: 5, lateFinished: 3 },
    { month: 'February', finishedOnTime: 8, lateFinished: 2 },
    { month: 'March', finishedOnTime: 3, lateFinished: 4 },
    { month: 'April', finishedOnTime: 7, lateFinished: 3 },
    { month: 'May', finishedOnTime: 6, lateFinished: 2 },
    { month: 'June', finishedOnTime: 9, lateFinished: 1 },
    { month: 'July', finishedOnTime: 4, lateFinished: 5 },
    { month: 'August', finishedOnTime: 7, lateFinished: 3 },
    { month: 'September', finishedOnTime: 5, lateFinished: 4 },
    { month: 'October', finishedOnTime: 6, lateFinished: 2 },
    { month: 'November', finishedOnTime: 8, lateFinished: 1 },
    { month: 'December', finishedOnTime: 9, lateFinished: 3 },
  ];

  const series = [
    {
      label: 'Finished on time',
      stack: 'tasks',
      dataKey: 'finishedOnTime',
    },
    {
      label: 'Late finished',
      stack: 'tasks',
      dataKey: 'lateFinished',
    },
  ];

  const xAxis = [
    {
      dataKey: 'month',
      scaleType: 'band',
      label: 'Month',
    },
  ];

  return (
    <BarChart
      dataset={dataset}
      series={series}
      width={600}
      height={350}
      xAxis={xAxis}
    />
  );
}
