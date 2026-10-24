-- Wadajir Give — initial schema
-- Principles: RLS on every table; money in integer cents; donations written only by trusted server code
-- (service role via Stripe webhook); protected columns (status, verification, totals) changeable only by admins.

create extension if not exists pgcrypto;

-- ---------- Enums ----------
create type public.campaign_status as enum ('draft','pending_review','approved','rejected','paused','closed');
create type public.payout_status as enum ('not_started','onboarding','ready','paid','on_hold');
create type public.donation_status as enum ('pending','succeeded','failed','refunded');
create type public.report_status as enum ('open','reviewing','resolved','dismissed');
create type public.verification_status as enum ('requested','in_review','approved','denied');
create type public.user_role as enum ('user','admin');

-- ---------- Profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  email text,
  phone text check (char_length(phone) <= 40),
  country text check (char_length(country) <= 80),
  preferred_locale text not null default 'en' check (preferred_locale in ('en','so')),
  role public.user_role not null default 'user',
  is_verified_organizer boolean not null default false,
  is_suspended boolean not null default false,
  stripe_account_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- is_admin() is SECURITY DEFINER so policies can call it without recursive RLS on profiles.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and not is_suspended);
$$;

-- Create a profile row for every new auth user.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, preferred_locale)
  values (
    new.id,
    new.email,
    left(coalesce(new.raw_user_meta_data->>'full_name', ''), 120),
    case when new.raw_user_meta_data->>'locale' = 'so' then 'so' else 'en' end
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Non-admins cannot change their own role, verification, suspension or Stripe account.
create or replace function public.guard_profile_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and auth.uid() is not null then
    new.role := old.role;
    new.is_verified_organizer := old.is_verified_organizer;
    new.is_suspended := old.is_suspended;
    new.stripe_account_id := old.stripe_account_id;
    new.email := old.email;
  end if;
  new.updated_at := now();
  return new;
end $$;

create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_columns();

alter table public.profiles enable row level security;
create policy "profiles: read own" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles: update own" on public.profiles for update using (id = auth.uid() or public.is_admin());

-- ---------- Campaigns ----------
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  organizer_id uuid not null references public.profiles(id) on delete restrict,
  organizer_name text not null check (char_length(organizer_name) between 1 and 120),
  organizer_verified boolean not null default false,
  title text not null check (char_length(title) between 10 and 120),
  story text not null check (char_length(story) between 100 and 10000),
  category text not null check (category in ('medical','family','funeral','mosque','zakat-sadaqah','education','orphans','somalia-relief','water-wells','community','small-business')),
  goal_cents integer not null check (goal_cents between 10000 and 100000000),
  raised_cents integer not null default 0 check (raised_cents >= 0),
  donor_count integer not null default 0 check (donor_count >= 0),
  currency text not null default 'usd' check (currency = 'usd'),
  beneficiary_name text not null check (char_length(beneficiary_name) between 2 and 120),
  beneficiary_relationship text not null check (beneficiary_relationship in ('self','family','friend','organization')),
  city text check (char_length(city) <= 80),
  country text check (char_length(country) <= 80),
  cover_image_url text check (char_length(cover_image_url) <= 500),
  status public.campaign_status not null default 'draft',
  review_note text check (char_length(review_note) <= 1000),
  reviewed_by uuid references public.profiles(id),
  payout_status public.payout_status not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  approved_at timestamptz
);
create index campaigns_status_idx on public.campaigns (status, approved_at desc);
create index campaigns_organizer_idx on public.campaigns (organizer_id);
create index campaigns_category_idx on public.campaigns (category) where status = 'approved';

