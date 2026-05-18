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
        "bg-white text-black p-4 sm:p-6 font-code text-[10px] sm:text-[11px] leading-tight sm:leading-relaxed shadow-sm mx-auto print:shadow-none transition-all duration-300",
        paperWidth === '58mm' ? "w-[58mm]" : "w-[80mm]",
        className
      )}
      style={{ minHeight: '100px' }}
    >
      <div className="text-center mb-4 sm:mb-6 space-y-1">
        <h1 className="text-[11px] sm:text-[12px] font-bold leading-tight uppercase">Ministry of Blue Economy and Fisheries</h1>
        <div className="pt-2">
          <p className="uppercase font-bold text-[12px] sm:text-[13px] tracking-widest border-y border-black py-1">Government Bill</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-4 sm:mb-6 pb-4">
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">BillItem :</span>
          <span className="break-words">{receipt.billItem}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Payer name :</span>
          <span>{receipt.customerName}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Payer phone :</span>
          <span>{receipt.customerPhone}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Amount :</span>
          <span className="text-[12px] font-bold">TZS {formattedAmountValue}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Pay option :</span>
          <span>{receipt.paymentOption}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Expire Date :</span>
          <span className="flex flex-col">
             <span>{receipt.expiryDate.split(' ')[0]}</span>
             <span>{receipt.expiryDate.split(' ')[1]}</span>
          </span>
        </div>
        <div className="flex gap-2 pt-1">
          <span className="shrink-0 font-bold">ControlNumber :</span>
          <span className="text-[12px] font-bold">{receipt.controlNumber}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6 pt-4 border-t border-black border-dashed">
        <p className="leading-tight text-left">
          Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa kuchagua "Malipo ya Serikali")
        </p>
        <p className="leading-tight">
          Piga namba 0777350786 kwa maelezo Zaidi.
        </p>
      </div>

      <div className="space-y-2 mb-6 pt-4 border-t border-black border-dashed">
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">POS center :</span>
          <span className="uppercase">{receipt.posCenterName} (CHABAMCA)</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Printed on :</span>
          <span className="flex flex-col">
             <span>{receipt.printedAt.split(' ')[0]}</span>
             <span>{receipt.printedAt.split(' ')[1]}</span>
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-bold">Printed By :</span>
          <span>{receipt.printedBy}</span>
        </div>
      </div>
      
      {receipt.notes && (
        <div className="mt-4 pt-4 border-t border-black border-dotted">
          <p className="text-[9px] sm:text-[10px] italic leading-tight text-center">
            Note: {receipt.notes}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-2 opacity-20">
        <div className="w-12 h-12 border border-black flex items-center justify-center">
           <span className="text-[6px] text-center">QR</span>
        </div>
      </div>
    </div>
  );
};
