import { birthCards } from "./birth-card";
import { say, tr } from "./french";
import type { Birth } from "./profile";
import { TarotFace } from "./tarot-face";

/** Your tarot birth cards, from your birth date, with what they mean. */
export const BirthCardPanel = ({
  birth,
  className = "",
}: {
  birth: Birth;
  /** Extra panel classes: "panel--narrow" beside another panel. */
  className?: string;
}) => {
  const cards = birthCards(birth);

  return (
    <section
      aria-labelledby="birth-card-title"
      className={`panel panel--book ${className}`}
    >
      <span className="legend">birth-card.png</span>
      <h2 id="birth-card-title" className="display book__title">
        {cards.length > 1
          ? tr("Your birth cards", "Vos cartes de naissance")
          : tr("Your birth card", "Votre carte de naissance")}
      </h2>
      <p className="page__sub">
        {tr(
          "Your birth date added up (the month, the day, then the year, digit by digit) lands on a major arcana: the card you carry through life.",
          "Votre date de naissance additionnée (le mois, le jour, puis l’année, chiffre par chiffre) tombe sur un arcane majeur : la carte qui vous suit toute la vie."
        )}
      </p>
      <ul className="birth-cards">
        {cards.map((card) => (
          <li key={card.id} className="birth-card">
            <TarotFace card={card} reversed={false} width={110} />
            <div className="stack">
              <p className="display today__big">{say(card.name)}</p>
              <p className="tarot-side__keywords">
                {say(card.upright.keywords)}
              </p>
              <p>{say(card.upright.meaning)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
