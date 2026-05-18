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
  const formattedAmountValue = new Intl.NumberFormat('en-TZ', {
    minimumFractionDigits: 0,
  }).format(receipt.amount);

  // Parse dates for specific formatting
  // Expire Date: 2025-02-10 152630 (HHmmss)
  // Printed on: 2026-05-16T11:59:07 (ISO)
  const [expiryDay, expiryTime] = receipt.expiryDate.split(' ');
  const cleanExpiryTime = expiryTime ? expiryTime.replace(/:/g, '') : '';
  
  const [printDay, printTime] = receipt.printedAt.split(' ');
  const isoPrintDate = `${printDay}T${printTime}`;

  return (
    <div 
      id={id}
      data-paper-size={paperWidth}
      className={cn(
        "bg-white text-black p-4 sm:p-6 font-code text-[11px] leading-relaxed shadow-sm mx-auto print:shadow-none transition-all duration-300",
        paperWidth === '58mm' ? "w-[58mm]" : "w-[80mm]",
        className
      )}
      style={{ minHeight: '100px', letterSpacing: '-0.02em' }}
    >
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-[12px] leading-tight">Ministry of Blue Economy and Fisheries</h1>
        <div className="pt-2">
          <p className="font-bold text-[14px] tracking-tight">Government Bill</p>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <div className="flex gap-1">
          <span className="shrink-0">BillItem : ;</span>
          <span className="break-words">Entrance Fees per day/person (TZS)</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Payer name :</span>
          <span>{receipt.customerName}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Payer phone :</span>
          <span>{receipt.customerPhone}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Amount :</span>
          <span>TZS {formattedAmountValue}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Pay option :</span>
          <span>{receipt.paymentOption}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Expire Date :</span>
          <span>{expiryDay} {cleanExpiryTime}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">ControlNumber :</span>
          <span className="font-bold">{receipt.controlNumber}</span>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <p className="leading-tight">
          Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa kuchagua "Malipo ya Serikali")
        </p>
        <p className="leading-tight">
          Piga namba 0777350786 kwa maelezo Zaidi.
        </p>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex gap-1">
          <span className="shrink-0">POS center :</span>
          <span className="uppercase">{receipt.posCenterName} (CHABAMCA)</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed on :</span>
          <span>{isoPrintDate}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed By :</span>
          <span>{receipt.printedBy}</span>
        </div>
      </div>
      
      {receipt.notes && (
        <div className="mt-4 pt-4 border-t border-black border-dotted">
          <p className="text-[10px] italic leading-tight">
            Note: {receipt.notes}
          </p>
        </div>
      )}

      {/* Hidden QR spacer for layout fidelity */}
      <div className="h-10"></div>
    </div>
  );
};
