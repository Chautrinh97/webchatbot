'use client'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement, Title } from 'chart.js'
import { useTheme } from 'next-themes';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function getColorByIndex(index: number) {
   const baseHue = 0;
   const saturation = 70;
   const lightness = 60;
   const hue = (baseHue + index * 30) % 360;
   return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const PieChart = ({ total, title, data, labels }: { total: number, title: string, data: any, labels: any }) => {
   const { resolvedTheme } = useTheme();
   const colors = data.map((_: any, index: number) => getColorByIndex(index));

   const options = {
      responsive: true,
      plugins: {
         legend: {
            position: "bottom" as const,
            labels: {
               color: resolvedTheme === 'dark' ? '#fff' : '#000',
            }
         },
         tooltip: {
            callbacks: {
               label: (tooltipItem: any) => {
                  const value = tooltipItem.raw;
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${value} (${percentage}%)`;
               },
            }
         },
         title: {
            display: true,
            text: title,
            font: {
               size: 16,
               weight: 'normal' as const,
            },
            color: resolvedTheme === 'dark' ? '#fff' : '#000',
         }
      },
      animation: {
         animateRotate: true,
         duration: 1500,
      },
      cutout: '30%',
   }


   const chartData = {
      labels,
      datasets: [
         {
            data,
            backgroundColor: colors,
            borderWidth: 1,
            hoverOffset: 10,
         }
      ],
   }
   return <Pie data={chartData} options={options}/>
}