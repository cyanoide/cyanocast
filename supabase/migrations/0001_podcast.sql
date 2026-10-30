create table public.podcast (
  id int primary key default 1 check (id = 1),
  title text not null,
  description text not null,
  link text not null,
  language text not null default 'fr',
  author text not null,
  owner_email text not null,
  image_url text not null,
  category text not null default 'Technology',
  explicit boolean not null default false
);

create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  guid text not null unique default gen_random_uuid()::text,
  title text not null,
  description text not null default '',
  audio_url text not null,
  audio_bytes bigint not null,
  audio_type text not null default 'audio/mpeg',
  duration_seconds int not null,
  image_url text,
  episode_number int,
  season_number int,
  explicit boolean,
  published_at timestamptz not null default now(),
  published boolean not null default true
);

create index episodes_published_at_idx on public.episodes (published_at desc);

alter table public.podcast enable row level security;
alter table public.episodes enable row level security;

create policy "podcast lisible" on public.podcast for select using (true);
create policy "episodes publiés lisibles" on public.episodes
  for select using (published and published_at <= now());

-- Buckets publics pour l'audio et les images
insert into storage.buckets (id, name, public)
values ('audio', 'audio', true), ('images', 'images', true)
on conflict (id) do nothing;
