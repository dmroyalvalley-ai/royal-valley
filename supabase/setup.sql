-- Royal Valley: run in Supabase SQL Editor as project owner.
-- Re-runnable. No public signup automatically becomes an administrator.
begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create table if not exists public.umrah_programs (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 160),
  description text not null check (length(trim(description)) between 1 and 6000),
  image_path text not null check (length(trim(image_path)) > 0),
  duration text not null check (length(trim(duration)) between 1 and 80),
  price numeric(10,2) check (price >= 0),
  departure_date date,
  mecca_hotel text not null default '' check (length(mecca_hotel) <= 200),
  medina_hotel text not null default '' check (length(medina_hotel) <= 200),
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 99999),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists umrah_programs_listing on public.umrah_programs(published, sort_order, created_at desc);
alter table public.umrah_programs enable row level security;
revoke all on public.umrah_programs from anon, authenticated;
grant select on public.umrah_programs to anon, authenticated;
grant insert, update on public.umrah_programs to authenticated;

drop policy if exists "Visitors read published programs" on public.umrah_programs;
create policy "Visitors read published programs" on public.umrah_programs
  for select to anon, authenticated using (published = true);
drop policy if exists "Admins read all programs" on public.umrah_programs;
create policy "Admins read all programs" on public.umrah_programs
  for select to authenticated using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
drop policy if exists "Admins create programs" on public.umrah_programs;
create policy "Admins create programs" on public.umrah_programs
  for insert to authenticated with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
drop policy if exists "Admins update programs" on public.umrah_programs;
create policy "Admins update programs" on public.umrah_programs
  for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create or replace function public.set_program_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_program_updated_at() from public, anon, authenticated;
drop trigger if exists program_updated_at on public.umrah_programs;
create trigger program_updated_at before update on public.umrah_programs
for each row execute function public.set_program_updated_at();

-- Marketing images are public, including images uploaded for draft programs.
-- Never put identity documents or private customer files in this bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('umrah-images', 'umrah-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists "Admins upload umrah images" on storage.objects;
create policy "Admins upload umrah images" on storage.objects
  for insert to authenticated with check (bucket_id = 'umrah-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
drop policy if exists "Admins read umrah image metadata" on storage.objects;
create policy "Admins read umrah image metadata" on storage.objects
  for select to authenticated using (bucket_id = 'umrah-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
drop policy if exists "Admins clean up umrah images" on storage.objects;
create policy "Admins clean up umrah images" on storage.objects
  for delete to authenticated using (bucket_id = 'umrah-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

commit;

-- AFTER creating your user in Authentication > Users > Add user:
-- Replace the UUID below with that user's ID and run these two lines separately.
-- insert into public.admin_users (user_id)
-- values ('PASTE_AUTH_USER_UUID_HERE'::uuid) on conflict do nothing;
