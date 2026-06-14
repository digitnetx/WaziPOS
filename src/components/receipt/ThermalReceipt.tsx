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
  // Format amount with comma as in image
  const formattedAmountValue = new Intl.NumberFormat('en-TZ', {
    minimumFractionDigits: 0,
  }).format(receipt.amount);

  // Parse dates for specific formatting from the image
  // Expire Date: 2026-06-15 000319 (YYYY-MM-DD HHMMSS)
  const [expiryDay, expiryTime] = receipt.expiryDate.split(' ');
  const cleanExpiryTime = expiryTime ? expiryTime.replace(/:/g, '') : '';
  
  // Printed on: 2026-06-15T00:03:19
  const [printDay, printTime] = receipt.printedAt.split(' ');
  const isoPrintDate = `${printDay}T${printTime}`;

  return (
    <div 
      id={id}
      data-paper-size={paperWidth}
      className={cn(
        "bg-white text-black p-4 sm:p-5 font-sans text-[11px] leading-[1.2] shadow-sm mx-auto print:shadow-none transition-all duration-300",
        paperWidth === '58mm' ? "w-[58mm]" : "w-[80mm]",
        className
      )}
      style={{ minHeight: '100px', letterSpacing: '-0.01em' }}
    >
      <div className="text-center mb-4 space-y-0">
        <p className="text-[11.5px] leading-tight">Ministry of Blue Economy and</p>
        <p className="text-[11.5px] leading-tight">Fisheries</p>
        <div className="pt-1">
          <p className="font-bold text-[14px] tracking-tight">Government Bill</p>
        </div>
      </div>

      <div className="space-y-[1px] mb-0">
        <div className="flex gap-1">
          <span className="shrink-0">BillItem :</span>
          <span className="font-bold">{receipt.billItem}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Payer name :</span>
          <span className="font-bold">{receipt.customerName}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Payer phone :</span>
          <span className="font-bold">{receipt.customerPhone}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Amount :</span>
          <span className="font-bold">TZS {formattedAmountValue}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Pay option :</span>
          <span className="font-bold">{receipt.paymentOption}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Expire Date :</span>
          <span className="font-bold">{expiryDay} {cleanExpiryTime}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">ControlNumber :</span>
          <span className="font-bold">{receipt.controlNumber}</span>
        </div>
        
        <div className="pt-0 text-[10px] leading-[1.15]">
          <p>
            Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa kuchagua "Malipo ya Serikali")
          </p>
          <p>
            Piga namba 0777350786 kwa maelezo Zaidi.
          </p>
        </div>
      </div>

      <div className="space-y-[1px] mt-6 text-[10px]">
        <div className="flex gap-1">
          <span className="shrink-0">POS center :</span>
          <span className="uppercase">{receipt.posCenterName}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed on :</span>
          <span>{isoPrintDate}</span>
        </div>
        <div className="flex gap-1">
          <span className="shrink-0">Printed By :</span>
          <span className="capitalize">{receipt.printedBy}</span>
        </div>
      </div>
      
      {receipt.notes && (
        <div className="mt-4 pt-2 border-t border-black border-dotted">
          <p className="text-[9.5px] italic leading-tight">
            Note: {receipt.notes}
          </p>
        </div>
      )}

      <div className="h-8"></div>
    </div>
  );
};