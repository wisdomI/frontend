import InvoiceTable from '@/components/vendors/Invoice'

export default function InvoicesPage() {
  return (
    <main className="p-6">
      <h1 className="p-4 py-2 font-bold text-3xl pt-4 text-gray-600 font-asul">
        Invoice Management
      </h1>
      <InvoiceTable />
    </main>
  )
}
