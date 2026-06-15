
"use client";

import React from 'react';
import { Receipt } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ThermalReceiptProps {
  receipt: Receipt;
  className?: string;
  id?: string;
  paperWidth?: '58mm' | '80mm';
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ 
  receipt, 
  className, 
  id,
  paperWidth = '58mm' 
}) => {
  // Format values for thermal consistency
  const formattedAmount = `TZS ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(receipt.amount)}`;

  const [expiryDay, expiryTime] = (receipt.expiryDate || "").split(' ');
  const cleanExpiryTime = expiryTime ? expiryTime.replace(/:/g, '') : '';
  const formattedExpireDate = `${expiryDay} ${cleanExpiryTime}`;
  
  const [printDay, printTime] = (receipt.printedAt || "").split(' ');
  const isoPrintDate = `${printDay}T${printTime}`;

  // Container styling to replicate physical paper
  const containerStyle: React.CSSProperties = {
    width: paperWidth === '58mm' ? '58mm' : '80mm',
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '14px',
    lineHeight: '1.45',
    padding: '35px 15px 60px 15px',
    boxSizing: 'border-box',
    textAlign: 'left',
    margin: '0 auto',
  };

  return (
    <div id={id} style={containerStyle} className={className}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <div style={{ fontSize: '14px', fontWeight: 400 }}>
          Ministry of Blue Economy and<br />Fisheries
        </div>
        <div style={{ fontSize: '17px', fontWeight: 700, marginTop: '20px' }}>
          Government Bill
        </div>
      </div>

      {/* Body Section */}
      <div style={{ whiteSpace: 'pre-wrap' }}>
        <div style={{ marginBottom: '10px' }}>
          BillItem : <span style={{ fontWeight: 700 }}>{receipt.billItem}</span><br />
          <span style={{ fontWeight: 700 }}>           (TZS)</span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          Payer name : {receipt.customerName}<br />
          Payer phone : {receipt.customerPhone}
        </div>

        <div style={{ marginBottom: '10px' }}>
          Amount : <span style={{ fontWeight: 700 }}>{formattedAmount}</span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          Pay option : <span style={{ fontWeight: 700 }}>{receipt.paymentOption}</span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          Expire Date : <span style={{ fontWeight: 700 }}>{formattedExpireDate}</span>
        </div>

        <div style={{ marginBottom: '0px' }}>
          ControlNumber : <span style={{ fontWeight: 700 }}>{receipt.controlNumber}</span>
        </div>
      </div>

      {/* Instructions Section - Tightly packed to ControlNumber */}
      <div style={{ fontSize: '13px', lineHeight: '1.35', whiteSpace: 'pre-wrap' }}>
        Lipa kupitia Benki (NMB/BOT/PBZ) na<br />
        Mawakala wake au Mitandao ya Simu<br />
        (kwa kuchagua "Malipo ya Serikali")<br />
        Piga namba 0777350786 kwa maelezo<br />
        Zaidi.
      </div>

      {/* POS and Footer - Separated by blank lines as requested */}
      <div style={{ marginTop: '25px', whiteSpace: 'pre-wrap' }}>
        POS center : <br />
        <span style={{ fontWeight: 700 }}>{receipt.posCenterName}</span>
      </div>

      <div style={{ marginTop: '20px', fontSize: '13px' }}>
        Printed on : <br />
        {isoPrintDate}
      </div>

      <div style={{ marginTop: '10px', fontSize: '13px' }}>
        Printed By : <br />
        {receipt.printedBy}
      </div>
    </div>
  );
};
