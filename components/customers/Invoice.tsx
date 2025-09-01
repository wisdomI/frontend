'use client'

import { useState } from 'react'

type Invoice = {
  id: number
  date: string
  number: string
  client: string
  service: string
  amount: string
  status: 'Unpaid' | 'Paid' | 'Overdue'
}

const invoices: Invoice[] = [
  {
    id: 1,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Unpaid',
  },
  {
    id: 2,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    id: 3,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Overdue',
  },
  {
    id: 4,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Unpaid',
  },
  {
    id: 5,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    id: 6,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Overdue',
  },
  {
    id: 7,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Unpaid',
  },
  {
    id: 8,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Paid',
  },
  {
    id: 9,
    date: '20/07/2025; 02:25pm',
    number: '88783',
    client: 'Daniel Adebayo',
    service: 'Catering & Drinks',
    amount: '₦200,000.00',
    status: 'Overdue',
  },
]

const statusStyles: Record<Invoice['status'], string> = {
  Unpaid: 'bg-yellow-100 text-yellow-700',
  Paid: 'bg-green-100 text-green-700',
  Overdue: 'bg-red-100 text-red-700',
}

export default function InvoiceTable() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Invoice['status'] | 'All'>('All')

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.number.includes(search) ||
      inv.client.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || inv.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Search + Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Invoice Number, Name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />

        <select
          value={filter}
          onChange={e => setFilter(e.target.value as Invoice['status'] | 'All')}
          className="border rounded px-3 py-2"
        >
          <option value="All">Filter by: Payment Status</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>

        From: <input type="date" className="border rounded px-3 py-2" />
        To: <input type="date" className="border rounded px-3 py-2" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-left text-gray-600 text-sm">
            <tr>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Invoice Number</th>
              <th className="p-3">Client Name</th>
              <th className="p-3">Service Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(inv => (
              <tr key={inv.id} className="border-t text-sm">
                <td className="p-3">{inv.date}</td>
                <td className="p-3">{inv.number}</td>
                <td className="p-3">{inv.client}</td>
                <td className="p-3">{inv.service}</td>
                <td className="p-3">{inv.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}