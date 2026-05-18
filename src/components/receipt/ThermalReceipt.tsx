
"use client";

import React from 'react';
import { Receipt } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ThermalReceiptProps {
  receipt: Receipt;
  className?: string;
  id?: string;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ receipt, className, id }) => {
  // Format currency without the 'TZS' symbol inside the numeric part to match image
  const formattedAmountValue = new Intl.NumberFormat('en-TZ', {
    minimumFractionDigits: 0,
  }).format(receipt.amount);

  return (
    <div 
      id={id}
      className={cn(
        "bg-white text-black p-4 font-code text-[11px] leading-relaxed w-[58mm] mx-auto shadow-md print:shadow-none print:w-full",
        className
      )}
    >
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-[12px]">Ministry of Blue Economy and Fisheries</h1>
        <p className="mt-4">Government Bill</p>
      </div>

      <div className="space-y-1.5 mb-6">
        <div className="flex gap-1">
          <span className="shrink-0">BillItem : ;</span>
          <span className="break-words">{receipt.billItem}</span>
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
          <span>{receipt.expiryDate}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">ControlNumber :</span>
          <span>{receipt.controlNumber}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="leading-tight">
          Lipa kupitia Benki (NMB/BOT/PBZ) na M awakala wake au Mitandao ya Simu (kwa kuchagua "Malipo ya Serikali")
        </p>
        <p>
          Piga namba 0777350786 kwa maelezo Zaidi.
        </p>
      </div>

      <div className="space-y-1.5 opacity-90">
        <div className="flex gap-1">
          <span className="shrink-0">POS center :</span>
          <span className="break-words uppercase">{receipt.posCenterName} (CHABAMCA)</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed on :</span>
          <span>{receipt.printedAt}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed By :</span>
          <span>{receipt.printedBy}</span>
        </div>
      </div>
      
      {receipt.notes && (
        <div className="mt-4 pt-4 border-t border-black border-dashed">
          <p className="text-[10px] italic text-center leading-tight">
            Note: {receipt.notes}
          </p>
        </div>
      )}
    </div>
  );
};
