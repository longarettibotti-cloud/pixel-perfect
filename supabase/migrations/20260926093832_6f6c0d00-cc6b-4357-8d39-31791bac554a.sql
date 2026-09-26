alter table public.settings add column if not exists week_plan jsonb;

create table public.workout_plans (

  id uuid primary key default gen_random_uuid(),

  user_id uuid not null default auth.uid() references auth.users on delete cascade,

  name text not null,

  rounds int not null default 5,

  rest_secs int not null default 60,

  items jsonb not null default '[]'::jsonb,

  position int not null default 0,

  created_at timestamptz not null default now()

);

create table public.custom_exercises (

  id uuid primary key default gen_random_uuid(),

  user_id uuid not null default auth.uid() references auth.users on delete cascade,

  name text not null,

  cue text,

  created_at timestamptz not null default now()

);

do $$ declare t text; begin

  foreach t in array array['workout_plans','custom_exercises'] loop

    execute format('grant select, insert, update, delete on public.%I to authenticated', t);

    execute format('grant all on public.%I to service_role', t);

    execute format('alter table public.%I enable row level security', t);

    execute format('create policy "own_rows" on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t);

  end loop;

end $$;