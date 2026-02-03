'use client'

import React, { useState } from 'react'
import Receipt from '@/components/ui/Receipt'
import { useReceipt } from '@/hooks/useReceipt'
import { useInvoice } from '@/hooks/useInvoice'
import { FiDownload, FiPrinter, FiRefreshCw, FiEye } from 'react-icons/fi'
import { generateReceiptPDF, generateReceiptPNG } from '@/lib/receiptPdfGenerator'

export default function ReceiptDemoPage() {
  const { receipts, receipt, loading, fetchReceipts, fetchReceiptById, generateReceiptFromInvoice } = useReceipt()
  const { invoices, fetchInvoices } = useInvoice()
  const [selectedReceipt, setSelectedReceipt] = useState(receipt)
  const [showReceiptViewer, setShowReceiptViewer] = useState(false)

  React.useEffect(() => {
    fetchReceipts()
    fetchInvoices()
  }, [])

  const handleDownloadPDF = async (receipt: any) => {
    try {
      // Create a temporary element to render the receipt
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '0'
      tempDiv.style.width = '794px'
      tempDiv.style.backgroundColor = 'white'
      tempDiv.style.padding = '0'
      tempDiv.style.margin = '0'
      tempDiv.style.fontFamily = 'Arial, sans-serif'
      document.body.appendChild(tempDiv)

      // Render the receipt component
      const { createRoot } = await import('react-dom/client')
      const root = createRoot(tempDiv)
      
      root.render(<Receipt receipt={receipt} showActions={false} />)

      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Use the pixel-perfect PDF generator
      await generateReceiptPDF(
        tempDiv,
        `receipt-${receipt.receiptNumber}.pdf`,
        {
          scale: 3, // High resolution for pixel-perfect quality
          useCORS: true,
          backgroundColor: '#ffffff',
          quality: 1.0
        }
      )

      // Cleanup
      root.unmount()
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handlePrint = () => {
    if (selectedReceipt) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const { createRoot } = require('react-dom/client')
        const tempDiv = printWindow.document.createElement('div')
        tempDiv.style.padding = '20px'
        tempDiv.style.fontFamily = 'Arial, sans-serif'
        printWindow.document.body.appendChild(tempDiv)
        
        const root = createRoot(tempDiv)
        root.render(<Receipt receipt={selectedReceipt} showActions={false} />)
        
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 1000)
      }
    }
  }

  const handleGenerateReceiptFromInvoice = async (invoiceId: string) => {
    try {
      await generateReceiptFromInvoice(invoiceId)
      alert('Receipt generated successfully from invoice!')
    } catch (error) {
      console.error('Failed to generate receipt from invoice:', error)
      alert('Failed to generate receipt from invoice.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Receipt System Demo</h1>
          <p className="text-gray-600 mt-2">
            This demo shows the EventHub-style receipt system with PDF generation and download functionality.
          </p>
        </div>

        {/* Receipt Preview */}
        {receipts.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Receipt Preview</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownloadPDF(receipts[0])}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReceipt(receipts[0])
                      handlePrint()
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FiPrinter className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReceipt(receipts[0])
                      setShowReceiptViewer(true)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View Full Screen</span>
                  </button>
                </div>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <Receipt receipt={receipts[0]} showActions={false} />
              </div>
            </div>
          </div>
        )}

        {/* Integration with Invoices */}
        {invoices.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Generate Receipt from Invoice</h2>
              <div className="space-y-4">
                {invoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">Invoice #{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {invoice.clientName} - ₦{invoice.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {invoice.status}
                      </p>
                    </div>
                    <button
                      onClick={() => handleGenerateReceiptFromInvoice(invoice.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={invoice.status !== 'paid'}
                    >
                      {invoice.status === 'paid' ? 'Generate Receipt' : 'Invoice Not Paid'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">EventHub Design</h3>
            <p className="text-gray-600 text-sm">
              Exact replica of the EventHub receipt design with proper styling, colors, and layout.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">PDF Generation</h3>
            <p className="text-gray-600 text-sm">
              High-quality PDF generation using html2canvas and jsPDF with proper formatting.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">Print Ready</h3>
            <p className="text-gray-600 text-sm">
              Optimized for printing with proper page breaks and print-friendly styling.
            </p>
          </div>
        </div>

        {/* Receipt Viewer Modal */}
        {showReceiptViewer && selectedReceipt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Receipt #{selectedReceipt.receiptNumber}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownloadPDF(selectedReceipt)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FiPrinter className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={() => setShowReceiptViewer(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="p-6">
                <Receipt receipt={selectedReceipt} showActions={false} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
