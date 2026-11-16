import type { ReactNode } from "react";

import { useLanguage } from "../../lib/language";
import { Emblem } from "./emblem";
import { ROLE_INFO, TIER_INFO, bentElement } from "./magic";
import type { Draconoid } from "./rules";

const COPY = {
  en: { by: "by", yours: "yours" },
  fr: { by: "par", yours: "le vôtre" },
};

interface DraconoidCardProps {
  draconoid: Draconoid;
  /** Who made it, "Ana L."; none for your own. */
  owner?: string;
  yours?: boolean;
  /** Buttons at its foot. */
  children?: ReactNode;
  size?: "small" | "large";
}

/**
 * A draconoid at a glance: its emblem, its name, and what it is, "Bronze ·
 * Dark fire · Seer".
 */
export const DraconoidCard = ({
  draconoid,
  owner,
  yours = false,
  children,
  size = "small",
}: DraconoidCardProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const { name, element, affinity, role, tier } = draconoid;

  return (
    <article className={`draconoid draconoid--${size}`}>
      <Emblem
        element={element}
        affinity={affinity}
        tier={tier}
        size={size === "large" ? 112 : 64}
      />
      <div className="draconoid__text">
        <h3 className="display draconoid__name">
          {name}
          {yours ? <span className="draconoid__yours">{t.yours}</span> : null}
        </h3>
        <p className="draconoid__what">
          {TIER_INFO[tier].name[language]} ·{" "}
          {bentElement(element, affinity, language)} ·{" "}
          {ROLE_INFO[role].name[language]}
        </p>
        {owner ? (
          <p className="draconoid__owner">
            {t.by} {owner}
          </p>
        ) : null}
        {children ? <div className="draconoid__actions">{children}</div> : null}
      </div>
    </article>
  );
};
