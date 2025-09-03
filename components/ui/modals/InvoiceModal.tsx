'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import Image from 'next/image'

type InvoiceModalProps = {
  open: boolean
  onClose: () => void
  invoice: any
  mode: 'preview' | 'saved'
}

export default function InvoiceModal({
  open,
  onClose,
  invoice,
  mode,
}: InvoiceModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="bg-white rounded-lg shadow-lg w-[750px] h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-2xl font-bold text-blue-900">EventHub</h2>
            <p className="text-gray-700 font-semibold text-lg">
              Invoice No #{invoice?.id}
            </p>
          </div>

          {/* Invoice Info */}
          <div className="px-6 py-4 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Issued On</p>
              <p className="font-semibold">{invoice?.issuedOn}</p>
            </div>
            <div>
              <p className="text-gray-500">Due On</p>
              <p className="font-semibold">{invoice?.dueDate}</p>
            </div>
            <div>
              <p className="text-gray-500">From</p>
              <div className="flex items-center gap-2 mt-1">
                {invoice?.from?.logo && (
                  <Image
                    src={invoice.from.logo}
                    alt="Company Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold">{invoice?.from?.name}</p>
                  <p className="text-blue-600 text-sm">
                    {invoice?.from?.email}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-500">To</p>
              <div className="mt-1">
                <p className="font-semibold">{invoice?.to?.name}</p>
                <p className="text-blue-600 text-sm">{invoice?.to?.email}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-6 mt-2">
            <div className="flex bg-event-blue text-white font-semibold rounded-t-lg">
              <div className="flex-1 px-3 py-2">Description</div>
              <div className="w-24 text-center py-2">Qty</div>
              <div className="w-32 text-right px-3 py-2">Amount</div>
            </div>

            <div className="divide-y border rounded-b-lg">
              {invoice?.items?.map((item: any, i: number) => (
                <div key={i} className="flex text-gray-700 text-sm px-3 py-2">
                  <div className="flex-1">{item.name}</div>
                  <div className="w-24 text-center">{item.qty || '-'}</div>
                  <div className="w-32 text-right">
                    ₦{Number(item.amount).toLocaleString()}.00
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="px-6 py-4 space-y-1 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{Number(invoice?.subtotal).toLocaleString()}.00</span>
            </div>
            {invoice?.discount && (
              <div className="flex justify-between">
                <span>Discount - {invoice.discount.label}</span>
                <span>
                  ₦{Number(invoice.discount.value).toLocaleString()}.00
                </span>
              </div>
            )}
            <div className="flex justify-between items-center bg-event-blue text-white font-bold rounded-lg px-4 py-2 mt-3">
              <span>Total Amount</span>
              <span>₦{Number(invoice?.total).toLocaleString()}.00</span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between px-6 py-4 border-t">
            {mode === 'preview' ? (
              <>
                <button
                  className="bg-gray-200 px-4 py-2 rounded-lg font-medium"
                  onClick={onClose}
                >
                  Close
                </button>
                <button className="bg-blue-900 text-white px-4 py-2 rounded-lg font-medium">
                  Save & Send
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center gap-2 bg-event-blue text-white px-4 py-2 rounded-lg font-medium">
                  ⬇ Download Invoice
                </button>
                <button className="flex items-center gap-2 bg-event-blue text-white px-4 py-2 rounded-lg font-medium">
                  💳 Proceed to Pay
                </button>
              </>
            )}
          </div>

          {/* Footer Note */}
          <div className="bg-blue-100 text-center py-2 text-gray-600 text-sm rounded-b-lg">
            Thanks for your patronage
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
