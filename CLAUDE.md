# CLAUDE.md

<!-- The sections down to "Checks before pushing" (the context graph and
the notes included) are the same in every irmahs-labs repo; change them in
irmahs-labs/template first. Replace the
examples and the sections after it for this app. -->

## Git branches

Always pull before making changes: run `git fetch origin` and start from the latest `origin/main` before the first edit.

- On a branch whose PR is open, bring it up to date with `origin/main` first
- On `main`, or on a branch whose PR is already merged, create a new branch from `origin/main` instead

Always name the branch after the feature or fix it contains, never a random or generated name.

- Format: `<type>/<feature-name>` in lowercase kebab-case
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`
- Examples: `feat/court-of-draconi`, `fix/moon-phase-label`, `docs/claude-md`
- If the session assigns a generic branch (for example `claude/<random-words>`), create a feature-named branch instead and push there

## Pull requests

- Never push to `main`. Every change goes in through a pull request.
- Open the PR and stop there: never merge it, not even when CI is green. Irma reviews and clicks merge.
- Deploys run on merge to `main`. Re-run a deploy only when Irma asks.

## The context graph and the notes

Irma's notes on every irmahs.dev app are in her Obsidian notes, the repo irmahs/my-obsidian-notes (checked out at `~/Dev/my-obsidian-notes`), under `Self Hosted/`.

- Before starting work, read `Self Hosted/Context Graph.md` from that repo's `origin/main`: how irmahs.dev and every subdomain fit together (the proxy, the account service, which app talks to which, where each keeps its data). Without a checkout, read it with `gh api repos/irmahs/my-obsidian-notes/contents/Self%20Hosted/Context%20Graph.md -H "Accept: application/vnd.github.raw"`.
- When a change alters what the app is or does, update the notes too:
  - `Apps.md`, the app's section;
  - `Technologies.md`, if it adds, removes or changes a technology;
  - `Context Graph.md`, if it changes a subdomain, a redirect, a link between apps, who asks whom (sign-in, admin checks, internal calls), or where data lives. Update both the graph and the table.
- The notes go in through their own pull request, like any other change: a branch from the notes repo's `origin/main`, never their `main`. The local checkout is often left on an old branch, so work in a `git worktree` of `origin/main` rather than touching it. Link the app's PR in the notes PR.

## Checks before pushing

```sh
npm run check     # Ultracite (oxlint + oxfmt); CI fails on it
npm run typecheck # tsc -b
npm test          # vitest
npm run build     # the site in dist/, the server in dist-server/
```

`server/potions.test.ts` and `server/draconoids.test.ts` run only with `TEST_DATABASE_URL` set (after `npm run db:up`, `postgres://realms@localhost:5436/realms`); the Database workflow runs them in CI.

The PostToolUse hook in `.claude/hooks/ultracite.sh` runs Ultracite and the typecheck on every file you edit.

## What this is

Realms, at realms.irmahs.dev: worlds to step into, a Vite + React site served by a small Node server. It was made on 2026-11-16 from Mini Games (irmahs-labs/minigames), which the Book of Shadows, Booster Potion (now Potion Brewing) and Spell Creator came from. Anything a page remembers for one visitor is in their `localStorage`, read through a zod schema (`src/lib/storage.ts`, keys starting `realms:`) so a damaged or old value falls back to the defaults instead of breaking the page.

Each realm is an entry in `REALMS` (`src/realms.ts`) with its pages, the first at `/<realm>` and the others at `/<realm>/<page>`, and its code in `src/realms/<realm>/`. The hub (`src/hub.tsx`) has one card per realm, naming the pages inside it; `src/app.tsx` routes each address to its page (`findPage`), which loads only when opened. `src/app.tsx` draws `RealmHeader` (`src/components/realm-header.tsx`) above every realm page, outside the page itself, so it stays put while the page under it changes; it is uncluttered and says where you are: the realm's icon and name ("Realms · by Irma HS" under it) and the shared pills, nothing more; under it a quiet way back to every realm, then the realm's pages as tabs, the open one lifted in lime (`aria-current="page"`). On a phone (600px and under) the tabs give way to a ☰ button that opens a side drawer (a native `<dialog>`) with every realm and its pages. A page shows only its own content: its name is on its tab. A page's code loads when it's first opened or, once one of its realm's pages is open, in the background (`preloadRealm`); once loaded it is drawn at once (`pageEntry` in `src/realms.ts`), with no moment of waiting.

To add a realm: a folder under `src/realms/<slug>/` whose pages each default-export a screen taking `PageProps`, with their words in English and French; an entry in `REALMS` with its 40-grid icon in `src/components/app-icons.tsx`; and its rules in plain functions with Vitest tests, apart from the React code.

