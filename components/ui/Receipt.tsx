'use client'

import React from 'react'
import { Receipt as ReceiptType } from '@/types/api'
import { FiCheck, FiDownload, FiPrinter } from 'react-icons/fi'

interface ReceiptProps {
  receipt: ReceiptType
  onDownload?: () => void
  onPrint?: () => void
  showActions?: boolean
  className?: string
}

export default function Receipt({ 
  receipt, 
  onDownload, 
  onPrint, 
  showActions = true,
  className = '' 
}: ReceiptProps) {
  const formatCurrency = (amount: number) => {
    return `N${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const formatPaidDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-GB', { month: 'long' })
    const year = date.getFullYear()
    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`
  }

  return (
    <div 
      className={`bg-white w-full max-w-4xl mx-auto ${className}`}
      style={{
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.4'
      }}
    >
      {/* Header Section - PIXEL PERFECT */}
      <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          {/* Company Logo and Name - Top Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 'bold', 
                color: '#1e3a8a',
                margin: '0',
                lineHeight: '1.2'
              }}>
                {receipt.companyName}
              </h1>
              {receipt.companyTagline && (
                <p style={{ 
                  fontSize: '14px', 
                  color: '#6b7280', 
                  margin: '4px 0 0 0',
                  lineHeight: '1.3'
                }}>
                  {receipt.companyTagline}
                </p>
              )}
            </div>
            {receipt.companyLogo && (
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={receipt.companyLogo} 
                  alt={receipt.companyName}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </div>

          {/* Receipt Number and Status - Top Right */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FiCheck style={{ width: '20px', height: '20px', color: '#16a34a' }} />
              <span style={{ color: '#16a34a', fontWeight: '500', fontSize: '16px' }}>Paid</span>
              <span style={{ color: '#374151', fontSize: '16px' }}>Receipt No #{receipt.receiptNumber}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheck style={{ width: '20px', height: '20px', color: '#16a34a' }} />
              <span style={{ color: '#16a34a', fontSize: '16px' }}>
                Invoice Paid on {formatPaidDate(receipt.paidDate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Section - PIXEL PERFECT */}
      <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>
          {/* Left Side - Issued On, From */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                margin: '0 0 4px 0' 
              }}>
                Issued On
              </p>
              <p style={{ 
                color: '#111827', 
                fontSize: '16px',
                margin: '0'
              }}>
                {formatDate(receipt.issuedDate)}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                margin: '0 0 4px 0' 
              }}>
                From
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {receipt.companyLogo && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={receipt.companyLogo} 
                      alt={receipt.companyName}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                <div>
                  <p style={{ 
                    fontWeight: '500', 
                    color: '#111827', 
                    fontSize: '16px',
                    margin: '0'
                  }}>
                    {receipt.companyName}
                  </p>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#2563eb', 
                    fontStyle: 'italic',
                    margin: '0'
                  }}>
                    {receipt.companyEmail}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Paid On, To */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                margin: '0 0 4px 0' 
              }}>
                Paid On
              </p>
              <p style={{ 
                color: '#111827', 
                fontSize: '16px',
                margin: '0'
              }}>
                {formatShortDate(receipt.paidDate)}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                margin: '0 0 4px 0' 
              }}>
                To
              </p>
              <div>
                <p style={{ 
                  fontWeight: '500', 
                  color: '#111827', 
                  fontSize: '16px',
                  margin: '0'
                }}>
                  {receipt.clientName}
                </p>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#2563eb', 
                  fontStyle: 'italic',
                  margin: '0'
                }}>
                  {receipt.clientEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table - PIXEL PERFECT */}
      <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1e3a8a', color: 'white' }}>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'left', 
                  fontWeight: '500',
                  fontSize: '16px',
                  border: 'none'
                }}>
                  Description
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'center', 
                  fontWeight: '500',
                  fontSize: '16px',
                  border: 'none'
                }}>
                  Qty
                </th>
                <th style={{ 
                  padding: '16px', 
                  textAlign: 'right', 
                  fontWeight: '500',
                  fontSize: '16px',
                  border: 'none'
                }}>
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    borderBottom: index < receipt.items.length - 1 ? '1px solid #e5e7eb' : 'none'
                  }}
                >
                  <td style={{ 
                    padding: '16px', 
                    color: '#111827',
                    fontSize: '16px'
                  }}>
                    {item.description}
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'center', 
                    color: '#111827',
                    fontSize: '16px'
                  }}>
                    {item.quantity === '-' ? '-' : item.quantity}
                  </td>
                  <td style={{ 
                    padding: '16px', 
                    textAlign: 'right', 
                    color: '#111827',
                    fontSize: '16px'
                  }}>
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section - PIXEL PERFECT */}
      <div style={{ padding: '32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '384px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#374151', fontSize: '16px' }}>Subtotal</span>
            <span style={{ color: '#111827', fontWeight: '500', fontSize: '16px' }}>
              {formatCurrency(receipt.subtotal)}
            </span>
          </div>
          {receipt.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#374151', fontSize: '16px' }}>
                Discount {receipt.discountPercentage ? `- ${receipt.discountPercentage}%` : ''}
              </span>
              <span style={{ color: '#111827', fontWeight: '500', fontSize: '16px' }}>
                {formatCurrency(receipt.discount)}
              </span>
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '8px',
            borderTop: '1px solid #e5e7eb',
            marginTop: '4px'
          }}>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1e3a8a' 
            }}>
              Total Amount
            </span>
            <span style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1e3a8a' 
            }}>
              {formatCurrency(receipt.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer - PIXEL PERFECT */}
      <div style={{ 
        padding: '32px', 
        backgroundColor: '#dbeafe',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#9ca3af',
          textAlign: 'center',
          margin: '0',
          width: '100%'
        }}>
          Thanks for your patronage
        </p>
        {showActions && (
          <div style={{ display: 'flex', gap: '12px', marginLeft: '16px' }}>
            {onDownload && (
              <button
                onClick={onDownload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                <FiDownload style={{ width: '16px', height: '16px' }} />
                <span>Download</span>
              </button>
            )}
            {onPrint && (
              <button
                onClick={onPrint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#4b5563',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
              >
                <FiPrinter style={{ width: '16px', height: '16px' }} />
                <span>Print</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
