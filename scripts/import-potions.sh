#!/bin/sh
# One time, on the server as `deploy`, once Realms is deployed: copies Booster
# Potion's recipe books from Mini Games' database into Potion Brewing's here,
# so everyone's finds and the names in the shared book carry over.
#
#   sh /srv/realms/scripts/import-potions.sh
#
# It reads from /srv/minigames and writes to /srv/realms, each through its own
# compose.prod.yaml (and so its own .env). It refuses to run if Potion
# Brewing's books already have rows, so it can never copy twice; Mini Games'
# tables are left as they are.
set -eu

minigames() { docker compose -f /srv/minigames/compose.prod.yaml "$@"; }
realms() { docker compose -f /srv/realms/compose.prod.yaml "$@"; }

rows=$(realms exec -T db psql -U realms -d realms -tA -c \
  "select (select count(*) from potion_brewing_brews) + (select count(*) from potion_brewing_solo_brews)")

if [ "$rows" != "0" ]; then
  echo "Potion Brewing's books already have $rows rows: nothing copied." >&2
  exit 1
fi

copy() {
  from=$1 to=$2 columns=$3
  minigames exec -T db psql -U minigames -d minigames -v ON_ERROR_STOP=1 \
    -c "\\copy $from ($columns) to stdout" |
    realms exec -T db psql -U realms -d realms -v ON_ERROR_STOP=1 \
      -c "\\copy $to ($columns) from stdin"
}

copy booster_potion_brews potion_brewing_brews \
  "potion, user_id, name, brewed_at, last_brewed_at"
copy booster_potion_solo_brews potion_brewing_solo_brews \
  "user_id, potion, found_at"

realms exec -T db psql -U realms -d realms -tA -c \
  "select 'shared book: ' || count(*) from potion_brewing_brews
   union all
   select 'solo books: ' || count(*) from potion_brewing_solo_brews"
