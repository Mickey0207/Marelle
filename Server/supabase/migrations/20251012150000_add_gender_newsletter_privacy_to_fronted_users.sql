begin;

alter table if exists public.fronted_users
  add column if not exists gender text,
  add column if not exists newsletter boolean not null default false,
  add column if not exists privacy_policy boolean not null default false;

comment on column public.fronted_users.gender is '性別：男/女/不願透漏，或為 NULL 表示未設定';
comment on column public.fronted_users.newsletter is '是否訂閱電子報（註冊時若勾選為 true）';
comment on column public.fronted_users.privacy_policy is '是否同意隱私政策（註冊時若勾選為 true）';

commit;
