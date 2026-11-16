/**
 * What a draconoid is made of, and the rules both the page and the server
 * hold it to. From the Elemental Magic System: a draconoid has a basic
 * magic role, an element, a light or dark affinity, and a tier of mastery.
 */
export const ELEMENTS = ["earth", "water", "fire", "air"] as const;

export type Element = (typeof ELEMENTS)[number];

/** Light moves outward (growth, release, radiance), dark inward (depth, density, what is hidden). */
export const AFFINITIES = ["light", "dark"] as const;

export type Affinity = (typeof AFFINITIES)[number];

export const ROLES = [
  "wayfarer",
  "guardian",
  "artificer",
  "seer",
  "illusionist",
  "summoner",
] as const;

export type Role = (typeof ROLES)[number];

/** Mastery, lowest first. Every draconoid starts at bronze. */
export const TIERS = ["bronze", "silver", "gold", "multichrome"] as const;

export type Tier = (typeof TIERS)[number];

export const FIRST_TIER: Tier = "bronze";

export interface Draconoid {
  name: string;
  element: Element;
  affinity: Affinity;
  role: Role;
  tier: Tier;
}

export const MAX_NAME = 30;

/**
 * A name as typed, tidied: spaces at the ends dropped and any run of them
 * made one.
 */
export const tidyName = (name: string): string =>
  name.trim().replaceAll(/\s+/gu, " ");

/**
 * A name everyone in the hall will read: 1 to 30 characters of letters,
 * with spaces, hyphens and apostrophes between them. No digits, full stops
 * or other signs, so a name can't be a link, an address or a slur in
 * numbers.
 */
const NAME = /^\p{L}[\p{L}\p{M}' ’-]*$/u;

export const isValidName = (name: string): boolean =>
  name.length > 0 && name.length <= MAX_NAME && NAME.test(name);

/**
 * The element row and column of the duo ultimate two draconoids unleash
 * together: the light one's element, then the dark one's. Order matters, so
 * light fire with dark earth is not dark fire with light earth. Two of the
 * same affinity unleash nothing.
 */
export const duoOf = (
  one: Pick<Draconoid, "affinity" | "element">,
  other: Pick<Draconoid, "affinity" | "element">
): { light: Element; dark: Element } | null => {
  if (one.affinity === other.affinity) {
    return null;
  }

  return one.affinity === "light"
    ? { dark: other.element, light: one.element }
    : { dark: one.element, light: other.element };
};