**Book of Shadows** (`src/realms/book-of-shadows/`): each part of the book is a page of the realm, with no tabs of its own: the profile at `/book-of-shadows` (today, the card of the day, your birth details, your witch card and quiz), the compatibility calculator at `/book-of-shadows/compatibility` (someone else's birth details and how you match), the birth chart at `/book-of-shadows/birth-chart` (your chart, numerology, lunar zodiac and tarot birth cards, `birth-card.ts`), the moon and sabbats at `/book-of-shadows/moon`, the sky at `/book-of-shadows/sky` and the tarot at `/book-of-shadows/tarot`; then Potion Brewing (`potion-brewing/`) at `/book-of-shadows/potion-brewing`, and Spell Creator (`spell-creator/`) at `/book-of-shadows/spell-creator`. Every book page reads and saves the same book through `useBook` (`use-book.ts`). The Magic 8 Ball moved to Mini Games.

- A book saved on Mini Games comes over once in the address's fragment, `#book=<base64url JSON>` (`carry-over.ts`, `encodeBook`), sent by Mini Games' old page; `openBook` keeps it only when this browser's book here is still blank, and always takes the fragment off. Never put a book in a query string or send it to the server.
- Potion Brewing brews on the server (`POST /api/potions/brew`, signed in, own `Origin` only, 30 a minute): `potion-brewing/recipes.ts` and `brewing.ts` are server-only, so the page never carries the answers. Never import them from the page's React code; `npm run build` must leave no recipe name in `dist/assets`. Who brewed what is `server/potions.ts`: the shared book in `potion_brewing_brews`, each player's own solo book in `potion_brewing_solo_brews` (`/api/potions/solo`). `scripts/import-potions.sh` copied Booster Potion's rows over from Mini Games once.
- The profile shows the visitor's witch type from Mini Games' witch quiz (`witch-quiz-card.tsx`). The quiz and its results live on Mini Games, which keeps a signed-in visitor's last result on their account; `GET /api/book-of-shadows/witch-quiz` asks Mini Games for it (`server/witch-quiz.ts`, `GET /api/quizzes/what-type-of-witch/result` at `MINIGAMES_INTERNAL_URL`, `http://minigames:3000` on the shared `proxy` network) with the visitor's own cookie, and passes the answer on, each witch named in both languages. Never copy the quiz here, and never read Mini Games' browser storage: a result taken signed out stays there. "Take the quiz" links to minigames.irmahs.dev/quizzes/what-type-of-witch.
- Spell Creator is in English only, because its spells rhyme in English: its own words are English, marked `lang="en"`, and in French a note says so; its name and the header's ways back are still in both. It hears words through the CMU Pronouncing Dictionary (the `cmu-pronouncing-dictionary` package), which `vite.config.ts` packs at build time into the `virtual:pronunciations` module (`pronunciations.ts`); only Spell Creator loads it (`dictionary.ts`). The tiers are `spell.ts`, the rhymes `rhyme.ts`.

**Court of Draconia** (`src/realms/court-of-draconia/`), the dragon realm, from Irma's Elemental Magic System: the Court itself at `/court-of-draconia` (the visitor's draconoid, the six Court members, how the magic works), the draconoid maker at `/court-of-draconia/draconoid`, the hall of everyone's draconoids at `/court-of-draconia/hall`, and the sixteen duo ultimates at `/court-of-draconia/ultimates`.

- A draconoid is half human, half dragon: a name, an element (earth, water, fire, air), a light or dark affinity, a basic magic role (wayfarer, guardian, artificer, seer, illusionist, summoner) and a tier (bronze, silver, gold, multichrome). `rules.ts` holds the choices and the rules both sides apply; `magic.ts` everything the world says, in English and French (each element's base form and three mirrored light and dark powers, the roles and their skills, the ultimates, the Court). French role names fit anyone, whatever their gender (Nomade, Sentinelle, Alchimiste, Oracle, Illusionniste, Mage d'invocation).
- Each account has one draconoid, saved on the server in `court_of_draconia_draconoids` (`server/draconoids.ts`) so the hall can show it to everyone, under its maker's short name ("Irma H."), never their account. Saving is signed in, own `Origin` only, 20 a minute (`PUT /api/court-of-draconia/me`). Every draconoid starts at bronze and the page can never set a tier: rising comes later. Names are 1 to 30 letters with spaces, hyphens or apostrophes between them (`isValidName`), so a name can't carry a link or digits.
- Only admins take someone's draconoid down (`DELETE /api/court-of-draconia/draconoids/:id`): `askAdminAccess` in `server/session.ts` asks the account service's `GET /api/access/alma-housila`, reusing Alma Housila's `APP_ACCESS` list, as Mini Games does; never decide who is an admin in this repo.
- A duo ultimate takes one light and one dark draconoid, by the light one's element and then the dark one's (`duoOf`): order matters, and two of one affinity unleash nothing.
- Emblems (`emblem.tsx`) follow the system's colour rules: the element fills most of it, the affinity colours its glyph, the tier is only the trim (multichrome shimmers). They are artwork, the same in both themes. The Court's seals are at multichrome. Keep the world original: no names, places or characters from existing franchises.

