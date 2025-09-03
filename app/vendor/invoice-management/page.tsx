'use client'

import { useState } from 'react'
import InvoiceTable from '@/components/vendors/InvoiceTable'
import Button from '@/components/ui/Button'
import CreateInvoiceModal from '@/components/ui/modals/CreateInvoice'
import InvoiceModal from '@/components/ui/modals/InvoiceModal'

export default function InvoicesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const saveInvoiceToDB = (invoice: any) => {
    console.log('Saving invoice:', invoice)
  }

  return (
    <main className="p-6">
      <div className='flex justify-between items-center'> 
        <h1 className="p-4 py-2 font-bold text-3xl pt-4 text-gray-600 font-asul">
          Invoice Management
        </h1>
        <Button
          type="button"
          className="border-0"
          onClick={() => setIsCreateOpen(true)}
        >
          + Create Invoice
        </Button>
      </div>

      <InvoiceTable />

      {/* Create Invoice Modal */}
      {isCreateOpen && (
        <CreateInvoiceModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onPreview={invoice => {
            setIsCreateOpen(false)
            setSelectedInvoice(invoice)
            setIsPreviewOpen(true)
          }}
          onSave={invoice => {
            saveInvoiceToDB(invoice)
            setIsCreateOpen(false)
          }}
        />
      )}

      {/* Preview Invoice Modal */}
      {isPreviewOpen && (
        <InvoiceModal
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          invoice={selectedInvoice}
          mode="preview" // 👈 pass "preview" or "saved"
        />
      )}
    </main>
  )
}
