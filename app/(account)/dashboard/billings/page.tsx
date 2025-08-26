'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectMenuItem } from '@/store/dashboardSlice';
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext';
import { Search, Filter, MoreHorizontal, Calendar } from 'lucide-react';

interface PaymentRecord {
  id: string;
  date: string;
  time: string;
  invoiceNumber: string;
  eventVendor: string;
  paymentMethod: string;
  amount: string;
  status: 'Unpaid' | 'Paid' | 'Overdue';
}

const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Card',
    amount: 'N200,000.00',
    status: 'Unpaid'
  },
  {
    id: '2',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Transfer',
    amount: 'N200,000.00',
    status: 'Unpaid'
  },
  {
    id: '3',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Transfer',
    amount: 'N200,000.00',
    status: 'Unpaid'
  },
  {
    id: '4',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Card',
    amount: 'N200,000.00',
    status: 'Overdue'
  },
  {
    id: '5',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Transfer',
    amount: 'N200,000.00',
    status: 'Overdue'
  },
  {
    id: '6',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Card',
    amount: 'N200,000.00',
    status: 'Overdue'
  },
  {
    id: '7',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Transfer',
    amount: 'N200,000.00',
    status: 'Paid'
  },
  {
    id: '8',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Card',
    amount: 'N200,000.00',
    status: 'Paid'
  },
  {
    id: '9',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Transfer',
    amount: 'N200,000.00',
    status: 'Paid'
  },
  {
    id: '10',
    date: '20/07/2025',
    time: '02:25pm',
    invoiceNumber: '88783',
    eventVendor: 'UK Cakes & Cream - Catering',
    paymentMethod: 'Card',
    amount: 'N200,000.00',
    status: 'Paid'
  }
];

export default function PaymentBillingPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Payment Status');
  const [fromDate, setFromDate] = useState('12 Jul, 2025');
  const [toDate, setToDate] = useState('18 Jul, 2025');
  const dispatch = useDispatch();
  const { showNotification } = useNotificationBreadcrumb();

  useEffect(() => {
    dispatch(
      selectMenuItem({
        view: 'billings',
        breadcrumb: { label: 'Payment & Billings', path: '/dashboard/billings' },
      })
    );

    if (showNotification) {
      showNotification({
        message: "Security Reminder: EventHub will never ask you to make payments outside the platform. Only complete transactions through our secure system.",
        type: "info",
        icon: "shield",
        dismissible: true,
        autoHide: false,
      });
    }
  }, [dispatch, showNotification]);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Unpaid':
        return `${baseClasses} bg-yellow text-gray-200`;
      case 'Overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[20px] font-semibold font-heading text-gray-900">Payment & Billings</h1>
        
        {/* Date Range Filter */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">From:</span>
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-blue-900 text-white">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{fromDate}</span>
          </div>
          <span className="text-sm text-gray-600">To:</span>
          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-blue-900 text-white">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{toDate}</span>
          </div>
        </div>
      </div>
      <div className='border border-gray-200 rounded-lg'>
      {/* Search and Filter Bar */}
      <div className="flex justify-between items-center mb-6 p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by Invoice Number, Vendor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by:</span>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-blue-600 text-white px-4 py-2 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Payment Status">Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white h-4 w-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Payment Table */}
     
      <div className="overflow-x-auto border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice Number</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Event/Vendor</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Method</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">
                  {payment.date}, {payment.time}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{payment.invoiceNumber}</td>
                <td className="py-3 px-4 text-sm text-blue-600 hover:underline cursor-pointer">
                  {payment.eventVendor}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{payment.paymentMethod}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{payment.amount}</td>
                <td className="py-3 px-4">
                  <span className={getStatusBadge(payment.status)}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing 1- 10 of 20
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            2
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            3
          </button>
          <span className="px-2 text-gray-400">...</span>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            7
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            10
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}