'use client'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function EarningsPaymentsChart() {
  const data = {
    labels: ['1 Jul', '2 Jul', '3 Jul', '4 Jul', '5 Jul', '6 Jul', '7 Jul'],
    datasets: [
      {
        label: 'Subscription',
        data: [1.4, 1.3, 1.4, 1.3, 1.2, 0.8, 1.2],
        backgroundColor: '#032D71', // dark blue
      },
      {
        label: 'Earnings',
        data: [1.3, 0.5, 1.6, 0.6, 0.4, 2.0, 0.5],
        backgroundColor: '#FBBF24', // yellow
      },
      {
        label: 'Withdrawals',
        data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        backgroundColor: '#4B5563', // gray
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      title: {
        display: true,
        text: 'My Earnings & Payments',
        font: {
          size: 18,
          weight: 'bold',
        },
        align: 'start',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
          font: { size: 14, weight: 'bold' },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₦)',
          font: { size: 14, weight: 'bold' },
        },
      },
    },
  }

  return (
    <div className="p-3 sm:p-4 rounded-lg border shadow-md bg-white">
      <Bar data={data} options={options} />
    </div>
  )
}
