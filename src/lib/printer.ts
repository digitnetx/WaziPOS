import { Receipt } from '@/lib/types';

type NativePrinterBridge = {
  isAvailable?: () => boolean;
  getStatus?: () => string;
  testPrint?: () => boolean;
  printReceipt?: (payload: string) => boolean | void;
};

declare global {
  interface Window {
    Sunmi?: NativePrinterBridge;
    WaziPOSPrinter?: NativePrinterBridge;
  }
}

export type PrinterResult = {
  printed: boolean;
  native: boolean;
  message: string;
  status?: string;
};

const getNativePrinter = (): NativePrinterBridge | null => {
  if (typeof window === 'undefined') return null;
  const candidates = [window.Sunmi, window.WaziPOSPrinter];
  for (const bridge of candidates) {
    if (!bridge) continue;
    if (typeof bridge.isAvailable === 'function' && !bridge.isAvailable()) continue;
    if (typeof bridge.printReceipt === 'function') return bridge;
  }
  return null;
};

const getPrinterStatus = (printer: NativePrinterBridge | null) => {
  try {
    return printer?.getStatus?.();
  } catch {
    return undefined;
  }
};

const buildPayload = (receipt: Receipt) => ({
  businessName: 'WAZI POS',
  receiptNumber: '',
  billItem: receipt.billItem,
  customerName: receipt.customerName,
  customerPhone: receipt.customerPhone,
  amount: String(receipt.amount),
  paymentOption: receipt.paymentOption,
  expiryDate: receipt.expiryDate,
  controlNumber: receipt.controlNumber,
  posCenterName: receipt.posCenterName,
  printedAt: receipt.printedAt,
  printedBy: receipt.printedBy,
  currency: receipt.currency,
});

const buildBrowserText = (receipt: Receipt) => {
  const amount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: receipt.currency === 'USD' ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(receipt.amount);
  return [
    'Ministry of Blue Economy and Fisheries',
    '',
    'Government Bill',
    '',
    '',
    `BillItem : ${receipt.billItem}`,
    `(${receipt.currency})`,
    `Payer name : ${receipt.customerName}`,
    `Payer phone : ${receipt.customerPhone}`,
    `Amount : ${receipt.currency} ${amount}`,
    `Pay option : ${receipt.paymentOption}`,
    `Expire Date : ${receipt.expiryDate}`,
    `ControlNumber : ${receipt.controlNumber}`,
    '',
    'Lipa kupitia Benki (NMB/BOT/PBZ) na',
    'Mawakala wake au Mitandao ya Simu',
    '(kwa kuchagua "Malipo ya Serikali")',
    'Piga namba 0777350786 kwa maelezo Zaidi.',
    '',
    `POS center : ${receipt.posCenterName}`,
    `Printed on : ${receipt.printedAt}`,
    `Printed By : ${receipt.printedBy}`,
  ].join('\n');
};

export const getNativePrinterStatus = (): string => {
  const printer = getNativePrinter();
  return getPrinterStatus(printer) ?? 'NOT_AVAILABLE';
};

export const testNativePrinter = (): boolean => {
  const printer = getNativePrinter();
  try {
    return Boolean(printer?.testPrint?.());
  } catch {
    return false;
  }
};

export const printReceipt = (
  receipt: Receipt,
  _paperWidth: '58mm' | '80mm' = '58mm'
): PrinterResult => {
  if (typeof window === 'undefined') {
    return { printed: false, native: false, message: 'Printing is only available in the browser.' };
  }

  const printer = getNativePrinter();
  if (printer?.printReceipt) {
    const status = getPrinterStatus(printer);
    if (status === 'OUT_OF_PAPER') {
      return { printed: false, native: true, status, message: 'Printer is out of paper.' };
    }
    if (status === 'COVER_OPEN') {
      return { printed: false, native: true, status, message: 'Printer cover is open.' };
    }
    if (status === 'HARDWARE_ERROR' || status === 'CUTTER_ERROR') {
      return { printed: false, native: true, status, message: `Printer error: ${status}.` };
    }

    try {
      const result = printer.printReceipt(JSON.stringify(buildPayload(receipt)));
      if (result === false) {
        return { printed: false, native: true, status, message: 'The POS printer rejected the receipt. Please try again.' };
      }
      return { printed: true, native: true, status, message: 'Receipt sent to the POS thermal printer.' };
    } catch (error) {
      console.error('Native printer bridge error:', error);
      return { printed: false, native: true, status, message: 'Could not communicate with the POS printer.' };
    }
  }

  window.print();
  return {
    printed: true,
    native: false,
    message: `Browser print dialog opened. ${buildBrowserText(receipt).length > 0 ? 'Use a browser printer when running outside the POS APK.' : ''}`,
  };
};

export const isNativePrinterAvailable = (): boolean => Boolean(getNativePrinter());
