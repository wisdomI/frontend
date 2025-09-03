'use client'

import { useState } from 'react'
import DateRange from '../ui/DateRangePicker'
import InvoiceModal from '../ui/modals/InvoiceModal'
import { BsThreeDotsVertical } from 'react-icons/bs'


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

const statusActions: Record<string, { actions: string[] }> = {
  Unpaid: {
    actions: ['View Invoice','Download Invoice', 'Proceed to Pay'],
  },
  Paid: {
    actions: ['View Receipt','Download Receipt'],
  },
  Overdue: {
    actions: ['View Invoice','Extend Invoice Timeline'],
  },
}

export default function InvoiceTable() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Invoice['status'] | 'All'>('All')
  const [open, setOpen] = useState<number | null>(null)

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.number.includes(search) ||
      inv.client.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || inv.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-4 bg-[#FAFAFA] border border-[#E1E1E1] rounded-lg shadow my-3">
      {/* Search + Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 justify-between">
        <input
          type="text"
          placeholder="Search by Invoice Number, Name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-xl px-3 py-2 w-full md:w-1/3"
        />
        <div className="flex items-center gap-2">
          <p>Filter by:</p>
          <select
            value={filter}
            onChange={e =>
              setFilter(e.target.value as Invoice['status'] | 'All')
            }
            className="border rounded-lg px-3 py-2 bg-event-blue text-white font-bold"
          >
            <option value="All">Payment Status</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        {/* From: <input type="date" className="border rounded px-3 py-2 custom-date-picker" />
        To: <input type="date" className="border rounded px-3 py-2" /> */}
        <DateRange />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-gray-600 text-lg text-center font-asul">
            <tr>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Invoice Number</th>
              <th className="p-3">Client Name</th>
              <th className="p-3">Service Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredInvoices.map(inv => {
              const { actions } = statusActions[inv.status] 

              return (
                <tr key={inv.id} className="text-lg">
                  <td className="p-3 px-5">{inv.date}</td>
                  <td className="p-3">{inv.number}</td>
                  <td className="p-3">{inv.client}</td>
                  <td className="p-3">{inv.service}</td>
                  <td className="p-3">{inv.amount}</td>
                  <td className="p-3 px-5 relative">
                    <div className="flex items-center gap-2 justify-center">
                      <span
                        className={`px-3 py-2 rounded-full text-xs font-medium w-24 text-center ${statusStyles[inv.status]}`}
                      >
                        {inv.status}
                      </span>

                      {/* 3-dot menu button */}
                      <button
                        className="p-1 rounded-full hover:bg-gray-100"
                        onClick={() => setOpen(open === inv.id ? null : inv.id)}
                      >
                        <BsThreeDotsVertical />
                      </button>
                    </div>

                    {/* Floating modal */}
                    {open === inv.id && (
                      <div className="absolute right-12 top-12 bg-white shadow-lg rounded-xl w-52 z-20 p-2">
                        <div className="mt-2">
                          {actions.map((action, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-2 hover:bg-blue-100 hover:text-blue-900 font-semibold cursor-pointer rounded-md text-gray-700 text-base text-left"
                            >
                              {action}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
