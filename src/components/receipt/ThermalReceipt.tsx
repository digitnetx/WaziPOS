
"use client";

import React from 'react';
import { Receipt } from '@/lib/types';
import { formatCurrency } from '@/app/lib/utils';

interface ThermalReceiptProps {
  receipt: Receipt;
  className?: string;
  id?: string;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ receipt, className, id }) => {
  return (
    <div 
      id={id}
      className={cn(
        "bg-white text-black p-4 font-code text-xs w-[58mm] mx-auto shadow-md print:shadow-none print:w-full",
        className
      )}
    >
      <div className="text-center mb-4 space-y-1">
        <h1 className="font-bold text-sm uppercase">Ministry of Blue Economy and Fisheries</h1>
        <p className="font-semibold border-b border-black border-dashed pb-1">Government Bill</p>
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span className="font-bold">Bill Item:</span>
          <span className="text-right">{receipt.billItem}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Payer Name:</span>
          <span>{receipt.customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Payer Phone:</span>
          <span>{receipt.customerPhone}</span>
        </div>
        <div className="flex justify-between border-t border-black border-dashed pt-1">
          <span className="font-bold">Amount:</span>
          <span className="font-bold text-sm">{formatCurrency(receipt.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Pay Option:</span>
          <span>{receipt.paymentOption}</span>
        </div>
        <div className="flex justify-between text-[10px] italic">
          <span className="font-bold">Expires:</span>
          <span>{receipt.expiryDate}</span>
        </div>
      </div>

      <div className="text-center bg-gray-100 p-2 border border-black border-dashed mb-4">
        <p className="text-[10px] mb-1">Control Number:</p>
        <p className="text-sm font-bold tracking-widest">{receipt.controlNumber}</p>
      </div>

      <div className="text-[10px] text-center mb-4 leading-tight">
        <p>Lipa kupitia Benki (NMB/BOT/PBZ) na Mitandao ya Simu</p>
        <p className="font-bold">(kwa kuchagua "Malipo ya Serikali")</p>
      </div>

      <div className="text-[10px] border-t border-black border-dashed pt-2 space-y-1">
        <p className="text-center italic">{receipt.notes}</p>
        <p className="text-center font-bold mt-2">Piga namba 0777350786 kwa maelezo zaidi.</p>
      </div>

      <div className="mt-4 pt-2 border-t border-black border-dashed text-[9px] space-y-0.5 opacity-80">
        <p><span className="font-bold">POS Center:</span> {receipt.posCenterName}</p>
        <p><span className="font-bold">Transaction:</span> {receipt.transactionId}</p>
        <p><span className="font-bold">Printed:</span> {receipt.printedAt}</p>
        <p><span className="font-bold">By:</span> {receipt.printedBy}</p>
      </div>
      
      <div className="text-center mt-6 text-[8px] uppercase tracking-tighter">
        *** Thank You / Karibu Tena ***
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
