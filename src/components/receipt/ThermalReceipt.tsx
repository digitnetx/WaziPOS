
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
  paperWidth = '58mm'
}) => {
  const formattedAmount = `${receipt.currency} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(receipt.amount)}`;

  const [expiryDay, expiryTime] = (receipt.expiryDate || '').split(' ');
  const cleanExpiryTime = expiryTime ? expiryTime.replace(/:/g, '') : '';
  const formattedExpireDate = `${expiryDay || ''} ${cleanExpiryTime}`.trim();

  const [printDay, printTime] = (receipt.printedAt || '').split(' ');
  const isoPrintDate = printDay && printTime ? `${printDay}T${printTime}` : receipt.printedAt || '';

  const containerStyle: React.CSSProperties = {
    width: paperWidth === '58mm' ? '58mm' : '80mm',
    minWidth: paperWidth === '58mm' ? '58mm' : '80mm',
    backgroundColor: '#fff',
    color: '#000',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '14px',
    lineHeight: '1.38',
    padding: '28px 10px 32px 10px',
    boxSizing: 'border-box',
    textAlign: 'left',
    margin: '0 auto',
  };

  const labelStyle: React.CSSProperties = { fontWeight: 400 };
  const valueStyle: React.CSSProperties = { fontWeight: 700 };
  const oneLineStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
  };

  return (
    <div id={id} style={containerStyle} className={className}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...oneLineStyle, fontSize: paperWidth === '58mm' ? '12.5px' : '14px', fontWeight: 700 }}>
          Ministry of Blue Economy and Fisheries
        </div>
        <div style={{ margin: '28px 0 25px', fontSize: '17px', fontWeight: 700 }}>
          Government Bill
        </div>
      </div>

      <div>
        <div style={{ ...oneLineStyle, marginBottom: '0px', fontSize: paperWidth === '58mm' ? '12.5px' : '14px' }}>
          <span style={labelStyle}>BillItem : </span>
          <span style={valueStyle}>{receipt.billItem}</span>
        </div>

        <div style={{ marginBottom: '0px' }}>
          <span style={valueStyle}>({receipt.currency})</span>
        </div>

        <div style={{ marginBottom: '0px' }}>
          <span style={labelStyle}>Payer name : </span>
          <span style={valueStyle}>{receipt.customerName}</span>
        </div>

        <div style={{ marginBottom: '0px' }}>
          <span style={labelStyle}>Payer phone : </span>
          <span style={valueStyle}>{receipt.customerPhone}</span>
        </div>

        <div style={{ marginBottom: '0px' }}>
          <span style={labelStyle}>Amount : </span>
          <span style={valueStyle}>{formattedAmount}</span>
        </div>

        <div style={{ marginBottom: '0px' }}>
          <span style={labelStyle}>Pay option : </span>
          <span style={valueStyle}>{receipt.paymentOption}</span>
        </div>

        <div style={{ marginBottom: '0px' }}>
          <span style={labelStyle}>Expire Date : </span>
          <span style={valueStyle}>{formattedExpireDate}</span>
        </div>

        <div>
          <span style={labelStyle}>ControlNumber : </span>
          <span style={valueStyle}>{receipt.controlNumber}</span>
        </div>
      </div>

      <div style={{ fontSize: '13.5px', lineHeight: '1.4', marginTop: '0px', marginBottom: '30px' }}>
        Lipa kupitia Benki (NMB/BOT/PBZ) na Mawakala wake au Mitandao ya Simu (kwa<br />
        kuchagua "Malipo ya Serikali")<br />
        Piga namba 0778782798 kwa maelezo zaidi.
      </div>

      <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
        <div style={{ marginBottom: '4px' }}>
          <span style={labelStyle}>POS center : </span>
          <span style={valueStyle}>{receipt.posCenterName}</span>
        </div>
        <div style={{ marginBottom: '4px' }}>
          <span style={labelStyle}>Printed on : </span>
          <span style={valueStyle}>{isoPrintDate}</span>
        </div>
        <div>
          <span style={labelStyle}>Printed By : </span>
          <span style={valueStyle}>{receipt.printedBy}</span>
        </div>
      </div>
    </div>
  );
};
