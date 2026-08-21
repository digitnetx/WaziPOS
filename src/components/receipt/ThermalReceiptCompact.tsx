"use client";

import React from 'react';
import { Receipt } from '@/lib/types';

interface ThermalReceiptCompactProps {
  receipt: Receipt;
  className?: string;
  id?: string;
  paperWidth?: '58mm' | '80mm';
}

/** Thermal receipt styled to closely match the supplied original government receipt. */
export const ThermalReceiptCompact: React.FC<ThermalReceiptCompactProps> = ({ receipt, className, id, paperWidth = '58mm' }) => {
  const amount = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(receipt.amount);
  const [expiryDay = '', expiryTime = ''] = (receipt.expiryDate || '').split(' ');
  const expiry = `${expiryDay} ${expiryTime.replace(/:/g, '')}`.trim();
  const [printDay = '', printTime = ''] = (receipt.printedAt || '').split(' ');
  const printedOn = `${printDay}${printTime ? ` ${printTime}` : ''}`.trim();
  const small = paperWidth === '58mm';
  const style: React.CSSProperties = {
    width: small ? '58mm' : '80mm', background: '#fff', color: '#000', fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: small ? '9.5px' : '10.5px', fontWeight: 400, lineHeight: 1.16,
    padding: small ? '7px 7px 8px' : '9px 9px 10px', boxSizing: 'border-box', textAlign: 'left', margin: '0 auto',
    overflowWrap: 'break-word', wordBreak: 'normal',
  };
  const row: React.CSSProperties = { margin: 0, lineHeight: 1.16 };
  return (
    <div id={id} style={style} className={className}>
      <div style={{ textAlign: 'center', marginBottom: small ? '16px' : '18px' }}>
        <div style={{ fontSize: small ? '9.5px' : '10.5px', fontWeight: 400, lineHeight: 1.08, marginBottom: small ? '13px' : '15px' }}>Ministry of Blue Economy and Fisheries</div>
        <div style={{ fontSize: small ? '10px' : '11px', fontWeight: 700, lineHeight: 1.08 }}>Government Bill</div>
      </div>
      <div>
        <div style={{ ...row, marginBottom: small ? '7px' : '8px' }}>BillItem : {receipt.billItem}</div>
        <div style={{ ...row, marginBottom: small ? '7px' : '8px' }}>({receipt.currency})</div>
        <div style={row}>Payer name : {receipt.customerName}</div>
        <div style={row}>Payer phone : {receipt.customerPhone}</div>
        <div style={row}>Amount : {amount}</div>
        <div style={row}>Pay option : {receipt.paymentOption}</div>
        <div style={row}>Expire Date : {expiry}</div>
        <div style={{ ...row, fontWeight: 700 }}>ControlNumber : {receipt.controlNumber}</div>
      </div>
      <div style={{ marginTop: small ? '10px' : '11px', marginBottom: small ? '12px' : '14px', lineHeight: 1.16 }}>
        Lipa kupitia Benki (NMB/BOT/PBZ) na<br />
        Mawakala wake au Mitandao ya Simu<br />
        (kwa kuchagua &quot;Malipo ya Serikali&quot;)<br />
        Piga namba 0777350786 kwa maelezo Zaidi.
      </div>
      <div style={{ lineHeight: 1.16 }}>
        <div style={row}>POS center : {receipt.posCenterName}</div>
        <div style={row}>Printed on : {printedOn}</div>
        <div style={row}>Printed By : {receipt.printedBy}</div>
      </div>
    </div>
  );
};
