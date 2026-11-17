# Realms

Worlds to step into, at [realms.irmahs.dev](https://realms.irmahs.dev). The hub at `/` has one card per realm, and each realm has its pages at `/<realm>/…`.

## Book of Shadows

The witch's realm, at `/book-of-shadows`, moved here from [Mini Games](https://minigames.irmahs.dev) with two of its games. Each part of the book is a page of its own, one tab in the header, so nothing is more than a click away.

**The Book**. A witch's profile, worked out in the browser from [Astronomy Engine](https://github.com/cosinekitty/astronomy)'s ephemeris. Six pages, yours first:

- **Profile** (`/book-of-shadows`):
  - **Today**: the Moon's phase and sign, the next sabbat, the lunar year (Year of the Fire Horse, 丙午) and the next lunar festival, and the sky: where the Sun and the Moon are, which planets are retrograde and until when, the next retrograde to start and the next eclipse.
  - **Card of the day**: one tarot card, pulled once a day; the day turns at midnight Paris time, wherever you are.
  - **Your details**, in a row across the page: name, birth date, time and place. Type a town and pick it from the list: the built-in places come up at once, and any other town on the Earth is looked up as you type ([Open-Meteo](https://open-meteo.com/en/docs/geocoding-api)'s free geocoding, no key), which fills in its coordinates and time zone. Only the town's name is sent; the coordinates can still be typed in by hand.
  - **The witch card** drawn from them: your Sun, Moon and rising signs, your craft (Candle, Green, Storm or Sea Witch, from the element your chart leans on), your life path, your Lunar zodiac animal, the moon you were born under, the sabbat season of your birthday, and your elements.
- **Compatibility calculator** (`/book-of-shadows/compatibility`): someone else's details and their own witch card, then how the two of you match three ways, each a score you can jump to and its reasons, below.
- **Birth chart** (`/book-of-shadows/birth-chart`): everything your birth says, on one page.
  - **Your chart**: the chart as a wheel and a table, every planet's sign, degree and whole-sign house, and what your Sun, Moon and rising say. Without a birth time there is no rising sign or houses, and the card says when the Moon changed signs that day. On the compatibility calculator: your charts side by side (synastry), their Suns' elements and the aspects between your Suns, Moons, Venuses, Marses and Mercuries, as a score and its reasons.
  - **Numerology**: Pythagorean life path, expression, soul urge, personality, birthday and maturity numbers, master numbers kept, and your personal year. On the compatibility calculator: how your life paths and your names' numbers get on (the 1-5-7, 2-4-8 and 3-6-9 families).
  - **Lunar Zodiac**: Shēngxiào (生肖), the Chinese zodiac. Your animal and element, kept simple to your calendar year (with a note when tradition, which turns the year at the Lunar New Year or in Cambodia at Khmer New Year, says otherwise), your inner animal from your birth hour, your best matches and your clash; this year's animal, and when the Lunar New Year (worked out from the new moons and the solar terms, on Beijing time) and Khmer New Year fall; all twelve with their Earthly Branches, Khmer names and years; and the ten Heavenly Stems (天干) with their elements, images and years, this year's, your year's and your day master (the stem of the day you were born) picked out. On the compatibility calculator: your animals (trines, secret friends, clashes) and your elements together.
  - **Birth cards**: your birth date added up (month, day and year, then digit by digit, until it is 22 or less) lands on a major arcana, your tarot birth card; a two-digit card comes with its pair, its digits added once more (19, The Sun, and 10, the Wheel of Fortune).
- **Moon and sabbats** (`/book-of-shadows/moon`):
  - **Moon**: tonight's moon (its phase, how much is lit, its sign, its Buddhist lunar date, and the next full and new moons) and a month of moons, with the exact phases on their days and each full moon's traditional name (Harvest, Hunter's, Blue…), in your own time zone. The month is also the Buddhist lunar calendar as Cambodia keeps it (Chhankitek, from [`@thyrith/momentkh`](https://github.com/ThyrithSor/momentkh)): each day's lunar date, the holy days (Thngai Sel), and the festivals (the Lunar New Year, Meak Bochea, Khmer New Year, Visak Bochea, Royal Ploughing, Pchum Ben and Bon Om Touk) on their days.
  - **Sabbats**: the Wheel of the Year, turned to today, and the eight sabbats of any year with their dates, what each is, how to keep it, its colours and symbols. The solstices and equinoxes are the days they fall on where you are; the fire festivals keep their traditional days, with the day the Sun is really halfway alongside. A switch turns the wheel round for the southern hemisphere.
- **Sky** (`/book-of-shadows/sky`): where every planet is today and which are retrograde, then a year's retrogrades, from the day each planet stations to the day it turns direct, and its eclipses.
- **Tarot** (`/book-of-shadows/tarot`): all 78 cards of a Rider–Waite–Smith deck, each read upright and reversed. **Draw a card** at the top, or choose one a step at a time (major or minor arcana; for a minor card the suit; the card; then upright or reversed), and read it. A guide explains how to read them: the arcana, the suits and their elements, the numbers, the court cards.

**Potion Brewing** (`/book-of-shadows/potion-brewing`). A potion-mixing game, once Mini Games' Booster Potion, first from [Wellness Witch](https://github.com/irmahs/WellnessWitch). Its 115 potions are real wellness shots, teas and tonics, each cut down to its two to four core ingredients and linked to the recipe it comes from: ginger and turmeric shots, beet and green shots, switchel, fire cider and oxymels, jamu, golden milk, masala chai, guk po (pu-erh with chrysanthemum), kadha, sorrel, yuja-cha, jujube and goji teas, agua frescas and more. Every ingredient is in at least two potions. Put any two to four ingredients in the cauldron and brew. A few come more than one way, and you pick which in the cauldron: ginger fresh or dried (a ginger shot takes fresh, a ginger tea dried), turmeric fresh or powder, cinnamon as a stick or powder, mint fresh or dried, wheatgrass fresh or powder. Every ingredient has a one-line tip on what it is known for ("Ginger: eases nausea, with anti-inflammatory compounds"), shown when you hover it and under it in the cauldron. The teas go by their colour as China names them: white, green, red (what English calls black tea) and black (dark, aged tea such as pu-erh), and each tip names two that are easy to buy. The right mix makes a potion, with a fact or a caution about it, like cooking elderberries. Anything else is a Mystery Potion, with a hint: the form to change when only that is wrong, or else how many of the ingredients are in the closest potion nobody has found yet, its name, and the kinds of ingredient it still needs ("2 of these 4 are in Ember's Embrace. It still needs a fruit and a spice.").

There is one grimoire, the recipe book, shared by everyone. Brewing takes an irmahs.dev account: the first person to brew a potion puts their name and the date on its page ("First brewed by Irma H. on 28 Oct 2026, and 3 more", which opens the list of everyone who brewed it), under it the latest brew by anyone ("Last brewed by Ben C. on 29 Oct 2026", or "Last brewed by no one"), and anyone can read the grimoire, signed in or not. Its corner shows the last brew by anyone ("Last brew: Ben C., Ember's Embrace, 5 min ago"), and it refreshes every 30 seconds. A page lists its ingredients shelf by shelf, alphabetically on each. Pages nobody has found yet show only the kinds of ingredient they take. The server brews, so the recipes never reach the browser, and it takes at most 30 brews a minute from anyone.

Potion Brewing can also be played solo: **My own grimoire** keeps a grimoire of your own on your irmahs.dev account, on every device. Its pages unlock only when you brew them, its hints point at the potions you have still to find, each page shows the day you found it, and **Start over** empties it. Solo brews never go in the shared grimoire.

**Spell Creator** (`/book-of-shadows/spell-creator`). Write two rhyming lines and cast them as a spell: the better the rhyme, the more powerful the spell. It hears words through the [CMU Pronouncing Dictionary](https://github.com/words/cmu-pronouncing-dictionary), so it is in English only.

### Coming over from Mini Games

A browser keeps each site's `localStorage` apart, so a Book of Shadows saved on minigames.irmahs.dev can't be read here. Mini Games' old page sends it over instead, in the address's fragment (`/book-of-shadows#book=…`, which never reaches a server): Realms keeps it when its own book in that browser is still blank, never writes over one already filled in, and takes the fragment off the address. The format is `encodeBook` in `src/realms/book-of-shadows/carry-over.ts`.

The potion books, on the server, are copied once by `scripts/import-potions.sh` (see Deploy).

## Court of Draconia

The dragon realm, at `/court-of-draconia`, from the Elemental Magic System. Every visitor can become a **draconoid**, half human and half dragon: a name, an element (earth, water, fire or air), a light or dark affinity, and a basic magic role (wayfarer, guardian, artificer, seer, illusionist or summoner). Light moves outward (growth, release, radiance), dark inward (depth, density, what is hidden); every light power has a mirrored dark one. Every draconoid starts at **bronze**; silver, gold and multichrome come later.

- **The Court** (`/court-of-draconia`): your draconoid, the six original elemental wielders (Queen Ljósa, King Tenebrus, and a dragon ruler for each season: Chunlin, Žarko, Ehecatl and Himani), and how the magic works.
- **Your draconoid** (`/court-of-draconia/draconoid`): make or remake it, with a live card of its emblem, powers, skills and duo ultimates. Saving takes an irmahs.dev account; each account has one draconoid.
- **The hall** (`/court-of-draconia/hall`): everyone's draconoids, newest first, by element and affinity. With a draconoid of your own, pick anyone of the other affinity to unleash a duo ultimate with them. Admins (Alma Housila's `APP_ACCESS` list in irmahs-labs/auth, as for Mini Games) can take one down.
- **Duo ultimates** (`/court-of-draconia/ultimates`): the sixteen catastrophes a light and a dark draconoid unleash together, light element down the side, dark across the top.

Emblems follow the system's colours: the element fills most of it (green earth, blue water, red fire, yellow air), the affinity colours its glyph (white or black), and the tier is the trim (bronze, silver, gold, or a shifting multichrome).

## Where things are kept

The Book of Shadows (both people's birth details and the card of the day included) keeps everything in the browser's `localStorage`, until the visitor deletes it or clears their site data. Potion Brewing's recipe books and the Court of Draconia's draconoids live on the server. The witch type on the profile comes from the witch quiz on [Mini Games](https://minigames.irmahs.dev/quizzes/what-type-of-witch), which keeps a signed-in visitor's last result on their account; Realms' server asks Mini Games for it with the visitor's cookie and keeps nothing of it.

## Develop

```sh
npm install
npm run dev       # http://localhost:5173
npm test
npm run build     # the site in dist/, the server in dist-server/
```

Brewing needs the server, its database and the account service as well (Node 22+ and Docker):

```sh
cp .env.example .env
npm run db:up     # Postgres on localhost:5436, migrations applied
npm run dev:api   # the server on :3002; Vite forwards /api to it
```

and [irmahs-labs/auth](https://github.com/irmahs-labs/auth) running on `localhost:3001` (its README says how), so there is someone to sign in as. `TEST_DATABASE_URL=postgres://realms@localhost:5436/realms npm test` also runs the recipe books' and the hall's database tests, which are skipped otherwise. The local database has no password: it only answers this machine.

The server (`server/`) is [Hono](https://hono.dev/) on Node. It serves the built site, `/api/me`, `/api/potions` (the shared recipe book), `/api/potions/brewers`, `/api/potions/brew`, `/api/potions/solo` and `/api/potions/solo/brew` (each player's own book), and the Court of Draconia's `/api/court-of-draconia/hall`, `/api/court-of-draconia/me` (make, remake or let go of your draconoid) and `/api/court-of-draconia/draconoids/:id` (admins only). It learns who is brewing from the shared irmahs.dev sign-in cookie, by asking the account service, and takes brews only from the site itself. The books go in its own Postgres database (`db/migrations/`, applied by [dbmate](https://github.com/amacneil/dbmate)). Potion Brewing's recipes, `src/realms/book-of-shadows/potion-brewing/recipes.ts`, are read only by the server, which brews.

## Deploy

Merging to `main` deploys. The workflow SSHes to the irmahs.dev server and resets `/srv/realms` to `main`; there, with `compose.prod.yaml`, Postgres starts, pending migrations run, and the site is rebuilt and started. It joins the shared `proxy` network as `realms`, where it also reaches the account service as `auth:3001`. Caddy in [irmahs-labs/proxy](https://github.com/irmahs-labs/proxy) serves it at realms.irmahs.dev.

Secrets (Settings → Secrets and variables → Actions):

| Secret | What |
| --- | --- |
| `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `DEPLOY_HOST` | Organization level, shared with the other repos |
| `REALMS_POSTGRES_PASSWORD` | The database's password (the recipe books and the hall), `openssl rand -base64 32`. Read only when the database is first created |

### First setup (one time)

1. Cloudflare: proxied `A` and `AAAA` records for `realms` pointing at the server.
2. On the server, as the admin user: `sudo mkdir /srv/realms && sudo chown deploy:deploy /srv/realms`.
3. Add the `REALMS_POSTGRES_PASSWORD` secret above.
4. Merge here; the deploy clones the repo into `/srv/realms` and starts the database and the site.
5. Merge the `realms.irmahs.dev` block in irmahs-labs/proxy's `caddy/Caddyfile`.
6. Once, as `deploy`: `sh /srv/realms/scripts/import-potions.sh`, which copies Booster Potion's books from Mini Games' database. It refuses to run twice.

## License

MIT