The server (`server/`, Hono on Node) serves the built site and `/api`. Who someone is comes only from the shared irmahs.dev sign-in cookie, asked of the account service (irmahs-labs/auth) by `server/session.ts`; never from anything the browser sends. Anything that writes refuses any `Origin` but the site's own, since the cookie is shared by every `*.irmahs.dev` page.

The schema is the dbmate migrations in `db/migrations/`. Every table is named after its page's or realm's slug in snake_case (`potion_brewing_brews`, `court_of_draconia_draconoids`), so the database says whose each table is. Never edit a migration that is already merged: add a new one with `npm run db:new -- <name>`, with a matching `-- migrate:down`.

## Languages

The site reads in English or French. The choice is `src/lib/language.ts`: kept in localStorage and in a `lang` cookie on `irmahs.dev` that every irmahs.dev app reads and writes, so one pick carries across the apps; the header's EN/FR pill (`src/components/language-toggle.tsx`) switches it. Every string a visitor sees has both versions, in a `COPY = { en, fr }` object beside the component that shows it (`useCopy(COPY)`), and a realm's and page's `name` and `blurb` in `REALMS` are `{ en, fr }`. The server's refusals stay English sentences and `src/lib/server-words.ts` gives each its French. Potion Brewing's notes are `noteFr` beside `note` in the server-only recipes; its ingredients and clues are read back in French from `pantry-fr.ts`. The Book of Shadows' data stays in English, and `french.ts` (one file per topic in `french/`) gives each line its French through `say`; its own words use `tr(english, french)`.

## Names

The name people see is `APP_NAME` in `src/lib/brand.ts`. The image, the network alias, the database and the server folder are all `realms` (`/srv/realms`).

## Design

The site is styled in Cute Matcha's app look (the _Apps_ section of Irma's Cute Matcha design system), in Light Matcha and Dark Matcha (a mid-tone matcha page, cards a step lighter, and the header, buttons and fields a darker well, with near-black outlines and shadows in both themes). Colours are the system's role tokens, named by job (`ground`, `panel`, `header`, `raised`, `text`, `text-muted`, `accent`, `pop`, `strong`, `selected`, …), at the top of `src/styles.css`: Light Matcha on `:root`, Dark Matcha on `:root[data-theme="dark"]`. Pick a token by what the thing is, never a hex: the primary button is `pop`, the yellow accent kept for the one call to action on a screen (48px tall, sinking into its hard shadow when pressed), a chosen option or a switch that is on is `selected`, legends are `strong`. The inline script in `index.html` sets `data-theme` before the first paint, from the visitor's saved choice or else the device's setting, and `src/lib/theme.ts` keeps it (the header's sun/moon toggle saves a choice).

Every page opens with the **Header** (`src/components/header.tsx`): its 40px app icon (`src/components/app-icons.tsx`, in fixed Light Matcha colours with a `text` rim), its name in Fredoka with "by Irma HS" under it, the page's own buttons in the middle, then the theme toggle and the **account pill** (`src/components/account-button.tsx`): "sign in" with Google's mark, or the person's picture and first name, linking to the IrmaHS Labs account page. It asks `auth.irmahs.dev` who is signed in from the browser (`src/lib/session.ts`); on localhost the service doesn't answer, so the pill shows "sign in". Fredoka sets titles and panel names, Nunito Sans everything else. Panels are flat, with a 2px outline and a filename on a `strong` pill (`.legend`), always with an extension that exists (`.exe`, `.log`, `.csv`, `.txt`, `.epub`, …); only the one action to press next (`.btn--primary`) carries the hard shadow. Every page closes with the **Footer** (`src/components/footer.tsx`, rendered by `App`): "more apps at irmahs.dev", the one thing the Header doesn't say. Corners are concentric: panels and realm cards are `--radius-panel` (20px) with 16px of padding on top and 12px elsewhere, and what sits inside takes `--radius-field` (8px). A realm card is the link itself, with an arrow at the end of its name and no "play" label. Screen icons (`src/lib/icon.tsx`) are a 24 grid at 2px. App icons draw with only three colours, as the Book of Shadows' does: the lime tile (`#d4dd9c`, with its lighter green `#afc584` for details), the cream `#fff3cf` and the dark green `#2f3b34`; never yellow, gold, red or another lime. The favicon is the Realms portal (`RealmsIcon`), `public/favicon.svg`.

## Deploy

Merging to `main` runs `.github/workflows/deploy.yml`, which SSHes to the server as `deploy`, resets `/srv/realms` to `main`, and with `compose.prod.yaml` starts Postgres, runs pending migrations and rebuilds the site's container. It needs the `REALMS_POSTGRES_PASSWORD` secret. The shared Caddy in `irmahs-labs/proxy` routes `realms.irmahs.dev` to it. `compose.yaml` is for local development only: a database and dbmate (on port 5436).
