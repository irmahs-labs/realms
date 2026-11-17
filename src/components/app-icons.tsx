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

/** A cream crown, its middle point a dragon's horn, a green jewel at its heart. */
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
      d="M8 29.5V16l6.5 5.5L20 9l5.5 12.5L32 16v13.5z"
      fill="#fff3cf"
      stroke="#2f3b34"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle
      cx="20"
      cy="23.5"
      r="2.8"
      fill="#afc584"
      stroke="#2f3b34"
      strokeWidth="1.2"
    />
  </svg>
);
