'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, X, AlertCircle } from 'lucide-react'
import { FiCheck } from 'react-icons/fi'
import CustomDropdown from '@/components/ui/CustomDropdown'

export default function TransactionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  
  // Mock data based on ID
  const transaction = {
    id: id,
    event: 'Wedding Setup',
    amount: '₦1,500,000',
    client: 'John Doe',
    vendor: 'Royal Events',
    vendorBank: {
       bank: 'First Bank Nigeria',
       account: '0123456789',
       name: 'Royal Events Ltd'
    },
    timeline: [
      { status: 'Payment received', date: 'Oct 5, 2025 - 10:30 AM', completed: true },
      { status: 'Escrow Funded', date: 'Oct 5, 2025 - 10:30 AM', completed: true },
      { status: 'Awaiting Release', date: 'Event date: Oct 15, 2025', completed: false, current: true },
    ]
  }

  const [modalState, setModalState] = useState<'none' | 'approve' | 'freeze' | 'refund' | 'success'>('none')
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' })

  // Form states
  const [freezeDuration, setFreezeDuration] = useState('24 hours')
  const [freezeReason, setFreezeReason] = useState('')
  const [refundType, setRefundType] = useState('Partial refund')
  const [refundAmount, setRefundAmount] = useState('₦1,200,000')
  const [refundReason, setRefundReason] = useState('')
  const [adminNote, setAdminNote] = useState('')

  const handleAction = (action: 'approve' | 'freeze' | 'refund') => {
    setModalState(action)
  }

  const handleConfirmAction = (action: 'approve' | 'freeze' | 'refund') => {
    if (action === 'approve') {
       setSuccessMessage({ 
         title: 'Payment Approved Successfully', 
         message: 'Funds have been released to the vendor.' 
       })
    } else if (action === 'freeze') {
       setSuccessMessage({ 
         title: 'Escrow Frozen Successfully', 
         message: 'Transaction has been frozen for the selected duration.' 
       })
    } else {
       setSuccessMessage({ 
         title: 'Refund Initiated Successfully', 
         message: 'Refund process has been started.' 
       })
    }
    setModalState('success')
  }

  const closeSuccess = () => {
    setModalState('none')
    router.push('/escrow-admin')
  }

  return (
    <div className="space-y-8 pb-12">
      <Link href="/escrow-admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to transactions
      </Link>

      {/* Transaction Details */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <p className="text-sm text-gray-500 mb-1">Event</p>
                 <p className="font-semibold text-gray-900">{transaction.event}</p>
                 
                 <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-1">Client</p>
                    <p className="font-semibold text-gray-900">{transaction.client}</p>
                 </div>
              </div>
              <div>
                 <p className="text-sm text-gray-500 mb-1">Amount</p>
                 <p className="font-bold text-gray-900 text-lg">{transaction.amount}</p>
                 
                 <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-1">Vendor</p>
                    <p className="font-semibold text-gray-900">{transaction.vendor}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Payment Timeline */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Timeline</h2>
        <div className="bg-transparent pl-2">
           <div className="space-y-8 relative">
              {/* Vertical line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-gray-200 -z-10"></div>
              
              {transaction.timeline.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                   <div className={`w-5 h-5 rounded-full flex-shrink-0 ${step.completed ? 'bg-green-500' : (step.current ? 'bg-gray-300' : 'bg-gray-200 border-2 border-white')}`}></div>
                   <div>
                      <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.status}</p>
                      <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-8">
        <button 
           onClick={() => handleAction('approve')}
           className="bg-[#41A654] text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 min-w-[160px] flex items-center justify-center gap-2"
        >
          <FiCheck className="w-5 h-5" /> Approve Payment
        </button>
        <button 
           onClick={() => handleAction('freeze')}
           className="bg-[#EF4444] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 min-w-[160px] flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" /> Freeze Escrow
        </button>
        <button 
           onClick={() => handleAction('refund')}
           className="bg-[#F59E0B] text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 min-w-[160px]"
        >
          Initiate Refund
        </button>
      </div>

      {/* Modals */}
      {modalState !== 'none' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
           
           {/* Approve Payment Modal */}
           {modalState === 'approve' && (
             <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Approve Payment</h2>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 mb-8">
                   <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                   <p className="text-sm text-amber-800">You are about to approve payout for transaction <span className="font-semibold">{transaction.id}</span></p>
                </div>

                <div className="flex justify-between mb-8">
                   <div>
                      <p className="text-sm text-gray-500">Event</p>
                      <p className="font-bold text-gray-900 text-lg">{transaction.event}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm text-gray-500">Amount to release</p>
                      <p className="font-bold text-[#0B2E6F] text-xl">₦850,000</p>
                   </div>
                </div>

                <div className="mb-6">
                   <p className="text-sm font-medium text-gray-700 mb-2">Vendor Account Details</p>
                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-800"><span className="text-gray-500 w-20 inline-block">Bank:</span> {transaction.vendorBank.bank}</p>
                      <p className="text-sm text-gray-800 mt-1"><span className="text-gray-500 w-20 inline-block">Account:</span> {transaction.vendorBank.account}</p>
                      <p className="text-sm text-gray-800 mt-1"><span className="text-gray-500 w-20 inline-block">Name:</span> {transaction.vendorBank.name}</p>
                   </div>
                </div>

                <div className="mb-8">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                   <textarea 
                     className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] min-h-[100px]"
                     placeholder="Add notes about this payout"
                     value={adminNote}
                     onChange={(e) => setAdminNote(e.target.value)}
                   />
                </div>

                <div className="flex justify-between gap-4">
                   <button 
                     onClick={() => handleConfirmAction('approve')}
                     className="bg-[#0B2E6F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#09255a] flex items-center gap-2"
                   >
                     <FiCheck className="w-4 h-4" /> Confirm Payment
                   </button>
                   <button 
                     onClick={() => setModalState('none')}
                     className="bg-white text-gray-600 border border-gray-200 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
                   >
                     <X className="w-4 h-4" /> Cancel
                   </button>
                </div>
             </div>
           )}

           {/* Freeze Escrow Modal */}
           {modalState === 'freeze' && (
             <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Freeze Escrow</h2>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 mb-8">
                   <div className="w-5 h-5 flex items-center justify-center mt-0.5">🔒</div>
                   <p className="text-sm text-amber-800">Freezing this escrow will temporarily prevent any payout or refund actions until unfrozen</p>
                </div>

                <div className="flex justify-between mb-8">
                   <div>
                      <p className="text-sm text-gray-500">Event</p>
                      <p className="font-bold text-gray-900 text-lg">{transaction.event}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm text-gray-500">Amount to freeze</p>
                      <p className="font-bold text-[#0B2E6F] text-xl">{transaction.amount}</p>
                   </div>
                </div>

                <div className="mb-6">
                   <CustomDropdown 
                     label="Freeze Duration"
                     options={[
                       { label: '24 hours', value: '24 hours' },
                       { label: '48 hours', value: '48 hours' },
                       { label: '7 days', value: '7 days' },
                     ]}
                     selected={freezeDuration}
                     onChange={setFreezeDuration}
                   />
                </div>

                <div className="mb-8">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Reason for freeze</label>
                   <textarea 
                     className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] min-h-[100px]"
                     placeholder="Explain reason for freeze"
                     value={freezeReason}
                     onChange={(e) => setFreezeReason(e.target.value)}
                   />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-8 text-xs text-blue-800">
                   Note: Both vendor and client will be notified of this freeze. A notification will be sent to Super Admin for oversight.
                </div>

                <div className="flex justify-between gap-4">
                   <button 
                     onClick={() => handleConfirmAction('freeze')}
                     className="bg-[#0B2E6F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#09255a] flex items-center gap-2"
                   >
                     <div className="w-4 h-4 text-xs">🔒</div> Freeze Escrow
                   </button>
                   <button 
                     onClick={() => setModalState('none')}
                     className="bg-white text-gray-600 border border-gray-200 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
                   >
                     <X className="w-4 h-4" /> Cancel
                   </button>
                </div>
             </div>
           )}

           {/* Refund Payment Modal */}
           {modalState === 'refund' && (
             <div className="bg-white rounded-xl p-8 w-full max-w-2xl shadow-xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Refund Payment</h2>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 mb-8">
                   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                   <p className="text-sm text-red-800">You are about to initiate refund for transaction <span className="font-semibold">{transaction.id}</span></p>
                </div>

                <div className="flex justify-between mb-8">
                   <div>
                      <p className="text-sm text-gray-500">Event</p>
                      <p className="font-bold text-gray-900 text-lg">{transaction.event}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-bold text-[#0B2E6F] text-xl">{transaction.amount}</p>
                   </div>
                </div>

                <div className="mb-6">
                   <CustomDropdown 
                     label="Refund Type"
                     options={[
                       { label: 'Partial refund', value: 'Partial refund' },
                       { label: 'Full refund', value: 'Full refund' },
                     ]}
                     selected={refundType}
                     onChange={setRefundType}
                   />
                </div>

                <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount</label>
                   <input 
                     type="text"
                     className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0B2E6F]"
                     value={refundAmount}
                     onChange={(e) => setRefundAmount(e.target.value)}
                   />
                </div>

                <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-2">Reason for refund</label>
                   <textarea 
                     className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#0B2E6F] min-h-[100px]"
                     placeholder="Explain reason for refund"
                     value={refundReason}
                     onChange={(e) => setRefundReason(e.target.value)}
                   />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-8 text-sm">
                   <p className="font-medium text-gray-800 mb-1">Bank: Sterling Bank Nigeria</p>
                   <p className="font-medium text-gray-800 mb-1">Account: 0123456789</p>
                   <p className="font-medium text-gray-800">Name: John Doe</p>
                </div>

                <div className="flex justify-between gap-4">
                   <button 
                     onClick={() => handleConfirmAction('refund')}
                     className="bg-[#0B2E6F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#09255a] flex items-center gap-2"
                   >
                     Refund Payment
                   </button>
                   <button 
                     onClick={() => setModalState('none')}
                     className="bg-white text-gray-600 border border-gray-200 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
                   >
                     <X className="w-4 h-4" /> Cancel
                   </button>
                </div>
             </div>
           )}

           {/* Success Modal */}
           {modalState === 'success' && (
             <div className="bg-white rounded-3xl p-8 w-full max-w-md flex flex-col items-center text-center relative shadow-xl">
               <button onClick={closeSuccess} className="absolute top-4 right-4 text-white bg-[#0B2E6F] rounded-md p-1 hover:bg-blue-900">
                 <X className="w-5 h-5" />
               </button>
               
               {/* Circle Check Icon */}
               <div className="mb-6 relative">
                 <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center">
                        <FiCheck className="w-8 h-8 text-white stroke-[3px]" />
                    </div>
                 </div>
                 {/* Decorative dots */}
                 <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-yellow-400 rounded-full -translate-x-2 translate-y-2"></div>
                 <div className="absolute top-4 right-0 w-1.5 h-1.5 bg-yellow-400 rounded-full translate-x-4"></div>
                 <div className="absolute bottom-0 left-2 w-1.5 h-1.5 bg-yellow-400 rounded-full translate-y-2"></div>
               </div>

               <h2 className="text-xl font-bold text-gray-800 mb-2">
                 {successMessage.title}
               </h2>
               
               <p className="text-gray-600 mb-8">
                 {successMessage.message}
               </p>

               <button 
                 onClick={closeSuccess}
                 className="w-full bg-[#0B2E6F] text-white py-3 rounded-lg font-bold hover:bg-[#09255a] transition-colors"
               >
                 Done
               </button>
             </div>
           )}

        </div>
      )}
    </div>
  )
}
