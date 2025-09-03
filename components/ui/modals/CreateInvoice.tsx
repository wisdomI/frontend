'use client'

import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function CreateInvoiceModal({
  open,
  onClose,
  onPreview,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onPreview: (invoice: any) => void
  onSave: (invoice: any) => void
}) {
  const [client, setClient] = useState('')
  const [date, setDate] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [discount, setDiscount] = useState(10)
  const [amount, setAmount] = useState(100000)

  const total = amount - (amount * discount) / 100

  const invoice = {
    id: '#7674',
    date,
    client,
    items,
    discount,
    amount,
    total,
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-[450px] h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <button onClick={onClose} className="text-gray-600">
              ←
            </button>
            <Dialog.Title className="font-semibold text-lg">
              Create Invoice
            </Dialog.Title>
            <span className="text-sm font-medium text-gray-500">
              Invoice No {invoice.id}
            </span>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-700 font-medium">
              Kindly fill in your invoice details
            </p>

            {/* Date */}
            <label className="block text-sm font-medium">
              Select Invoice Due Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border rounded-lg w-full p-2"
            />

            {/* Client */}
            <label className="block text-sm font-medium">Select Client</label>
            <select
              value={client}
              onChange={e => setClient(e.target.value)}
              className="border rounded-lg w-full p-2"
            >
              <option value="">Select an Option</option>
              <option value="Daniel">Daniel Adebayo</option>
              <option value="UK Cakes">UK Cakes & Cream</option>
            </select>

            {/* Description */}
            <label className="block text-sm font-medium">Description 1</label>
            <input
              type="text"
              defaultValue="Small Chops"
              className="border rounded-lg w-full p-2"
            />

            {/* Quantity */}
            <label className="block text-sm font-medium">Select Quantity</label>
            <input
              type="number"
              defaultValue={20}
              className="border rounded-lg w-full p-2"
            />

            {/* Amount */}
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="text"
              value={`₦ ${amount.toLocaleString()}.00`}
              className="border rounded-lg w-full p-2 font-semibold text-event-blue"
            />

            {/* Add Button */}
            <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">
              + Add
            </button>

            {/* Discount */}
            <label className="block text-sm font-medium">
              Overall Discount
            </label>
            <input
              type="text"
              value={`${discount} %`}
              readOnly
              className="border rounded-lg w-full p-2"
            />
            <p className="text-gray-600 text-sm">
              -₦{((amount * discount) / 100).toLocaleString()}
            </p>

            {/* Total */}
            <div className="bg-gray-100 text-gray-700 font-medium px-3 py-2 rounded flex justify-between">
              <span>Total Amount</span>
              <span>₦{total.toLocaleString()}.00</span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 border-t p-4">
            <button
              className="flex-1 border border-blue-900 text-blue-900 py-2 rounded-lg font-medium"
              onClick={() => onPreview(invoice)}
            >
              Preview Receipt
            </button>
            <button
              className="flex-1 bg-blue-900 text-white py-2 rounded-lg font-medium"
              onClick={() => onSave(invoice)}
            >
              Save & Send
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
