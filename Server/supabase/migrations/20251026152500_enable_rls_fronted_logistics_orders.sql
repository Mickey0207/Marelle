-- Enable RLS for new logistics tables
alter table if exists public.fronted_c2c_logistics_order enable row level security;
alter table if exists public.fronted_b2c_logistics_order enable row level security;
alter table if exists public.fronted_home_logistics_order enable row level security;
alter table if exists public.fronted_b2c_reverse_logistics_order enable row level security;
alter table if exists public.fronted_home_reverse_logistics_order enable row level security;
