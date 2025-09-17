'use client'
import React from 'react'
import { FiX, FiDownload } from 'react-icons/fi'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface InvoicePreviewProps {
  isOpen: boolean
  onClose: () => void
  invoiceData: {
    invoiceNumber: string
    issuedDate: string
    dueDate: string
    from: {
      name: string
      email: string
      logo?: string
    }
    to: {
      name: string
      email: string
    }
    items: Array<{
      description: string
      quantity: number | string
      amount: string
    }>
    subtotal: number
    discount: string
    discountAmount: number
    total: number
  }
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  isOpen,
  onClose,
  invoiceData
}) => {
  const handleDownloadPDF = async () => {
    const invoiceElement = document.getElementById('invoice-content')
    if (!invoiceElement) return

    try {
      // Create canvas from the invoice content
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      // Calculate dimensions to fit the content
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Download the PDF
      pdf.save(`invoice-${invoiceData.invoiceNumber.replace('#', '')}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="p-8 bg-white">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#032D71' }}>EventHub</h1>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-700">Invoice No {invoiceData.invoiceNumber}</p>
            </div>
          </div>

          {/* Date Information */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm text-gray-600">Issued On</p>
              <p className="text-sm font-medium text-gray-900">{invoiceData.issuedDate}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Due On</p>
              <p className="text-sm font-medium text-gray-900">{invoiceData.dueDate}</p>
            </div>
          </div>

          {/* From and To Section */}
          <div className="flex justify-between items-start mb-8">
            {/* From */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">From</p>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{invoiceData.from.name}</p>
                  <p className="text-sm italic" style={{ color: '#032D71' }}>{invoiceData.from.email}</p>
                </div>
              </div>
            </div>

            {/* To */}
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 mb-2">To</p>
              <p className="font-medium text-gray-900">{invoiceData.to.name}</p>
              <p className="text-sm italic" style={{ color: '#032D71' }}>{invoiceData.to.email}</p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#032D71' }}>
                  <th className="px-4 py-3 text-left text-white font-medium">Description</th>
                  <th className="px-4 py-3 text-center text-white font-medium">Qty</th>
                  <th className="px-4 py-3 text-right text-white font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-gray-900">{item.description}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="space-y-3 mb-8">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal</span>
              <span className="text-gray-900">N{invoiceData.subtotal.toLocaleString()}.00</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Discount - {invoiceData.discount}</span>
              <span className="text-gray-900">N{invoiceData.discountAmount.toLocaleString()}.00</span>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center py-3 px-4 rounded-lg" style={{ backgroundColor: '#032D71' }}>
              <span className="text-white font-medium">Total Amount</span>
              <span className="text-white font-bold text-lg">N{invoiceData.total.toLocaleString()}.00</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
            <p className="text-gray-700 font-medium">Thanks for your patronage</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 text-gray-600 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: '#032D71' }}
          >
            <FiDownload className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 px-6 py-3 border-2 text-gray-600 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoicePreview
