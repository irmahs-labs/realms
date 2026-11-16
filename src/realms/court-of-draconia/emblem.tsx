import { useId } from "react";

import { useLanguage } from "../../lib/language";
import { AFFINITY_INFO, ELEMENT_INFO, TIER_INFO, bentElement } from "./magic";
import type { Affinity, Element, Tier } from "./rules";

/**
 * An emblem, drawn by the Elemental Magic System's colour rules: the element
 * fills most of it, the affinity colours its glyph, and the tier is only
 * the trim. Its colours are artwork, the same in both themes.
 */
type Glyph = Element | "sun" | "crescent";

const INK = "#16130f";

/** Each glyph on a 96 grid, as shapes to fill. */
const GLYPH_PATHS: Readonly<Record<Glyph, readonly string[]>> = {
  air: [
    "M24 39h34a9 9 0 1 0-9-9h6a3 3 0 1 1 3 3H24z",
    "M24 51h44a9 9 0 1 1-9 9h6a3 3 0 1 0 3-3H24z",
    "M28 69h20v-6H28z",
  ],
  crescent: ["M58 24a26 26 0 1 0 0 48a22 22 0 1 1 0-48z"],
  earth: ["M22 68l20-34 10 15 8-11 16 30z"],
  fire: [
    "M48 22c8 14 20 20 18 38a18 18 0 0 1-36 0c0-10 8-14 10-22 4 8 8 10 10 8 2-6 0-14-2-24z",
  ],
  sun: [
    "M48 34a14 14 0 1 0 0 28a14 14 0 1 0 0-28z",
    "M45 16h6v12h-6zM45 68h6v12h-6zM16 45h12v6H16zM68 45h12v6H68z",
    "M24.7 28.9l4.2-4.2 8.5 8.5-4.2 4.2zM58.6 62.8l4.2-4.2 8.5 8.5-4.2 4.2zM24.7 67.1l8.5-8.5 4.2 4.2-8.5 8.5zM58.6 33.2l8.5-8.5 4.2 4.2-8.5 8.5z",
  ],
  water: ["M48 22s-20 24-20 36a20 20 0 0 0 40 0c0-12-20-36-20-36z"],
};

/** The badge's outline: a hexagon standing on a point. */
const HEX = "M48 3 87 25.5v45L48 93 9 70.5v-45z";
const INNER = "M48 12 79 30v36L48 84 17 66V30z";

interface SealProps {
  /** Its body. */
  fill: string;
  glyph: Glyph;
  glyphFill: string;
  tier: Tier;
  size?: number;
  /** Read out in place of the picture; none when the words beside it say it all. */
  label?: string;
}

const Seal = ({
  fill,
  glyph,
  glyphFill,
  tier,
  size = 72,
  label,
}: SealProps) => {
  // React's ids hold colons, which a url(#…) reference can't.
  const shimmer = `shimmer${useId().replaceAll(/[^\w-]/gu, "")}`;

  const trim =
    tier === "multichrome" ? `url(#${shimmer})` : TIER_INFO[tier].colour;

  // A pale glyph gets a dark edge, so it shows on yellow air too.
  const edge = glyphFill === INK ? "none" : INK;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className="emblem"
      {...(label
        ? { "aria-label": label, role: "img" }
        : { "aria-hidden": true })}
    >
      {tier === "multichrome" ? (
        <defs>
          <linearGradient id={shimmer} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e86f6f" />
            <stop offset="0.25" stopColor="#f2d27a" />
            <stop offset="0.5" stopColor="#7fc8a9" />
            <stop offset="0.75" stopColor="#6f9be8" />
            <stop offset="1" stopColor="#b07fe0" />
          </linearGradient>
        </defs>
      ) : null}
      <path d={HEX} fill={trim} stroke={INK} strokeWidth="2" />
      <path d={INNER} fill={fill} stroke={INK} strokeWidth="1.5" />
      {GLYPH_PATHS[glyph].map((d) => (
        <path
          key={d}
          d={d}
          fill={glyphFill}
          stroke={edge}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
};

interface EmblemProps {
  element: Element;
  affinity: Affinity;
  tier: Tier;
  size?: number;
  /** Whether to read it out: off when the words beside it already say it. */
  labelled?: boolean;
}

/** A draconoid's emblem: its element's colour and glyph, its affinity's, its tier's trim. */
export const Emblem = ({
  element,
  affinity,
  tier,
  size,
  labelled = false,
}: EmblemProps) => {
  const language = useLanguage();

  return (
    <Seal
      fill={ELEMENT_INFO[element].colour}
      glyph={element}
      glyphFill={AFFINITY_INFO[affinity].colour}
      tier={tier}
      size={size}
      label={
        labelled
          ? `${bentElement(element, affinity, language)}, ${TIER_INFO[tier].name[language]}`
          : undefined
      }
    />
  );
};

/**
 * A Court member's seal, at the highest tier: an element's colour for the
 * four seasonal rulers, and light or dark itself for the queen and king.
 */
export const CourtSeal = ({
  wields,
  size,
}: {
  wields: Element | Affinity;
  size?: number;
}) => {
  if (wields === "light") {
    return (
      <Seal
        fill="#fffaf0"
        glyph="sun"
        glyphFill="#d6ae36"
        tier="multichrome"
        size={size}
      />
    );
  }

  if (wields === "dark") {
    return (
      <Seal
        fill={INK}
        glyph="crescent"
        glyphFill="#fffaf0"
        tier="multichrome"
        size={size}
      />
    );
  }

  return (
    <Seal
      fill={ELEMENT_INFO[wields].colour}
      glyph={wields}
      glyphFill="#fffaf0"
      tier="multichrome"
      size={size}
    />
  );
};
