create table if not exists public.audit_reports (
  id uuid primary key,
  target_url text not null,
  hostname text not null,
  status text not null check (status in ('complete', 'failed')),
  result jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists audit_reports_expires_at_idx on public.audit_reports (expires_at);
alter table public.audit_reports enable row level security;
-- Reports are read and written only by the server-side service-role key.
