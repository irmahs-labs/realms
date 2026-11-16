-- migrate:up
-- The Court of Draconia's hall: one draconoid per account, shown to everyone.
--
-- user_id is the account's id from the irmahs.dev account service, and
-- never leaves the server; id is the draconoid's own public number, which
-- an admin takes it down by. owner_name is how the hall names its maker,
-- "Irma H.", as it was when they last saved it. The values are the ones in
-- src/realms/court-of-draconia/rules.ts; every draconoid starts at bronze.
create table court_of_draconia_draconoids (
  id bigint generated always as identity primary key,
  user_id uuid not null unique,
  owner_name text not null,
  name text not null check (char_length(name) between 1 and 30),
  element text not null check (element in ('earth', 'water', 'fire', 'air')),
  affinity text not null check (affinity in ('light', 'dark')),
  role text not null check (role in ('wayfarer', 'guardian', 'artificer', 'seer', 'illusionist', 'summoner')),
  tier text not null default 'bronze' check (tier in ('bronze', 'silver', 'gold', 'multichrome')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index court_of_draconia_draconoids_by_created on court_of_draconia_draconoids (created_at desc);

-- migrate:down
drop table court_of_draconia_draconoids;
