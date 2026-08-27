"use client";

import React from 'react';
import { Receipt } from '@/lib/types';

interface ThermalReceiptCompactProps {
  receipt: Receipt;
  className?: string;
  id?: string;
  paperWidth?: '58mm' | '80mm';
}

/** Government-bill receipt layout matched to the supplied original. */
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
    fontSize: small ? '13px' : '13.5px',
    fontWeight: 400,
    lineHeight: 1.18,
    padding: small ? '6px 4px 9px' : '8px 8px 10px',
    boxSizing: 'border-box',
    textAlign: 'left',
    margin: '0 auto',
    overflowWrap: 'normal',
    wordBreak: 'normal',
  };

  const row: React.CSSProperties = { margin: 0, lineHeight: 1.18 };

  return (
    <div id={id} style={style} className={className}>
      <div style={{ textAlign: 'center', marginBottom: small ? '8px' : '10px' }}>
        <div style={{
          fontSize: small ? '13px' : '13.5px',
          fontWeight: 600,
          lineHeight: 1.08,
          whiteSpace: 'nowrap',
          marginBottom: small ? '8px' : '10px',
        }}>
          Ministry of Blue Economy and Fisheries
        </div>
        <div style={{
          fontSize: small ? '14px' : '14.5px',
          fontWeight: 700,
          lineHeight: 1.08,
        }}>
          Government Bill
        </div>
      </div>

      <div>
        {/* Keep BillItem + complete value on one physical line on 58mm. */}
        <div style={{
          ...row,
          whiteSpace: 'nowrap',
          fontSize: small ? '10.5px' : '13.5px',
          letterSpacing: small ? '-0.2px' : undefined,
        }}>
          BillItem : {receipt.billItem}
        </div>
        {/* No blank line: currency immediately follows BillItem. */}
        <div style={{ ...row, fontSize: small ? '10.5px' : undefined }}>
          ({receipt.currency})
        </div>
        {/* No blank line: Payer name immediately follows currency. */}
        <div style={{ ...row, fontSize: small ? '10.5px' : undefined }}>
          Payer name : {receipt.customerName}
        </div>
        <div style={row}>Payer phone : {receipt.customerPhone}</div>
        <div style={row}>Amount : {receipt.currency} {amount}</div>
        <div style={row}>Pay option : {receipt.paymentOption}</div>
        <div style={row}>Expire Date : {expiry}</div>

        {/* Payment instructions start immediately after ControlNumber. */}
        <div style={{ ...row, fontWeight: 700 }}>ControlNumber : {receipt.controlNumber}</div>
      </div>

      <div style={{ marginTop: 0, marginBottom: small ? '11px' : '13px', lineHeight: 1.18 }}>
        Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa<br />
        kuchagua &quot;Malipo ya Serikali&quot;)<br />
        Piga namba 0778782798 kwa maelezo zaidi.
      </div>

      <div style={{ lineHeight: 1.18 }}>
        <div style={row}>POS center : {receipt.posCenterName}</div>
        <div style={row}>Printed on : {printedOn}</div>
        <div style={row}>Printed By : {receipt.printedBy}</div>
      </div>
    </div>
  );
};
