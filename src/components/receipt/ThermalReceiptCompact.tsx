"use client";

import React from 'react';
import { Receipt } from '@/lib/types';

interface ThermalReceiptCompactProps {
  receipt: Receipt;
  className?: string;
  id?: string;
  paperWidth?: '58mm' | '80mm';
}

/**
 * Government-bill thermal receipt layout based on the supplied original.
 * Keep the typography plain, compact and left aligned, with only the two
 * headings centered and deliberate whitespace between the heading sections.
 */
export const ThermalReceiptCompact: React.FC<ThermalReceiptCompactProps> = ({ receipt, className, id, paperWidth = '58mm' }) => {
  const amount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: receipt.currency === 'USD' ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(receipt.amount);
  const [expiryDay = '', expiryTime = ''] = (receipt.expiryDate || '').split(' ');
  const expiry = `${expiryDay} ${expiryTime.replace(/:/g, '')}`.trim();
  const [printDay = '', printTime = ''] = (receipt.printedAt || '').split(' ');
  const printedOn = `${printDay}${printTime ? ` ${printTime}` : ''}`.trim();
  const small = paperWidth === '58mm';

  const style: React.CSSProperties = {
    width: small ? '58mm' : '80mm',
    background: '#fff',
    color: '#000',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: small ? '11px' : '11.5px',
    fontWeight: 400,
    lineHeight: 1.22,
    padding: small ? '7px 7px 10px' : '9px 9px 11px',
    boxSizing: 'border-box',
    textAlign: 'left',
    margin: '0 auto',
    overflowWrap: 'break-word',
    wordBreak: 'normal',
  };

  const row: React.CSSProperties = { margin: 0, lineHeight: 1.22 };

  return (
    <div id={id} style={style} className={className}>
      <div style={{ textAlign: 'center', marginBottom: small ? '16px' : '18px' }}>
        <div style={{
          fontSize: small ? '11px' : '11.5px',
          fontWeight: 600,
          lineHeight: 1.12,
          whiteSpace: 'nowrap',
          marginBottom: small ? '18px' : '20px',
        }}>
          Ministry of Blue Economy and Fisheries
        </div>
        <div style={{
          fontSize: small ? '12px' : '12.5px',
          fontWeight: 700,
          lineHeight: 1.12,
        }}>
          Government Bill
        </div>
      </div>

      <div>
        <div style={{ ...row, marginBottom: small ? '4px' : '5px', whiteSpace: 'nowrap' }}>
          BillItem : {receipt.billItem}
        </div>
        <div style={{ ...row, marginBottom: small ? '7px' : '8px' }}>({receipt.currency})</div>
        <div style={row}>Payer name : {receipt.customerName}</div>
        <div style={row}>Payer phone : {receipt.customerPhone}</div>
        <div style={row}>Amount : {receipt.currency} {amount}</div>
        <div style={row}>Pay option : {receipt.paymentOption}</div>
        <div style={row}>Expire Date : {expiry}</div>
        <div style={{ ...row, fontWeight: 700 }}>ControlNumber : {receipt.controlNumber}</div>
      </div>

      <div style={{ marginTop: small ? '10px' : '11px', marginBottom: small ? '14px' : '15px', lineHeight: 1.22 }}>
        Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa kuchagua &quot;Malipo ya Serikali&quot;)<br />
        Piga namba 0778782798 kwa maelezo zaidi.
      </div>

      <div style={{ lineHeight: 1.22 }}>
        <div style={row}>POS center : {receipt.posCenterName}</div>
        <div style={row}>Printed on : {printedOn}</div>
        <div style={row}>Printed By : {receipt.printedBy}</div>
      </div>
    </div>
  );
};
