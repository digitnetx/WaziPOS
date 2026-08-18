create extension if not exists pgcrypto;

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  bill_item text not null,
  customer_name text not null,
  customer_phone text not null,
  num_people integer not null default 1 check (num_people > 0),
  amount numeric(14,2) not null check (amount >= 0),
  payment_option text not null check (payment_option in ('Exact', 'Partial')),
  expiry_date text not null,
  control_number text not null unique,
  pos_center_name text not null,
  printed_by text not null,
  printed_at timestamptz not null default now(),
  notes text not null default '',
  visitor_type text not null,
  transaction_id text not null
);

create index if not exists receipts_printed_at_idx on public.receipts (printed_at desc);
create index if not exists receipts_customer_phone_idx on public.receipts (customer_phone);
create index if not exists receipts_control_number_idx on public.receipts (control_number);

alter table public.receipts enable row level security;

-- The Next.js API route uses the Supabase service-role key server-side.
-- Do not expose that key to the browser and do not create public INSERT/SELECT policies.
