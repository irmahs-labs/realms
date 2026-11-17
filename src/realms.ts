import { createElement, lazy } from "react";
import type { ComponentType } from "react";

import {
  BookOfShadowsIcon,
  CourtOfDraconiaIcon,
  PotionBrewingIcon,
  SpellCreatorIcon,
} from "./components/app-icons";
import type { Language } from "./lib/language";

/** What every page screen is given: its own entry's name, for its heading. */
export interface PageProps {
  name: string;
}

/** A page of a realm, at /<realm>/<slug>, or at /<realm> itself when its slug is "". */
export interface RealmPage {
  slug: string;
  name: Record<Language, string>;
  Icon: ComponentType;
  /** The page itself: drawn at once when its code is in, loaded on demand when not. */
  Screen: ComponentType<PageProps>;
  /** Loads the screen's code ahead of time, so opening it later is instant. */
  preload: () => Promise<void>;
}

/**
 * A page entry: its slug, its name in each language, its icon, and its
 * screen. The screen's code loads when the page is first opened, or ahead
 * (preload); once it's in, the page is drawn at once, without the moment
 * of waiting a lazy component always takes, even for code already loaded.
 */
const pageEntry = (
  slug: string,
  name: Record<Language, string>,
  Icon: ComponentType,
  load: () => Promise<{ default: ComponentType<PageProps> }>
): RealmPage => {
  let ready: ComponentType<PageProps> | null = null;

  const loadAndKeep = async () => {
    const loaded = await load();

    ready = loaded.default;

    return loaded;
  };

  const Lazy = lazy(loadAndKeep);

  const Screen = (props: PageProps) => createElement(ready ?? Lazy, props);

  return {
    Icon,
    Screen,
    name,
    preload: async () => {
      await loadAndKeep();
    },
    slug,
  };
};

/**
 * A realm: a world of its own, with its pages. Adding one is an entry here
 * and a folder under src/realms/<slug>/; the hub lists it and the app routes
 * /<slug> and the pages under it, each loading only when it is opened.
 */
export interface Realm {
  slug: string;
  /** Its name and the card's line, in each of the site's languages. */
  name: Record<Language, string>;
  blurb: Record<Language, string>;
  /** The card's filename, on its pill, with a real extension. */
  legend: string;
  Icon: ComponentType;
  /** Its own pages, the first at /<slug>. */
  pages: readonly RealmPage[];
}

export const REALMS: readonly Realm[] = [
  {
    Icon: BookOfShadowsIcon,
    blurb: {
      en: "Your witch profile: the moon tonight, the Wheel of the Year, your birth chart and your numbers. Brew potions and write spells.",
      fr: "Votre profil de sorcière : la lune ce soir, la Roue de l’année, votre thème astral et vos nombres. Préparez des potions et écrivez des sorts.",
    },
    legend: "book-of-shadows.epub",
    name: { en: "Book of Shadows", fr: "Livre des ombres" },
    pages: [
      pageEntry(
        "",
        { en: "Profile", fr: "Profil" },
        BookOfShadowsIcon,
        () => import("./realms/book-of-shadows/book-of-shadows")
      ),
      pageEntry(
        "compatibility",
        { en: "Compatibility calculator", fr: "Calculateur de compatibilité" },
        BookOfShadowsIcon,
        () => import("./realms/book-of-shadows/compatibility-page")
      ),
      pageEntry(
        "birth-chart",
        { en: "Birth chart", fr: "Thème astral" },
        BookOfShadowsIcon,
        () => import("./realms/book-of-shadows/birth-chart-page")
      ),
      pageEntry(
        "moon",
        { en: "Moon and sabbats", fr: "Lune et sabbats" },
        BookOfShadowsIcon,
        () => import("./realms/book-of-shadows/moon-page")
      ),
      pageEntry(
        "sky",
        { en: "Sky", fr: "Ciel" },
        BookOfShadowsIcon,
        () => import("./realms/book-of-shadows/sky-page")
      ),
      pageEntry(
        "tarot",
        { en: "Tarot", fr: "Tarot" },
        BookOfShadowsIcon,
        () => import("./realms/book-of-shadows/tarot-page")
      ),
      pageEntry(
        "potion-brewing",
        { en: "Potion Brewing", fr: "Préparation de potions" },
        PotionBrewingIcon,
        () => import("./realms/book-of-shadows/potion-brewing/potion-brewing")
      ),
      pageEntry(
        "spell-creator",
        { en: "Spell Creator", fr: "Créateur de sorts" },
        SpellCreatorIcon,
        () => import("./realms/book-of-shadows/spell-creator/spell-creator")
      ),
    ],
    slug: "book-of-shadows",
  },
  {
    Icon: CourtOfDraconiaIcon,
    blurb: {
      en: "The dragon realm. Become a draconoid with an element, an affinity and a role, meet everyone else’s, and unleash duo ultimates.",
      fr: "Le royaume des dragons. Devenez draconoïde avec un élément, une affinité et un rôle, rencontrez ceux des autres, et déchaînez des ultimes en duo.",
    },
    legend: "draconia.realm",
    name: { en: "Court of Draconia", fr: "Cour de Draconia" },
    pages: [
      pageEntry(
        "",
        { en: "Court of Draconia", fr: "Cour de Draconia" },
        CourtOfDraconiaIcon,
        () => import("./realms/court-of-draconia/court")
      ),
      pageEntry(
        "draconoid",
        { en: "Your draconoid", fr: "Votre draconoïde" },
        CourtOfDraconiaIcon,
        () => import("./realms/court-of-draconia/draconoid")
      ),
      pageEntry(
        "hall",
        { en: "The hall", fr: "La salle" },
        CourtOfDraconiaIcon,
        () => import("./realms/court-of-draconia/hall")
      ),
      pageEntry(
        "ultimates",
        { en: "Duo ultimates", fr: "Ultimes en duo" },
        CourtOfDraconiaIcon,
        () => import("./realms/court-of-draconia/ultimates")
      ),
    ],
    slug: "court-of-draconia",
  },
];

/** Where a realm's page lives. */
export const pathOf = (realm: Realm, page: RealmPage): string =>
  page.slug ? `/${realm.slug}/${page.slug}` : `/${realm.slug}`;

/** The realm and page at `path` (with no trailing slash), or null for none. */
export const findPage = (
  path: string
): { realm: Realm; page: RealmPage } | null => {
  for (const realm of REALMS) {
    for (const page of realm.pages) {
      if (pathOf(realm, page) === path) {
        return { page, realm };
      }
    }
  }

  return null;
};

/**
 * Loads every page of a realm in the background, once: called when one of
 * them opens, so moving between them doesn't wait for their code the first
 * time. A page that fails to load here still loads when opened.
 */
const preloaded = new Set<string>();

export const preloadRealm = (realm: Realm) => {
  if (preloaded.has(realm.slug)) {
    return;
  }

  preloaded.add(realm.slug);

  for (const page of realm.pages) {
    page.preload().catch(() => null);
  }
};

/** The realm `slug`; every page of a realm finds its own with this. */
export const realmOf = (slug: string): Realm => {
  const realm = REALMS.find((entry) => entry.slug === slug);

  if (!realm) {
    throw new Error(`There is no realm called ${slug}`);
  }

  return realm;
};