-- Organizers may only move between draft and pending_review, and cannot touch totals/verification/payouts.
create or replace function public.guard_campaign_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then
      if new.status not in ('draft','pending_review') then new.status := 'draft'; end if;
      new.raised_cents := 0;
      new.donor_count := 0;
      new.payout_status := 'not_started';
      new.review_note := null;
      new.reviewed_by := null;
      new.approved_at := null;
      new.organizer_verified := coalesce((select is_verified_organizer from public.profiles where id = new.organizer_id), false);
    end if;
    if new.status = 'pending_review' then new.submitted_at := now(); end if;
    return new;
  end if;

  if auth.uid() is not null and not public.is_admin() then
    -- organizer edits
    if old.status not in ('draft','pending_review','rejected') then
      raise exception 'This fundraiser can no longer be edited. Contact support.';
    end if;
    if new.status not in ('draft','pending_review') then new.status := old.status; end if;
    new.raised_cents := old.raised_cents;
    new.donor_count := old.donor_count;
    new.payout_status := old.payout_status;
    new.organizer_verified := old.organizer_verified;
    new.review_note := old.review_note;
    new.reviewed_by := old.reviewed_by;
    new.approved_at := old.approved_at;
    new.organizer_id := old.organizer_id;
    new.slug := old.slug;
  end if;

  if new.status = 'pending_review' and old.status <> 'pending_review' then new.submitted_at := now(); end if;
  if new.status = 'approved' and old.status <> 'approved' then new.approved_at := now(); end if;
  new.updated_at := now();
  return new;
end $$;

create trigger campaigns_guard before insert or update on public.campaigns
  for each row execute function public.guard_campaign_columns();

alter table public.campaigns enable row level security;
create policy "campaigns: public reads approved" on public.campaigns for select
  using (status in ('approved','closed') or organizer_id = auth.uid() or public.is_admin());
create policy "campaigns: organizer creates" on public.campaigns for insert
  with check (
    organizer_id = auth.uid()
    and not exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_suspended)
  );
create policy "campaigns: organizer or admin updates" on public.campaigns for update
  using (organizer_id = auth.uid() or public.is_admin());
create policy "campaigns: admin deletes" on public.campaigns for delete using (public.is_admin());

-- Keep campaigns.organizer_verified in sync with the organizer's profile.
create or replace function public.sync_organizer_verified()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.is_verified_organizer is distinct from old.is_verified_organizer then
    update public.campaigns set organizer_verified = new.is_verified_organizer where organizer_id = new.id;
  end if;
  return new;
end $$;
create trigger profiles_sync_verified after update on public.profiles
  for each row execute function public.sync_organizer_verified();

-- ---------- Campaign updates ----------
create table public.campaign_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 10 and 4000),
  created_at timestamptz not null default now()
);
create index campaign_updates_campaign_idx on public.campaign_updates (campaign_id, created_at desc);
alter table public.campaign_updates enable row level security;
create policy "updates: readable with campaign" on public.campaign_updates for select
  using (exists (select 1 from public.campaigns c where c.id = campaign_id));
create policy "updates: organizer posts" on public.campaign_updates for insert
  with check (
    author_id = auth.uid()
    and exists (select 1 from public.campaigns c where c.id = campaign_id and c.organizer_id = auth.uid() and c.status = 'approved')
  );
create policy "updates: admin deletes" on public.campaign_updates for delete using (public.is_admin());

-- ---------- Donations ----------
-- Inserted/updated ONLY by the server (service role) from Stripe Checkout + webhooks. No client write policies.
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete restrict,
  donor_id uuid references public.profiles(id) on delete set null,
  donor_name text check (char_length(donor_name) <= 120),
  donor_email text check (char_length(donor_email) <= 254),
  is_anonymous boolean not null default false,
  amount_cents integer not null check (amount_cents between 500 and 2500000),
  tip_cents integer not null default 0 check (tip_cents >= 0),
  currency text not null default 'usd',
  status public.donation_status not null default 'pending',
  message text check (char_length(message) <= 500),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  livemode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index donations_campaign_idx on public.donations (campaign_id, created_at desc);
create index donations_donor_idx on public.donations (donor_id, created_at desc);
alter table public.donations enable row level security;
create policy "donations: donor, organizer or admin reads" on public.donations for select
  using (
    donor_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.campaigns c where c.id = campaign_id and c.organizer_id = auth.uid())
  );

