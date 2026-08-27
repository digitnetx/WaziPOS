"use client";

import React from 'react';
import { Receipt } from '@/lib/types';

interface ThermalReceiptProps {
  receipt: Receipt;
  className?: string;
  id?: string;
  paperWidth?: '58mm' | '80mm';
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ receipt, className, id, paperWidth = '58mm' }) => {
  const formattedAmount = `${receipt.currency || 'TZS'} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: receipt.currency === 'USD' ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(receipt.amount)}`;

  const [expiryDay = '', expiryTime = ''] = (receipt.expiryDate || '').split(' ');
  const formattedExpireDate = `${expiryDay} ${expiryTime.replace(/:/g, '')}`.trim();
  const [printDay = '', printTime = ''] = (receipt.printedAt || '').split(' ');
  const printedOn = `${printDay}${printTime ? `T${printTime}` : ''}`.trim();

  const is58 = paperWidth === '58mm';
  const base: React.CSSProperties = {
    width: is58 ? '58mm' : '80mm',
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: is58 ? '16px' : '16px',
    fontWeight: 400,
    lineHeight: 1.2,
    fontVariantNumeric: 'normal',
    fontFeatureSettings: '"zero" 0',
    fontKerning: 'none',
    padding: is58 ? '12px 8px 14px' : '12px 10px 14px',
    boxSizing: 'border-box',
    textAlign: 'left',
    margin: '0 auto',
    overflow: 'hidden',
  };

  const row: React.CSSProperties = {
    margin: 0,
    padding: 0,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    fontWeight: 400,
    fontVariantNumeric: 'normal',
    fontFeatureSettings: '"zero" 0',
  };

  const value: React.CSSProperties = { fontWeight: 400 };

  return (
    <div id={id} style={base} className={className}>
      <div style={{ textAlign: 'center', marginBottom: '27px' }}>
        <div style={{ fontSize: is58 ? '16px' : '16px', fontWeight: 600, lineHeight: 1.15, whiteSpace: 'nowrap', marginBottom: '27px' }}>
          Ministry of Blue Economy and Fisheries
        </div>
        <div style={{ fontSize: is58 ? '18px' : '18px', fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          Government Bill
        </div>
      </div>

      <div>
        <div style={row}><span>BillItem : </span><span style={value}>{receipt.billItem}</span></div>
        <div style={{ ...row, marginTop: '6px' }}>({receipt.currency || 'TZS'})</div>
        <div style={{ ...row, marginTop: '7px' }}>Payer name : {receipt.customerName}</div>
        <div style={{ ...row, marginTop: '7px' }}>Payer phone : {receipt.customerPhone}</div>
        <div style={{ ...row, marginTop: '7px' }}>Amount : {formattedAmount}</div>
        <div style={{ ...row, marginTop: '7px' }}>Pay option : {receipt.paymentOption}</div>
        <div style={{ ...row, marginTop: '7px' }}>Expire Date : {formattedExpireDate}</div>
        <div style={{ ...row, marginTop: '7px' }}>ControlNumber : {receipt.controlNumber}</div>
      </div>

      <div style={{ fontSize: is58 ? '16px' : '16px', lineHeight: 1.5, marginTop: '47px', marginBottom: '59px', fontWeight: 400 }}>
        Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa<br />
        kuchagua &quot;Malipo ya Serikali&quot;)<br />
        Piga namba 0778782798 kwa maelezo zaidi.
      </div>

      <div style={{ fontSize: is58 ? '16px' : '16px', lineHeight: 1.5, fontWeight: 400 }}>
        <div style={{ ...row, whiteSpace: 'normal' }}>POS center : {receipt.posCenterName}</div>
        <div style={{ ...row, marginTop: '7px' }}>Printed on : {printedOn}</div>
        <div style={{ ...row, marginTop: '7px' }}>Printed By : {receipt.printedBy}</div>
      </div>
    </div>
  );
};
