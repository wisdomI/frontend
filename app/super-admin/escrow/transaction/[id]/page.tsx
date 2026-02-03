'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Shield,
  CreditCard,
  User,
  Calendar
} from 'lucide-react'

// Mock Data
const transaction = {
  id: 'ESC-2089',
  event: 'Wedding Setup',
  client: 'John Doe',
  clientEmail: 'john.doe@example.com',
  vendor: 'Royal Events',
  vendorEmail: 'contact@royalevents.com',
  amount: '₦1,500,000',
  status: 'Funded',
  dateCreated: '2025-10-15',
  dueDate: '2025-12-20',
  description: 'Full wedding decoration and lighting setup including floral arrangements.',
  milestones: [
    { id: 1, title: 'Deposit / Initial Setup', amount: '₦450,000', status: 'Released', date: '2025-10-15' },
    { id: 2, title: 'Materials Purchase', amount: '₦600,000', status: 'Pending', date: '2025-11-01' },
    { id: 3, title: 'Final Installation', amount: '₦450,000', status: 'Locked', date: '2025-12-19' },
  ]
}

export default function EscrowTransactionDetailsPage() {
  const params = useParams()
  // const id = params.id // In a real app, use this to fetch data
  
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'documents'>('overview')

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <Link href="/super-admin/escrow" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-2">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-raleway text-gray-900">Transaction #{transaction.id}</h1>
            <span className="bg-blue-100 text-[#0B2E6F] px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
              {transaction.status}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0B2E6F] text-white rounded-lg font-medium hover:bg-[#09255a] transition-colors">
            Release Funds
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'overview' ? 'text-[#0B2E6F] border-b-2 border-[#0B2E6F] bg-blue-50/30' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('milestones')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'milestones' ? 'text-[#0B2E6F] border-b-2 border-[#0B2E6F] bg-blue-50/30' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Milestones
              </button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'documents' ? 'text-[#0B2E6F] border-b-2 border-[#0B2E6F] bg-blue-50/30' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Documents
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Transaction Summary</h3>
                    <p className="text-gray-600 leading-relaxed">{transaction.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <User className="w-5 h-5 text-[#0B2E6F]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Client</p>
                        <p className="font-medium text-gray-900">{transaction.client}</p>
                        <p className="text-sm text-gray-500">{transaction.clientEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Vendor</p>
                        <p className="font-medium text-gray-900">{transaction.vendor}</p>
                        <p className="text-sm text-gray-500">{transaction.vendorEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                        <p className="font-medium text-gray-900">{transaction.amount}</p>
                        <p className="text-sm text-gray-500">Escrow Protected</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-700" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Important Dates</p>
                        <p className="text-sm text-gray-900">Created: {transaction.dateCreated}</p>
                        <p className="text-sm text-gray-900">Due: {transaction.dueDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  {transaction.milestones.map((milestone, idx) => (
                    <div key={milestone.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                          ${milestone.status === 'Released' ? 'bg-green-100 text-green-700' :
                            milestone.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                          <p className="text-sm text-gray-500">Due: {milestone.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pl-12 sm:pl-0">
                        <span className="font-bold text-gray-900">{milestone.amount}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                          ${milestone.status === 'Released' ? 'bg-green-100 text-green-700' :
                            milestone.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                       <FileText className="w-8 h-8 text-blue-500" />
                       <div>
                         <p className="font-medium text-gray-900">Contract_Agreement_v1.pdf</p>
                         <p className="text-xs text-gray-500">2.4 MB • Uploaded on Oct 15, 2025</p>
                       </div>
                     </div>
                     <button className="text-[#0B2E6F] hover:underline text-sm font-medium">View</button>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                     <div className="flex items-center gap-3">
                       <FileText className="w-8 h-8 text-red-500" />
                       <div>
                         <p className="font-medium text-gray-900">Invoice_#INV-2089.pdf</p>
                         <p className="text-xs text-gray-500">1.1 MB • Generated on Oct 15, 2025</p>
                       </div>
                     </div>
                     <button className="text-[#0B2E6F] hover:underline text-sm font-medium">View</button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Status Timeline & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Status</h3>
            <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] bg-green-500 w-4 h-4 rounded-full border-2 border-white ring-4 ring-green-100"></div>
                <p className="text-sm font-bold text-gray-900">Funds Secured</p>
                <p className="text-xs text-gray-500 mt-1">Oct 15, 2025 • 10:30 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] bg-green-500 w-4 h-4 rounded-full border-2 border-white ring-4 ring-green-100"></div>
                <p className="text-sm font-bold text-gray-900">Contract Signed</p>
                <p className="text-xs text-gray-500 mt-1">Oct 14, 2025 • 04:15 PM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] bg-[#0B2E6F] w-4 h-4 rounded-full border-2 border-white ring-4 ring-blue-100"></div>
                <p className="text-sm font-bold text-gray-900">Milestone 1 Released</p>
                <p className="text-xs text-gray-500 mt-1">Oct 15, 2025 • 11:00 AM</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[31px] bg-gray-300 w-4 h-4 rounded-full border-2 border-white"></div>
                <p className="text-sm font-medium text-gray-400">Milestone 2 Pending</p>
                <p className="text-xs text-gray-400 mt-1">Estimated: Nov 01, 2025</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
             <div className="flex items-start gap-3">
               <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
               <div>
                 <h4 className="font-bold text-amber-800 text-sm">Escrow Protection Active</h4>
                 <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                   Funds are held securely. Both parties must approve milestone completion before funds are released.
                 </p>
               </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}

