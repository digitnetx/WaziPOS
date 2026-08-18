# WaziPOS Supabase migration

## 1. Create the receipts table

Run `supabase/migrations/001_receipts.sql` in the Supabase SQL Editor.

## 2. Configure Vercel / production environment variables

Set these server-side variables:

- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role key

Never expose `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_*` variable and never commit it to Git.

## 3. Receipt flow

The POS generates the receipt locally first, then POSTs it to `/api/receipts`. A database failure does not block receipt generation or native SUNMI printing.

Dashboard and history load receipts through the same API route.

## 4. Android POS

The Android APK continues to load `https://wazi-pos.vercel.app` and uses the existing `Sunmi` JavaScript bridge for native thermal printing. A web deployment does not require rebuilding the APK; rebuild the APK only when Android/native code changes.
