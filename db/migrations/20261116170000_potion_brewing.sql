-- migrate:up
-- Potion Brewing's recipe books, in the Book of Shadows. They were Booster
-- Potion's in Mini Games (booster_potion_brews and booster_potion_solo_brews
-- there), and scripts/import-potions.sh copies their rows over once.
--
-- potion is the recipe's name in
-- src/realms/book-of-shadows/potion-brewing/recipes.ts, so a renamed recipe
-- starts again with nobody having brewed it. user_id is the account's id from
-- the irmahs.dev account service.

-- The shared book: who has brewed each potion. The first to brew one has
-- their name on its page for everyone; everyone after is counted.
create table potion_brewing_brews (
  potion text not null,
  user_id uuid not null,
  -- As shown to everyone, "Irma H.", as it was when they brewed it.
  name text not null,
  -- The first time they brewed it, which decides who was first.
  brewed_at timestamptz not null default now(),
  -- The latest time they brewed it, for the book's "last brew".
  last_brewed_at timestamptz not null default now(),
  primary key (potion, user_id)
);

create index potion_brewing_brews_by_last on potion_brewing_brews (last_brewed_at desc);

-- Played solo: each player's own book, kept on their account rather than in
-- one browser, apart from the shared one. Starting over deletes their rows.
create table potion_brewing_solo_brews (
  user_id uuid not null,
  potion text not null,
  -- When they first brewed it, shown on the page.
  found_at timestamptz not null default now(),
  primary key (user_id, potion)
);

-- migrate:down
drop table potion_brewing_solo_brews;
drop table potion_brewing_brews;
