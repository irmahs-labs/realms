/**
 * The 40 × 40 app icons, drawn flat in Cute Matcha's Light Matcha colours,
 * the same in both themes: an icon is also a favicon. Each has a 1.5px
 * `text` rim, which disappears in Light Matcha and turns cream in Dark
 * Matcha, so its edge reads on either header. The Realms portal is also
 * public/favicon.svg.
 */

/** An arched portal, open on a night sky with a crescent moon and a star. */
export const RealmsIcon = ({ size = 40 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 40 40">
    <rect
      x="3"
      y="3"
      width="34"
      height="34"
      rx="9"
      fill="#d4dd9c"
      stroke="var(--text)"
      strokeWidth="1.5"
    />
    <path d="M11 32V18a9 9 0 0 1 18 0v14z" fill="#2f3b34" />
    <path d="M9 32h22" stroke="#2f3b34" strokeWidth="2" strokeLinecap="round" />
    <path d="M21.5 14a4 4 0 1 0 0 7a3.2 3.2 0 1 1 0-7z" fill="#fff3cf" />
    <path
      d="M16 23.5l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5z"
      fill="#fff3cf"
    />
  </svg>
);

/** A corked potion bottle, half full, with two bubbles rising. */
export const PotionBrewingIcon = () => (
  <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40">
    <rect
      x="3"
      y="3"
      width="34"
      height="34"
      rx="9"
      fill="#d4dd9c"
      stroke="var(--text)"
      strokeWidth="1.5"
    />
    <path
      d="M17 10h6v6.2a9 9 0 1 1-6 0z"
      fill="#fff3cf"
      stroke="#2f3b34"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M11.05 25h17.9a9 9 0 0 1-17.9 0z"
      fill="#afc584"
      stroke="#2f3b34"
      strokeWidth="1.2"
    />
    <rect x="16" y="6.5" width="8" height="3.5" rx="1" fill="#2f3b34" />
    <circle cx="18" cy="29" r="1.3" fill="#fff3cf" />
    <circle cx="22.5" cy="27.5" r="1" fill="#fff3cf" />
  </svg>
);

/** A spellbook, shut, with a crescent moon and a star on its cover. */
export const BookOfShadowsIcon = () => (
  <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40">
    <rect
      x="3"
      y="3"
      width="34"
      height="34"
      rx="9"
      fill="#d4dd9c"
      stroke="var(--text)"
      strokeWidth="1.5"
    />
    <rect x="11" y="8" width="19" height="24" rx="2.5" fill="#2f3b34" />
    <path d="M14.5 8v24" stroke="#afc584" strokeWidth="1.5" />
    <path d="M23.5 13.5a5 5 0 1 0 0 9a4 4 0 1 1 0-9z" fill="#fff3cf" />
    <path
      d="M26.5 22.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"
      fill="#fff3cf"
    />
  </svg>
);

/** A wand with a sparkle at its tip. */
export const SpellCreatorIcon = () => (
  <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40">
    <rect
      x="3"
      y="3"
      width="34"
      height="34"
      rx="9"
      fill="#d4dd9c"
      stroke="var(--text)"
      strokeWidth="1.5"
    />
    <path
      d="M10 30L22.5 17.5"
      stroke="#2f3b34"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M26 7l1.7 5.3L33 14l-5.3 1.7L26 21l-1.7-5.3L19 14l5.3-1.7z"
      fill="#fff3cf"
      stroke="#2f3b34"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <circle cx="12.5" cy="12" r="1.6" fill="#2f3b34" />
    <circle cx="29" cy="28" r="1.6" fill="#2f3b34" />
  </svg>
);

/** A golden crown, its middle point a dragon's horn, over a scaled band. */
export const CourtOfDraconiaIcon = () => (
  <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40">
    <rect
      x="3"
      y="3"
      width="34"
      height="34"
      rx="9"
      fill="#d4dd9c"
      stroke="var(--text)"
      strokeWidth="1.5"
    />
    <path
      d="M9 27V15l6 5 5-11 5 11 6-5v12z"
      fill="#f2d27a"
      stroke="#2f3b34"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect x="9" y="27" width="22" height="5" rx="1" fill="#2f3b34" />
    <path
      d="M12 29.5a2 2 0 0 1 4 0M18 29.5a2 2 0 0 1 4 0M24 29.5a2 2 0 0 1 4 0"
      fill="none"
      stroke="#afc584"
      strokeWidth="1.2"
    />
    <circle
      cx="20"
      cy="21"
      r="2.2"
      fill="#b5372f"
      stroke="#2f3b34"
      strokeWidth="1"
    />
  </svg>
);
