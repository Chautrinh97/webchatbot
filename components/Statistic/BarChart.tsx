import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useTheme } from 'next-themes';
import { steps } from 'framer-motion';

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
);

export const BarChart = (
   { title, labels, data, bgColors }:
      { title: string, labels: string[], data: number[], bgColors: string[] }) => {
   const { resolvedTheme } = useTheme();
   const textColor = resolvedTheme === 'dark' ? '#fff' : '#000';
   const gridColor = resolvedTheme === 'dark' ? '#c4b5b5' : '#a89696';

   const chartData = {
      labels: labels,
      datasets: [
         {
            label: '',
            data: data,
            backgroundColor: bgColors,
            borderWidth: 1,
         }
      ],
   };

   const options = {
      responsive: true,
      plugins: {
         legend: {
            display: false,
         },
         title: {
            display: true,
            text: title,
            font: {
               size: 16,
               weight: 'normal' as const,
            },
            color: textColor
         },
      },
      scales: {
         x: {
            ticks: {
               color: textColor
            },
            grid: {
               color: gridColor,
            }
         },
         y: {
            beginAtZero: true,
            ticks: {
               stepSize: 1,   
               color: textColor
            },
            grid: {
               color: gridColor,
            }
         },
      },
   };

   return <Bar data={chartData} options={options} height={200} />;
}