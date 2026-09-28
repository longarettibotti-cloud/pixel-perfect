alter table public.settings add column if not exists bottle_ml int not null default 800;

alter table public.settings alter column water_goal set default 2400;

update public.settings set water_goal = water_goal * 250 where water_goal < 50;

update public.daily_checkins set water = water * 250 where water > 0 and water < 50;