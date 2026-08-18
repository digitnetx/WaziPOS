import { Receipt } from '@/lib/types';

type NativePrinterBridge = {
  isAvailable?: () => boolean;
  printReceipt?: (payload: string) => void;
  printText?: (text: string) => void;
};

declare global {
  interface Window {
    WaziPOSPrinter?: NativePrinterBridge;
    Android?: NativePrinterBridge;
  }
}

export type PrinterResult = {
  printed: boolean;
  native: boolean;
  message: string;
};

const getNativePrinter = (): NativePrinterBridge | null => {
  if (typeof window === 'undefined') return null;

  const candidates = [window.WaziPOSPrinter, window.Android];
  for (const bridge of candidates) {
    if (!bridge) continue;
    if (typeof bridge.isAvailable === 'function' && !bridge.isAvailable()) continue;
    if (bridge.printReceipt || bridge.printText) return bridge;
  }

  return null;
};

const buildPrinterPayload = (receipt: Receipt, paperWidth: '58mm' | '80mm') => ({
  type: 'receipt',
  paperWidth,
  cut: true,
  openDrawer: false,
  receipt: {
    billItem: receipt.billItem,
    customerName: receipt.customerName,
    customerPhone: receipt.customerPhone,
    amount: receipt.amount,
    paymentOption: receipt.paymentOption,
    expiryDate: receipt.expiryDate,
    controlNumber: receipt.controlNumber,
    posCenterName: receipt.posCenterName,
    printedBy: receipt.printedBy,
    printedAt: receipt.printedAt,
  },
});

const buildPlainText = (receipt: Receipt) => {
  const amount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(receipt.amount);

  return [
    'Ministry of Blue Economy and Fisheries',
    '',
    'GOVERNMENT BILL',
    '',
    `BillItem : ${receipt.billItem}`,
    '(TZS)',
    `Payer name : ${receipt.customerName}`,
    `Payer phone : ${receipt.customerPhone}`,
    `Amount : TZS ${amount}`,
    `Pay option : ${receipt.paymentOption}`,
    `Expire Date : ${receipt.expiryDate.replace(/:/g, '')}`,
    `ControlNumber : ${receipt.controlNumber}`,
    '',
    'Lipa kupitia Benki (NMB/BOT/PBZ) na',
    'Mawakala wake au Mitandao ya Simu',
    '(kwa kuchagua "Malipo ya Serikali")',
    'Piga namba 0777350786 kwa maelezo',
    'Zaidi.',
    '',
    `POS center : ${receipt.posCenterName}`,
    `Printed on : ${receipt.printedAt.replace(' ', 'T')}`,
    `Printed By : ${receipt.printedBy}`,
    '',
    '',
  ].join('\n');
};

export const printReceipt = (
  receipt: Receipt,
  paperWidth: '58mm' | '80mm' = '58mm'
): PrinterResult => {
  if (typeof window === 'undefined') {
    return { printed: false, native: false, message: 'Printing is only available in the browser.' };
  }

  const nativePrinter = getNativePrinter();

  if (nativePrinter?.printReceipt) {
    nativePrinter.printReceipt(JSON.stringify(buildPrinterPayload(receipt, paperWidth)));
    return { printed: true, native: true, message: 'Receipt sent to the POS printer.' };
  }

  if (nativePrinter?.printText) {
    nativePrinter.printText(buildPlainText(receipt));
    return { printed: true, native: true, message: 'Receipt sent to the POS printer.' };
  }

  window.print();
  return {
    printed: true,
    native: false,
    message: 'System print dialog opened. For automatic POS printing, install the WaziPOS native printer bridge.',
  };
};

export const isNativePrinterAvailable = (): boolean => Boolean(getNativePrinter());
