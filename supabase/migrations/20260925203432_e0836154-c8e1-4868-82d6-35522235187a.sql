create table public.settings (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  read_goal_min int not null default 20,
  bed_target text not null default '22:30',
  wake_target text not null default '06:00',
  water_goal int not null default 8,
  weight_goal numeric not null default 90
);
create table public.daily_checkins (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  day date not null,
  bed text, wake text, sleep_quality int,
  oracao boolean not null default false,
  terco boolean not null default false,
  exame boolean not null default false,
  water int not null default 0,
  vitd boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  day date not null, ts timestamptz not null default now(),
  workout text not null, rounds int not null default 0, secs int not null default 0,
  knee int, note text
);
create table public.stretch_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  day date not null, ts timestamptz not null default now(), secs int not null default 0
);
create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, author text,
  current_page int not null default 0, total_pages int not null default 0,
  status text not null default 'lendo' check (status in ('lendo','quero','lido')),
  color text, created_at timestamptz not null default now()
);
create table public.reading_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  book_id uuid references public.books on delete set null,
  day date not null, ts timestamptz not null default now(),
  secs int not null default 0, pages int not null default 0, note text
);
create table public.weights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  day date not null, ts timestamptz not null default now(), kg numeric not null
);
create table public.confessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  day date not null, ts timestamptz not null default now()
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  title text not null, done boolean not null default false, due date,
  created_at timestamptz not null default now(), done_at timestamptz
);

do $$ declare t text; begin
  foreach t in array array['settings','daily_checkins','workouts','stretch_sessions','books','reading_sessions','weights','confessions','tasks'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own_rows" on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
  end loop;
end $$;