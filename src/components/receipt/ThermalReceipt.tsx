
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
  // Exact currency formatting for the thermal look: TZS 10,000
  const formattedAmountValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(receipt.amount);

  // Exact date formatting: 2026-06-28 111955
  const [expiryDay, expiryTime] = (receipt.expiryDate || "").split(' ');
  const cleanExpiryTime = expiryTime ? expiryTime.replace(/:/g, '') : '';
  
  // Exact print date: 2026-05-29T11:20:03
  const [printDay, printTime] = (receipt.printedAt || "").split(' ');
  const isoPrintDate = `${printDay}T${printTime}`;

  // Replicating the exact wrapping and tight spacing from the provided image
  const receiptContent = `BillItem : Entrance fees per day/person
(TZS)

Payer name : ${receipt.customerName}
Payer phone : ${receipt.customerPhone}
Amount : TZS ${formattedAmountValue}
Pay option : ${receipt.paymentOption}
Expire Date : ${expiryDay} ${cleanExpiryTime}
ControlNumber : ${receipt.controlNumber}
Lipa kupitia Benki (NMB/BOT/PBZ) na M
awakala wake au Mitandao ya Simu (kwa
kuchagua "Malipo ya Serikali")
Piga namba 0777350786 kwa maelezo Z
aidi.

POS center : CHANGU BAWE MINERAL C
ONSERVATION AREA (CHABAMCA)
Printed on : ${isoPrintDate}
Printed By : ${receipt.printedBy}`;

  return (
    <div 
      id={id}
      data-paper-size={paperWidth}
      className={cn(
        "bg-white text-black p-0 mx-auto transition-all duration-300",
        paperWidth === '58mm' ? "w-[58mm]" : "w-[80mm]",
        className
      )}
      style={{ 
        fontFamily: 'monospace',
        fontSize: '11px',
        lineHeight: '1.3',
        color: '#000',
        textAlign: 'left',
        padding: '8mm 4mm',
        minHeight: 'auto',
        border: 'none',
        boxShadow: 'none',
        wordBreak: 'break-all'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '6mm' }}>
        <div style={{ marginBottom: '2mm', fontSize: '11px' }}>Ministry of Blue Economy and Fisheries</div>
        <div style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '4mm' }}>Government Bill</div>
      </div>

      {/* Body */}
      <div style={{ whiteSpace: 'pre-wrap', color: '#000', fontWeight: '500' }}>
        {receiptContent}
      </div>

      {/* Extra space for printer tear-off */}
      <div style={{ height: '20mm' }}></div>
    </div>
  );
};
