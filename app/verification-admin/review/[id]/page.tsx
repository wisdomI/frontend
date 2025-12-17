'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, X, UploadCloud, Trash2 } from 'lucide-react'
import { FiCheck } from 'react-icons/fi'

// Mock Data
const vendors = [
  { 
    id: 1, 
    name: 'Royal Events Ltd', 
    reg: 'RC123456',
    category: 'Rentals',
    location: 'Ajah, Lagos',
    docs: [
      { name: 'Business License/CAC Certificate', status: 'Uploaded' },
      { name: 'Upload Proof of Address (Utility Bill/Bank Statement)', status: 'Uploaded' },
      { name: 'Upload Valid Govt. Issued IDs (Passport/Driver\'s License)', status: 'Uploaded' },
      { name: 'Professional Certificate 1 (e.g., CMP, CSEP).jpeg', size: '854kb', status: 'Uploaded', hasDelete: true },
      { name: 'Professional Certificate 2 (e.g., CMP, CSEP).jpeg', status: 'Uploaded' },
    ]
  },
  { 
    id: 2, 
    name: 'UK Cakes & Cream', 
    reg: 'RC123456',
    category: 'Catering',
    location: 'Lekki, Lagos',
    docs: [
      { name: 'Business License/CAC Certificate', status: 'Uploaded' },
    ]
  },
]

export default function VerificationReviewPage() {
  const params = useParams()
  const router = useRouter()
  // Handle both string and array for id
  const idStr = Array.isArray(params.id) ? params.id[0] : params.id
  const id = Number(idStr)
  
  const vendor = vendors.find(v => v.id === id) || vendors[0]

  const [modalState, setModalState] = useState<'none' | 'approve' | 'flag' | 'reject-mail' | 'reject-success'>('none')

  const handleApprove = () => setModalState('approve')
  const handleFlag = () => setModalState('flag')
  const handleReject = () => setModalState('reject-mail')
  
  const sendRejectionMail = () => {
    setModalState('reject-success')
  }

  const closeModal = () => {
    const currentState = modalState
    setModalState('none')
    if (currentState === 'approve' || currentState === 'flag' || currentState === 'reject-success') {
      router.push('/verification-admin')
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <Link href="/verification-admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to queue
      </Link>

      <h1 className="text-2xl font-bold font-asul text-gray-900">{vendor.name}</h1>

      {/* Documents Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Business Verification Documents - <span className="font-normal text-gray-500 text-sm">(JPEG, PNG, PDF up to 5MB)</span>
        </h2>
        <div className="space-y-3">
          {vendor.docs.map((doc, idx) => (
             <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border border-dashed border-cyan-200 gap-4">
               <div className="flex items-center gap-2 flex-1">
                 <span className="text-sm text-gray-700 break-all">{doc.name} {doc.size && <span className="text-gray-400">Size: {doc.size}</span>}</span>
                 {doc.hasDelete && <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />}
               </div>
               <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                 <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                   <UploadCloud className="w-3 h-3 mr-2" /> {doc.status}
                 </span>
                 <button className="text-sm font-bold text-gray-900 hover:underline">Download</button>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-4 pt-6">
         <h2 className="text-lg font-semibold text-gray-800">Business Information</h2>
         <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
            <p className="text-gray-900"><span className="font-bold mr-2">Business Name:</span> {vendor.name}</p>
            <p className="text-gray-900"><span className="font-bold mr-2">Registration:</span> {vendor.reg}</p>
            <p className="text-gray-900"><span className="font-bold mr-2">Category:</span> {vendor.category}</p>
            <p className="text-gray-900"><span className="font-bold mr-2">Location:</span> {vendor.location}</p>
         </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-8">
        <button onClick={handleApprove} className="bg-[#41A654] text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 min-w-[120px]">Approve</button>
        <button onClick={handleReject} className="bg-[#EF4444] text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 min-w-[120px]">Reject & Send Mail</button>
        <button onClick={handleFlag} className="bg-[#F59E0B] text-white px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 min-w-[120px]">Flag to Super Admin</button>
      </div>

      {/* Modals */}
      {modalState !== 'none' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
           
           {/* Success/Flag Modal Template */}
           {(modalState === 'approve' || modalState === 'flag' || modalState === 'reject-success') && (
             <div className="bg-white rounded-3xl p-8 w-full max-w-md flex flex-col items-center text-center relative shadow-xl">
               <button onClick={closeModal} className="absolute top-4 right-4 text-white bg-[#0B2E6F] rounded-md p-1 hover:bg-blue-900">
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
                 {modalState === 'approve' && 'Verification Approved Successfully'}
                 {modalState === 'flag' && 'Vendor has been flagged successfully'}
                 {modalState === 'reject-success' && 'Vendor rejection mail sent successfully'}
               </h2>
               
               <p className="text-gray-600 mb-8">
                 {modalState === 'approve' && 'You have sucessfully approved this vendor'}
                 {modalState === 'flag' && 'You have successfully flagged vendor to Super Admin'}
                 {modalState === 'reject-success' && 'You have successfully sent rejection mail to vendor'}
               </p>

               <button 
                 onClick={closeModal}
                 className="w-full bg-[#0B2E6F] text-white py-3 rounded-lg font-bold hover:bg-[#09255a] transition-colors"
               >
                 Done
               </button>
             </div>
           )}

           {/* Reject Mail Modal */}
           {modalState === 'reject-mail' && (
             <div className="bg-white rounded-xl p-0 w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">✉️</span> 
                    <span className="font-semibold">Vendor Rejection Mail</span>
                  </div>
                  {/* No close button in header in design, but good UX to have maybe? Design has Cancel button at bottom */}
               </div>
               
               <div className="p-8 overflow-y-auto bg-[#FAFAFA] flex-1">
                 <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 max-w-lg mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-[#0B2E6F]">Event<span className="text-[#0B2E6F]">hub</span></h3>
                    </div>
                    
                    <div className="space-y-6 text-gray-600 text-sm">
                      <p>Hello {vendor.name},</p>
                      <p>Thank you for your interest in joining Event Hub as a Vendor.</p>
                      
                      <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <p className="font-bold text-gray-800 mb-2">Verification Status: Not Approved</p>
                        <p className="mb-2">We could not verify your documents. This may be due to:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Incomplete documentation</li>
                          <li>Unclear documents</li>
                          <li>Missing certifications</li>
                        </ul>
                      </div>
                      
                      <p>You can re-submit your documents for review.</p>
                      
                      <div className="text-center pt-4">
                        <button className="bg-[#0B2E6F] text-white px-6 py-2 rounded-md font-medium text-sm">
                          Re-upload Documents
                        </button>
                      </div>
                      
                      <div className="pt-8 text-xs text-gray-400 border-t border-gray-100 mt-8">
                        © 2025 Event Hub. All rights reserved.
                      </div>
                    </div>
                 </div>
               </div>

               <div className="p-6 border-t border-gray-100 bg-white flex justify-center gap-4">
                 <button 
                   onClick={sendRejectionMail}
                   className="bg-[#0B2E6F] text-white px-12 py-3 rounded-lg font-medium hover:bg-[#09255a]"
                 >
                   Send Mail
                 </button>
                 <button 
                   onClick={() => setModalState('none')}
                   className="bg-white text-[#0B2E6F] border border-[#0B2E6F] px-12 py-3 rounded-lg font-medium hover:bg-gray-50"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           )}

        </div>
      )}
    </div>
  )
}

