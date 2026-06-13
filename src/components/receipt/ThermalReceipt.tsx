
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

  // Parse dates for specific formatting from the image
  // Expire Date: 2026-06-16 085244 (YYYY-MM-DD HHMMSS)
  const [expiryDay, expiryTime] = receipt.expiryDate.split(' ');
  const cleanExpiryTime = expiryTime ? expiryTime.replace(/:/g, '') : '';
  
  // Printed on: 2026-06-09T08:52:51
  const [printDay, printTime] = receipt.printedAt.split(' ');
  const isoPrintDate = `${printDay}T${printTime}`;

  return (
    <div 
      id={id}
      data-paper-size={paperWidth}
      className={cn(
        "bg-white text-black p-4 sm:p-5 font-sans text-[11px] leading-[1.3] shadow-sm mx-auto print:shadow-none transition-all duration-300",
        paperWidth === '58mm' ? "w-[58mm]" : "w-[80mm]",
        className
      )}
      style={{ minHeight: '100px', letterSpacing: '-0.01em' }}
    >
      <div className="text-center mb-5 space-y-1.5">
        <h1 className="text-[12px] font-bold leading-tight uppercase">Zanzibar Commission for Tourism</h1>
        <div className="pt-1">
          <p className="font-bold text-[13px] tracking-tight">Government Bill</p>
        </div>
      </div>

      <div className="space-y-0.5 mb-5">
        <div className="flex gap-1">
          <span className="shrink-0">BillItem :</span>
          <span className="break-words font-medium">{receipt.billItem}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Payer name :</span>
          <span className="font-medium">{receipt.customerName}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Payer phone :</span>
          <span className="font-medium">{receipt.customerPhone}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Amount :</span>
          <span className="font-medium">TZS {formattedAmountValue}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Pay option :</span>
          <span className="font-medium">{receipt.paymentOption}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Expire Date :</span>
          <span className="font-medium">{expiryDay} {cleanExpiryTime}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">ControlNumber :</span>
          <span className="font-bold">{receipt.controlNumber}</span>
        </div>
      </div>

      <div className="space-y-1 mb-5 text-[10.5px]">
        <p className="leading-tight">
          Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa kuchagua "Malipo ya Serikali")
        </p>
        <p className="leading-tight">
          Piga namba 0776188344 kwa maelezo Zaidi.
        </p>
      </div>

      <div className="space-y-0.5 mb-4 text-[10.5px]">
        <div className="flex gap-1">
          <span className="shrink-0">POS center :</span>
          <span className="capitalize">{receipt.posCenterName}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed on :</span>
          <span>{isoPrintDate}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed By :</span>
          <span className="lowercase">{receipt.printedBy}</span>
        </div>
      </div>
      
      {receipt.notes && (
        <div className="mt-3 pt-3 border-t border-black border-dotted">
          <p className="text-[10px] italic leading-tight">
            Note: {receipt.notes}
          </p>
        </div>
      )}

      {/* Spacer for bottom margin/tear line */}
      <div className="h-6"></div>
    </div>
  );
};
