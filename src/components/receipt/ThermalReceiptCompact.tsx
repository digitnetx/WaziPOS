"use client";

import React from 'react';
import { Receipt } from '@/lib/types';

interface ThermalReceiptCompactProps {
  receipt: Receipt;
  className?: string;
  id?: string;
  paperWidth?: '58mm' | '80mm';
}

export const ThermalReceiptCompact: React.FC<ThermalReceiptCompactProps> = ({
  receipt,
  className,
  id,
  paperWidth = '58mm',
}) => {
  const amount = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(receipt.amount);
  const [expiryDay = '', expiryTime = ''] = (receipt.expiryDate || '').split(' ');
  const expiry = `${expiryDay} ${expiryTime.replace(/:/g, '')}`.trim();
  const [printDay = '', printTime = ''] = (receipt.printedAt || '').split(' ');
  const printedOn = `${printDay}${printTime ? ` ${printTime}` : ''}`.trim();
  const small = paperWidth === '58mm';

  const style: React.CSSProperties = {
    width: small ? '58mm' : '80mm',
    background: '#fff',
    color: '#000',
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: small ? '10px' : '11px',
    lineHeight: 1.28,
    padding: small ? '8px 6px 10px' : '10px 8px 12px',
    boxSizing: 'border-box',
    textAlign: 'left',
    margin: '0 auto',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  };
  const row: React.CSSProperties = { margin: 0, lineHeight: 1.28 };

  return (
    <div id={id} style={style} className={className}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: small ? '9px' : '10px', lineHeight: 1.15, marginBottom: '8px' }}>
          Ministry of Blue Economy and Fisheries
        </div>
        <div style={{ fontSize: small ? '10.5px' : '12px', fontWeight: 700, lineHeight: 1.15, marginBottom: '12px' }}>
          Government Bill
        </div>
      </div>

      <div>
        <div style={row}>BillItem : {receipt.billItem}</div>
        <div style={row}>(TZS)</div>
        <div style={row}>Payer name : {receipt.customerName}</div>
        <div style={row}>Payer phone : {receipt.customerPhone}</div>
        <div style={row}>Amount : {amount}</div>
        <div style={row}>Pay option : {receipt.paymentOption}</div>
        <div style={row}>Expire Date : {expiry}</div>
        <div style={row}>ControlNumber : {receipt.controlNumber}</div>
      </div>

      <div style={{ marginTop: '9px', marginBottom: '12px', lineHeight: 1.28 }}>
        Lipa kupitia Benki (NMB/BOT/PBZ) na<br />
        Mawakala wake au Mitandao ya Simu<br />
        (kwa kuchagua &quot;Malipo ya Serikali&quot;)<br />
        Piga namba 0777350786 kwa maelezo Zaidi.
      </div>

      <div style={{ lineHeight: 1.28 }}>
        <div style={row}>POS center : {receipt.posCenterName}</div>
        <div style={row}>Printed on : {printedOn}</div>
        <div style={row}>Printed By : {receipt.printedBy}</div>
      </div>
    </div>
  );
};
