-- Enable RLS for frontend payment order tables
-- We don't add any client policies; default deny. Backend uses service role and bypasses RLS.

alter table if exists public.fronted_credit_order enable row level security;
alter table if exists public.fronted_atm_order enable row level security;
alter table if exists public.fronted_cvscode_order enable row level security;
alter table if exists public.fronted_webatm_order enable row level security;
