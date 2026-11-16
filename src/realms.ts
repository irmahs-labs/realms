import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

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
  Screen: LazyExoticComponent<ComponentType<PageProps>>;
}

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
      {
        Icon: BookOfShadowsIcon,
        Screen: lazy(() => import("./realms/book-of-shadows/book-of-shadows")),
        name: { en: "Book of Shadows", fr: "Livre des ombres" },
        slug: "",
      },
      {
        Icon: PotionBrewingIcon,
        Screen: lazy(
          () => import("./realms/book-of-shadows/potion-brewing/potion-brewing")
        ),
        name: { en: "Potion Brewing", fr: "Préparation de potions" },
        slug: "potion-brewing",
      },
      {
        Icon: SpellCreatorIcon,
        Screen: lazy(
          () => import("./realms/book-of-shadows/spell-creator/spell-creator")
        ),
        name: { en: "Spell Creator", fr: "Créateur de sorts" },
        slug: "spell-creator",
      },
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
      {
        Icon: CourtOfDraconiaIcon,
        Screen: lazy(() => import("./realms/court-of-draconia/court")),
        name: { en: "Court of Draconia", fr: "Cour de Draconia" },
        slug: "",
      },
      {
        Icon: CourtOfDraconiaIcon,
        Screen: lazy(() => import("./realms/court-of-draconia/draconoid")),
        name: { en: "Your draconoid", fr: "Votre draconoïde" },
        slug: "draconoid",
      },
      {
        Icon: CourtOfDraconiaIcon,
        Screen: lazy(() => import("./realms/court-of-draconia/hall")),
        name: { en: "The hall", fr: "La salle" },
        slug: "hall",
      },
      {
        Icon: CourtOfDraconiaIcon,
        Screen: lazy(() => import("./realms/court-of-draconia/ultimates")),
        name: { en: "Duo ultimates", fr: "Ultimes en duo" },
        slug: "ultimates",
      },
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

/** The realm `slug`; every page of a realm finds its own with this. */
export const realmOf = (slug: string): Realm => {
  const realm = REALMS.find((entry) => entry.slug === slug);

  if (!realm) {
    throw new Error(`There is no realm called ${slug}`);
  }

  return realm;
};
