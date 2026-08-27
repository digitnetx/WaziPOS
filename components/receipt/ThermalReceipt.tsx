"use client";

import React from 'react';
import { Receipt } from '@/lib/types';

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
  paperWidth = '58mm',
}) => {
  const formattedAmount = `${receipt.currency || 'TZS'} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: receipt.currency === 'USD' ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(receipt.amount)}`;

  const [expiryDay = '', expiryTime = ''] = (receipt.expiryDate || '').split(' ');
  const formattedExpireDate = `${expiryDay} ${expiryTime.replace(/:/g, '')}`.trim();

  const [printDay = '', printTime = ''] = (receipt.printedAt || '').split(' ');
  const printedOn = `${printDay}${printTime ? `T${printTime}` : ''}`.trim();

  // Match the photographed government receipt closely:
  // compact 58mm layout, Arial, normal 0 (no slashed/dotted zero), tight spacing.
  const containerStyle: React.CSSProperties = {
    width: paperWidth === '58mm' ? '58mm' : '80mm',
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: paperWidth === '58mm' ? '14px' : '14px',
    lineHeight: 1.22,
    fontVariantNumeric: 'normal',
    fontFeatureSettings: '"zero" 0',
    fontKerning: 'none',
    padding: paperWidth === '58mm' ? '7px 5px 10px' : '8px 8px 10px',
    boxSizing: 'border-box',
    textAlign: 'left',
    margin: '0 auto',
    overflow: 'hidden',
  };

  const normal: React.CSSProperties = {
    fontWeight: 400,
    fontVariantNumeric: 'normal',
    fontFeatureSettings: '"zero" 0',
  };

  const label = normal;
  const value: React.CSSProperties = {
    ...normal,
    fontWeight: 500,
  };

  const row: React.CSSProperties = {
    margin: 0,
    lineHeight: 1.22,
    whiteSpace: 'nowrap',
  };

  return (
    <div id={id} style={containerStyle} className={className}>
      <div style={{ textAlign: 'center', marginBottom: '18px' }}>
        <div
          style={{
            ...normal,
            fontSize: '14px',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            marginBottom: '18px',
          }}
        >
          Ministry of Blue Economy and Fisheries
        </div>
        <div
          style={{
            ...normal,
            fontSize: '17px',
            fontWeight: 700,
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
          }}
        >
          Government Bill
        </div>
      </div>

      <div>
        <div style={{ ...row, fontSize: '14px' }}>
          <span style={label}>BillItem : </span>
          <span style={value}>{receipt.billItem}</span>
        </div>

        <div style={{ ...row, marginTop: '2px' }}>
          <span style={value}>({receipt.currency || 'TZS'})</span>
        </div>

        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>Payer name : </span>
          <span style={value}>{receipt.customerName}</span>
        </div>

        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>Payer phone : </span>
          <span style={value}>{receipt.customerPhone}</span>
        </div>

        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>Amount : </span>
          <span style={value}>{formattedAmount}</span>
        </div>

        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>Pay option : </span>
          <span style={value}>{receipt.paymentOption}</span>
        </div>

        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>Expire Date : </span>
          <span style={value}>{formattedExpireDate}</span>
        </div>

        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>ControlNumber : </span>
          <span style={value}>{receipt.controlNumber}</span>
        </div>
      </div>

      <div
        style={{
          ...normal,
          fontSize: '14px',
          lineHeight: 1.55,
          marginTop: '3px',
          marginBottom: '28px',
        }}
      >
        Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa<br />
        kuchagua &quot;Malipo ya Serikali&quot;)<br />
        Piga namba 0778782798 kwa maelezo zaidi.
      </div>

      <div style={{ ...normal, fontSize: '14px', lineHeight: 1.55 }}>
        <div style={{ ...row, whiteSpace: 'normal' }}>
          <span style={label}>POS center : </span>
          <span style={value}>{receipt.posCenterName}</span>
        </div>
        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>Printed on : </span>
          <span style={value}>{printedOn}</span>
        </div>
        <div style={{ ...row, marginTop: '2px' }}>
          <span style={label}>Printed By : </span>
          <span style={value}>{receipt.printedBy}</span>
        </div>
      </div>
    </div>
  );
};
