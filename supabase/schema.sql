create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  difficulty text not null check (difficulty in ('간단', '노력', '정성')),
  description text,
  used_ingredients jsonb not null default '[]'::jsonb,
  required_ingredients jsonb not null default '[]'::jsonb,
  cooking_time_minutes integer,
  tips jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  total_vote_count integer not null default 0 check (total_vote_count >= 0),
  total_save_count integer not null default 0 check (total_save_count >= 0),
  created_by_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint saved_recipes_user_recipe_unique unique (user_id, recipe_id)
);

create table if not exists public.recipe_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint recipe_votes_user_recipe_unique unique (user_id, recipe_id)
);

create index if not exists recipes_difficulty_idx on public.recipes (difficulty);
create index if not exists recipes_vote_save_sort_idx on public.recipes (total_vote_count desc, total_save_count desc, created_at desc);
create index if not exists recipes_save_vote_sort_idx on public.recipes (total_save_count desc, total_vote_count desc, created_at desc);
create index if not exists recipes_created_at_idx on public.recipes (created_at desc);
create index if not exists recipes_search_idx
  on public.recipes
  using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, '')));
create index if not exists recipes_used_ingredients_idx on public.recipes using gin (used_ingredients);
create index if not exists recipes_required_ingredients_idx on public.recipes using gin (required_ingredients);

create index if not exists saved_recipes_user_created_idx on public.saved_recipes (user_id, created_at desc);
create index if not exists saved_recipes_recipe_idx on public.saved_recipes (recipe_id);

create index if not exists recipe_votes_user_created_idx on public.recipe_votes (user_id, created_at desc);
create index if not exists recipe_votes_recipe_idx on public.recipe_votes (recipe_id);

drop trigger if exists set_recipes_updated_at on public.recipes;
create trigger set_recipes_updated_at
before update on public.recipes
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nickname, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do update
  set
    nickname = excluded.nickname,
    avatar_url = excluded.avatar_url;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id, nickname, avatar_url)
select
  users.id,
  coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name',
    split_part(coalesce(users.email, ''), '@', 1)
  ),
  coalesce(
    users.raw_user_meta_data ->> 'avatar_url',
    users.raw_user_meta_data ->> 'picture'
  )
from auth.users as users
on conflict (id) do nothing;

create or replace function public.sync_recipe_engagement_counts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_recipe_id uuid;
  vote_delta integer := 0;
  save_delta integer := 0;
begin
  if tg_table_name = 'recipe_votes' then
    target_recipe_id := coalesce(new.recipe_id, old.recipe_id);

    if tg_op = 'INSERT' then
      vote_delta := 1;
    elsif tg_op = 'DELETE' then
      vote_delta := -1;
    end if;
  elsif tg_table_name = 'saved_recipes' then
    target_recipe_id := coalesce(new.recipe_id, old.recipe_id);

    if tg_op = 'INSERT' then
      save_delta := 1;
    elsif tg_op = 'DELETE' then
      save_delta := -1;
    end if;
  end if;

  update public.recipes
  set
    total_vote_count = greatest(total_vote_count + vote_delta, 0),
    total_save_count = greatest(total_save_count + save_delta, 0),
    updated_at = now()
  where id = target_recipe_id;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists recipe_votes_count_insert on public.recipe_votes;
create trigger recipe_votes_count_insert
after insert on public.recipe_votes
for each row
execute function public.sync_recipe_engagement_counts();

drop trigger if exists recipe_votes_count_delete on public.recipe_votes;
create trigger recipe_votes_count_delete
after delete on public.recipe_votes
for each row
execute function public.sync_recipe_engagement_counts();

drop trigger if exists saved_recipes_count_insert on public.saved_recipes;
create trigger saved_recipes_count_insert
after insert on public.saved_recipes
for each row
execute function public.sync_recipe_engagement_counts();

drop trigger if exists saved_recipes_count_delete on public.saved_recipes;
create trigger saved_recipes_count_delete
after delete on public.saved_recipes
for each row
execute function public.sync_recipe_engagement_counts();

alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.saved_recipes enable row level security;
alter table public.recipe_votes enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "recipes_public_read" on public.recipes;
create policy "recipes_public_read"
on public.recipes
for select
using (true);

drop policy if exists "saved_recipes_select_own" on public.saved_recipes;
create policy "saved_recipes_select_own"
on public.saved_recipes
for select
using (auth.uid() = user_id);

drop policy if exists "saved_recipes_insert_own" on public.saved_recipes;
create policy "saved_recipes_insert_own"
on public.saved_recipes
for insert
with check (auth.uid() = user_id);

drop policy if exists "saved_recipes_delete_own" on public.saved_recipes;
create policy "saved_recipes_delete_own"
on public.saved_recipes
for delete
using (auth.uid() = user_id);

drop policy if exists "recipe_votes_select_own" on public.recipe_votes;
create policy "recipe_votes_select_own"
on public.recipe_votes
for select
using (auth.uid() = user_id);

drop policy if exists "recipe_votes_insert_own" on public.recipe_votes;
create policy "recipe_votes_insert_own"
on public.recipe_votes
for insert
with check (auth.uid() = user_id);

drop policy if exists "recipe_votes_delete_own" on public.recipe_votes;
create policy "recipe_votes_delete_own"
on public.recipe_votes
for delete
using (auth.uid() = user_id);
