import { NextRequest, NextResponse } from 'next/server';
import { supabaseRest } from '@/lib/supabase-server';
import { Receipt } from '@/lib/types';

const toReceipt = (row: Record<string, unknown>): Receipt => ({
  id: String(row.id),
  billItem: String(row.bill_item ?? ''),
  customerName: String(row.customer_name ?? ''),
  customerPhone: String(row.customer_phone ?? ''),
  numPeople: Number(row.num_people ?? 1),
  amount: Number(row.amount ?? 0),
  paymentOption: row.payment_option === 'Partial' ? 'Partial' : 'Exact',
  expiryDate: String(row.expiry_date ?? ''),
  controlNumber: String(row.control_number ?? ''),
  posCenterName: String(row.pos_center_name ?? ''),
  printedBy: String(row.printed_by ?? ''),
  printedAt: String(row.printed_at ?? ''),
  notes: String(row.notes ?? ''),
  visitorType: row.visitor_type as Receipt['visitorType'],
  transactionId: String(row.transaction_id ?? ''),
});

export async function POST(request: NextRequest) {
  try {
    const receipt = (await request.json()) as Receipt;
    const response = await supabaseRest<Record<string, unknown>[]>('receipts?select=*', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        bill_item: receipt.billItem,
        customer_name: receipt.customerName,
        customer_phone: receipt.customerPhone,
        num_people: receipt.numPeople,
        amount: receipt.amount,
        payment_option: receipt.paymentOption,
        expiry_date: receipt.expiryDate,
        control_number: receipt.controlNumber,
        pos_center_name: receipt.posCenterName,
        printed_by: receipt.printedBy,
        printed_at: receipt.printedAt || new Date().toISOString(),
        notes: receipt.notes,
        visitor_type: receipt.visitorType,
        transaction_id: receipt.transactionId,
      }),
    });

    return NextResponse.json({ receipt: response?.[0] ? toReceipt(response[0]) : receipt });
  } catch (error) {
    console.error('Supabase receipt insert failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save receipt' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') || 100), 1), 500);
    const search = request.nextUrl.searchParams.get('search')?.trim();
    const params = new URLSearchParams({
      select: '*',
      order: 'printed_at.desc',
      limit: String(limit),
    });

    if (search) {
      const escaped = search.replace(/[%_,]/g, (char) => `\\${char}`);
      params.set('or', `(customer_name.ilike.*${escaped}*,customer_phone.ilike.*${escaped}*,control_number.ilike.*${escaped}*)`);
    }

    const rows = await supabaseRest<Record<string, unknown>[]>(`receipts?${params.toString()}`);
    return NextResponse.json({ receipts: rows.map(toReceipt) });
  } catch (error) {
    console.error('Supabase receipt query failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load receipts' },
      { status: 500 }
    );
  }
}
