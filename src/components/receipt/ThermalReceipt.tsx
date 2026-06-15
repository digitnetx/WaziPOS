
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
  // Exact currency formatting for the thermal look: TZS 49,998
  const formattedAmountValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(receipt.amount);

  // Exact date formatting: 2026-06-15 000319
  const [expiryDay, expiryTime] = (receipt.expiryDate || "").split(' ');
  const cleanExpiryTime = expiryTime ? expiryTime.replace(/:/g, '') : '';
  
  // Exact print date: 2026-06-15T00:03:19
  const [printDay, printTime] = (receipt.printedAt || "").split(' ');
  const isoPrintDate = `${printDay}T${printTime}`;

  // Using a template literal with white-space: pre-wrap to control every character and line break
  const receiptContent = `BillItem : Entrance fees per day/person
           (TZS)

Payer name : ${receipt.customerName}
Payer phone : ${receipt.customerPhone}

Amount : TZS ${formattedAmountValue}

Pay option : ${receipt.paymentOption}

Expire Date : ${expiryDay} ${cleanExpiryTime}

ControlNumber : ${receipt.controlNumber}
Lipa kupitia Benki (NMB/BOT/PBZ) na
Mawakala wake au Mitandao ya Simu
(kwa kuchagua "Malipo ya Serikali")
Piga namba 0777350786 kwa maelezo
Zaidi.


POS center : CHANGU BAWE MINERAL
             CONSERVATION AREA(CHABAMCA)


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
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '11px',
        lineHeight: '1.5',
        color: '#000',
        textAlign: 'left',
        padding: '10mm 4mm',
        minHeight: 'auto',
        border: 'none',
        boxShadow: 'none',
        wordBreak: 'break-all'
      }}
    >
      {/* Header - Centered exactly as in image */}
      <div style={{ textAlign: 'center', marginBottom: '8mm' }}>
        <div style={{ marginBottom: '4mm', textTransform: 'none' }}>Ministry of Blue Economy and Fisheries</div>
        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>Government Bill</div>
      </div>

      {/* Body - Pure text with white-space: pre-wrap */}
      <div style={{ whiteSpace: 'pre-wrap', color: '#000' }}>
        {receiptContent}
      </div>

      {/* Extra space for printer tear-off gap */}
      <div style={{ height: '25mm' }}></div>
    </div>
  );
};