-- Recompute campaign totals from succeeded donations whenever a donation changes.
create or replace function public.refresh_campaign_totals()
returns trigger language plpgsql security definer set search_path = public as $$
declare cid uuid := coalesce(new.campaign_id, old.campaign_id);
begin
  update public.campaigns c set
    raised_cents = coalesce((select sum(amount_cents) from public.donations d where d.campaign_id = cid and d.status = 'succeeded'), 0),
    donor_count = (select count(*) from public.donations d where d.campaign_id = cid and d.status = 'succeeded')
  where c.id = cid;
  return null;
end $$;
create trigger donations_totals after insert or update or delete on public.donations
  for each row execute function public.refresh_campaign_totals();

-- Public donor wall: names hidden when anonymous, emails never exposed.
create or replace function public.campaign_recent_donations(p_campaign_id uuid, p_limit int default 10)
returns table (id uuid, display_name text, amount_cents int, message text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select d.id,
         case when d.is_anonymous or coalesce(d.donor_name,'') = '' then 'Anonymous' else d.donor_name end,
         d.amount_cents,
         d.message,
         d.created_at
  from public.donations d
  join public.campaigns c on c.id = d.campaign_id
  where d.campaign_id = p_campaign_id
    and d.status = 'succeeded'
    and c.status in ('approved','closed')
  order by d.created_at desc
  limit least(greatest(p_limit, 1), 50);
$$;
grant execute on function public.campaign_recent_donations(uuid, int) to anon, authenticated;

-- ---------- Reports (fraud / abuse) ----------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null check (reason in ('fraud','misleading','no_permission','inappropriate','other')),
  details text check (char_length(details) <= 2000),
  status public.report_status not null default 'open',
  admin_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index reports_status_idx on public.reports (status, created_at desc);
alter table public.reports enable row level security;
create policy "reports: anyone can file" on public.reports for insert
  with check (
    (reporter_id is null or reporter_id = auth.uid())
    and status = 'open'
    and exists (select 1 from public.campaigns c where c.id = campaign_id and c.status in ('approved','closed'))
  );
create policy "reports: admin reads" on public.reports for select using (public.is_admin());
create policy "reports: admin updates" on public.reports for update using (public.is_admin());

-- ---------- Verification requests ----------
create table public.verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.verification_status not null default 'requested',
  note text check (char_length(note) <= 1000),
  admin_note text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);
create unique index verification_one_open on public.verification_requests (user_id) where status in ('requested','in_review');
alter table public.verification_requests enable row level security;
create policy "verification: own or admin reads" on public.verification_requests for select using (user_id = auth.uid() or public.is_admin());
create policy "verification: user requests" on public.verification_requests for insert with check (user_id = auth.uid() and status = 'requested');
create policy "verification: admin updates" on public.verification_requests for update using (public.is_admin());

-- ---------- Payouts ----------
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete restrict,
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'scheduled' check (status in ('scheduled','in_transit','paid','failed','cancelled')),
  provider text not null default 'stripe',
  provider_reference text,
  note text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
alter table public.payouts enable row level security;
create policy "payouts: organizer or admin reads" on public.payouts for select
  using (public.is_admin() or exists (select 1 from public.campaigns c where c.id = campaign_id and c.organizer_id = auth.uid()));
create policy "payouts: admin writes" on public.payouts for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Contact messages ----------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254),
  topic text not null check (topic in ('general','donation','fundraiser','safety')),
  message text not null check (char_length(message) between 10 and 4000),
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
create policy "contact: anyone sends" on public.contact_messages for insert with check (true);
create policy "contact: admin reads" on public.contact_messages for select using (public.is_admin());

-- ---------- Audit log ----------
create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  target_type text not null,
  target_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create policy "audit: admin reads" on public.audit_log for select using (public.is_admin());
create policy "audit: admin writes" on public.audit_log for insert with check (public.is_admin() and actor_id = auth.uid());

-- ---------- Storage: campaign cover images ----------
-- Public bucket: files are served by public URL. No SELECT policy, so the bucket cannot be listed via the API.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('campaign-images', 'campaign-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "campaign images: users upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'campaign-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "campaign images: users delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'campaign-images' and (storage.foldername(name))[1] = auth.uid()::text);
