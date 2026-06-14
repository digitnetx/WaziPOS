
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
  // Format amount with comma as in image: 49,998
  const formattedAmountValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
        "bg-white text-black p-4 sm:p-5 font-sans text-[11px] leading-[1.3] shadow-sm mx-auto print:shadow-none transition-all duration-300",
        paperWidth === '58mm' ? "w-[58mm]" : "w-[80mm]",
        className
      )}
      style={{ minHeight: '100px', letterSpacing: '-0.01em' }}
    >
      {/* Header section */}
      <div className="text-center mb-6 space-y-0.5">
        <p className="text-[10px] leading-tight">Ministry of Blue Economy and</p>
        <p className="text-[10px] leading-tight">Fisheries</p>
        <div className="pt-1.5">
          <p className="font-bold text-[13px] tracking-tight">Government Bill</p>
        </div>
      </div>

      {/* Main details section */}
      <div className="space-y-1 mb-4">
        <div className="flex flex-wrap">
          <span className="mr-1">BillItem :</span>
          <span className="font-bold uppercase">{receipt.billItem}</span>
        </div>
        
        <div className="flex flex-wrap">
          <span className="mr-1">Payer name :</span>
          <span className="font-bold">{receipt.customerName}</span>
        </div>
        
        <div className="flex flex-wrap">
          <span className="mr-1">Payer phone :</span>
          <span className="font-bold">{receipt.customerPhone}</span>
        </div>
        
        <div className="flex flex-wrap">
          <span className="mr-1">Amount :</span>
          <span className="font-bold">TZS {formattedAmountValue}</span>
        </div>
        
        <div className="flex flex-wrap">
          <span className="mr-1">Pay option :</span>
          <span className="font-bold">{receipt.paymentOption}</span>
        </div>
        
        <div className="flex flex-wrap">
          <span className="mr-1">Expire Date :</span>
          <span className="font-bold">{expiryDay} {cleanExpiryTime}</span>
        </div>
        
        <div className="inline">
          <span className="mr-1">ControlNumber :</span>
          <span className="font-bold">{receipt.controlNumber}</span>
          <span className="ml-1 text-[10px] leading-[1.1]">
            Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa kuchagua "Malipo ya Serikali") Piga namba 0777350786 kwa maelezo Zaidi.
          </span>
        </div>
      </div>

      {/* Footer section */}
      <div className="space-y-1 mt-6 text-[10px]">
        <div className="flex flex-wrap">
          <span className="mr-1">POS center :</span>
          <span className="uppercase font-medium">{receipt.posCenterName}</span>
        </div>
        
        <div className="flex flex-wrap">
          <span className="mr-1">Printed on :</span>
          <span className="font-medium">{isoPrintDate}</span>
        </div>
        
        <div className="flex flex-wrap">
          <span className="mr-1">Printed By :</span>
          <span className="font-medium">{receipt.printedBy}</span>
        </div>
      </div>
      
      {/* Optional notes section */}
      {receipt.notes && (
        <div className="mt-4 pt-2 border-t border-black border-dotted">
          <p className="text-[9px] italic leading-tight">
            Note: {receipt.notes}
          </p>
        </div>
      )}

      {/* Extra space for printer tear-off */}
      <div className="h-12"></div>
    </div>
  );
};
