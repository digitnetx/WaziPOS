
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

  return (
    <div 
      id={id}
      data-paper-size={paperWidth}
      className={cn(
        "bg-white text-black p-6 font-code text-[11px] leading-relaxed shadow-sm mx-auto print:shadow-none transition-all duration-300",
        paperWidth === '58mm' ? "w-[58mm]" : "w-[80mm]",
        className
      )}
      style={{ minHeight: '100px' }}
    >
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-[12px] font-bold leading-tight">Ministry of Blue Economy and Fisheries</h1>
        <p className="mt-4 uppercase font-bold text-[13px] tracking-wider">Government Bill</p>
      </div>

      <div className="space-y-2 mb-6 border-b border-black border-dashed pb-4">
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">BillItem:</span>
          <span className="break-words">{receipt.billItem}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Payer name:</span>
          <span>{receipt.customerName}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Payer phone:</span>
          <span>{receipt.customerPhone}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Amount:</span>
          <span className="text-[12px] font-bold">TZS {formattedAmountValue}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Pay option:</span>
          <span>{receipt.paymentOption}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Expire Date:</span>
          <span>{receipt.expiryDate}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">ControlNumber:</span>
          <span className="text-[12px] font-bold bg-black text-white px-1">{receipt.controlNumber}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <p className="leading-tight text-center italic">
          Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa kuchagua "Malipo ya Serikali")
        </p>
        <div className="flex flex-col items-center gap-1 border-t border-black border-dotted pt-2">
          <p className="font-bold">Contact Support:</p>
          <p className="text-[12px]">0777350786</p>
        </div>
      </div>

      <div className="space-y-1.5 opacity-90 text-[10px] border-t border-black pt-4">
        <div className="flex justify-between">
          <span className="font-bold">POS Center:</span>
          <span className="uppercase">{receipt.posCenterName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Printed:</span>
          <span>{receipt.printedAt}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Staff:</span>
          <span>{receipt.printedBy}</span>
        </div>
        <div className="flex justify-between font-mono text-[9px] mt-2 opacity-50">
          <span>TXN ID:</span>
          <span>{receipt.transactionId}</span>
        </div>
      </div>
      
      {receipt.notes && (
        <div className="mt-4 pt-4 border-t border-black border-dashed">
          <p className="text-[10px] italic leading-tight text-center">
            "{receipt.notes}"
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-muted flex items-center justify-center border border-black/10 rounded-sm">
           <span className="text-[8px] text-black/20 text-center">QR CODE<br/>PLACEHOLDER</span>
        </div>
        <p className="text-[8px] uppercase tracking-widest opacity-30">Authentic Government Receipt</p>
      </div>
    </div>
  );
};
