import { useLanguage } from "../../lib/language";
import { Link } from "../../lib/router";
import { DraconoidCard } from "./draconoid-card";
import { CourtSeal } from "./emblem";
import { COURT, ELEMENT_INFO } from "./magic";
import type { Element } from "./rules";
import { useHall } from "./use-hall";

const COPY = {
  en: {
    become: "become a draconoid",
    change: "change your draconoid",
    courtLead:
      "The six original elemental wielders: a light queen and a dark king, and a dragon ruler for each season, each holding a title from their own region. Every member belongs to the dragon family.",
    courtTitle: "The Court",
    hall: "meet everyone’s draconoids",
    layers: [
      ["Element", "the form your magic takes: earth, water, fire or air."],
      [
        "Affinity",
        "light moves outward (growth, release, radiance), dark inward (depth, density, what is hidden). Not good or evil, just a leaning; every light power has a mirrored dark one.",
      ],
      [
        "Role",
        "your basic magic, the same for every element: wayfarer, guardian, artificer, seer, illusionist or summoner.",
      ],
      [
        "Tier",
        "your mastery: bronze, silver, gold, then multichrome. Every draconoid starts at bronze.",
      ],
    ],
    magicTitle: "How magic works",
    noHall:
      "The hall can’t be reached right now, so your draconoid can’t be shown.",
    none: "Every visitor can become a draconoid: half human, half dragon, with an element, an affinity and a role of their own.",
    seasons: "The seasons",
    sub: "the dragon realm: make your draconoid, and meet everyone else’s",
    title: "title",
    yoursTitle: "Your draconoid",
  },
  fr: {
    become: "devenir draconoïde",
    change: "changer votre draconoïde",
    courtLead:
      "Les six premiers maîtres des éléments : une reine de lumière et un roi d’ombre, et un souverain dragon pour chaque saison, chacun portant un titre de sa propre région. Tous font partie de la famille des dragons.",
    courtTitle: "La Cour",
    hall: "rencontrer les draconoïdes de tout le monde",
    layers: [
      ["Élément", "la forme que prend votre magie : terre, eau, feu ou air."],
      [
        "Affinité",
        "la lumière va vers l’extérieur (croissance, libération, rayonnement), l’ombre vers l’intérieur (profondeur, densité, ce qui est caché). Ni le bien ni le mal, juste un penchant ; chaque pouvoir de lumière a son reflet d’ombre.",
      ],
      [
        "Rôle",
        "votre magie de base, la même pour chaque élément : nomade, sentinelle, alchimiste, oracle, illusionniste ou mage d’invocation.",
      ],
      [
        "Rang",
        "votre maîtrise : bronze, argent, or, puis multichrome. Chaque draconoïde commence au bronze.",
      ],
    ],
    magicTitle: "Comment marche la magie",
    noHall:
      "La salle est injoignable pour le moment : votre draconoïde ne peut pas s’afficher.",
    none: "Chaque visiteur peut devenir draconoïde : mi-humain, mi-dragon, avec un élément, une affinité et un rôle bien à soi.",
    seasons: "Les saisons",
    sub: "le royaume des dragons : créez votre draconoïde, et rencontrez ceux des autres",
    title: "titre",
    yoursTitle: "Votre draconoïde",
  },
};

/** The elements by their seasons, spring to winter. */
const SEASON_ORDER: readonly Element[] = ["earth", "fire", "air", "water"];

/** Your draconoid, or the way to become one. */
const Yours = () => {
  const language = useLanguage();
  const t = COPY[language];
  const { hall } = useHall();

  if (hall === undefined) {
    return <p className="hint" aria-busy="true" />;
  }

  if (hall === null) {
    return <p className="hint">{t.noHall}</p>;
  }

  if (hall.mine) {
    return (
      <DraconoidCard draconoid={hall.mine} size="large">
        <Link href="/court-of-draconia/draconoid" className="btn">
          {t.change}
        </Link>
        <Link href="/court-of-draconia/hall" className="btn">
          {t.hall}
        </Link>
      </DraconoidCard>
    );
  }

  return (
    <div className="stack court-yours__none">
      <p>{t.none}</p>
      <Link
        href="/court-of-draconia/draconoid"
        className="btn btn--primary court-yours__go"
      >
        {t.become}
      </Link>
    </div>
  );
};

/** The Court of Draconia's first page: you, the Court, and how its magic works. */
const Court = () => {
  const language = useLanguage();
  const t = COPY[language];

  return (
    <main className="page">
      <p className="page__sub">{t.sub}</p>

      <section className="panel court-panel" aria-labelledby="court-yours">
        <span className="legend">your-draconoid.png</span>
        <h2 id="court-yours" className="display court-panel__title">
          {t.yoursTitle}
        </h2>
        <Yours />
      </section>

      <section className="panel court-panel" aria-labelledby="court-court">
        <span className="legend">the-court.txt</span>
        <h2 id="court-court" className="display court-panel__title">
          {t.courtTitle}
        </h2>
        <p className="court-panel__lead">{t.courtLead}</p>
        <ul className="court-members">
          {COURT.map((member) => (
            <li key={member.id} className="court-member">
              <CourtSeal wields={member.wields} size={64} />
              <div className="court-member__text">
                <p className="kicker">
                  {member.title[language]}
                  {member.season ? ` · ${member.season[language]}` : null}
                </p>
                <h3 className="display court-member__name">{member.name}</h3>
                <p className="court-member__what">
                  {member.species[language]} · {member.creature[language]} ·{" "}
                  {member.origin[language]}
                </p>
                <p className="court-member__meaning">
                  {member.nameMeaning[language]}
                </p>
                {member.titleMeaning ? (
                  <p className="court-member__meaning">
                    <span className="sr-only">{t.title}: </span>
                    {member.title[language]}: {member.titleMeaning[language]}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel court-panel" aria-labelledby="court-magic">
        <span className="legend">magic.md</span>
        <h2 id="court-magic" className="display court-panel__title">
          {t.magicTitle}
        </h2>
        <dl className="court-layers">
          {t.layers.map(([term, what]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{what}</dd>
            </div>
          ))}
        </dl>
        <h3 className="display court-panel__subtitle">{t.seasons}</h3>
        <p className="court-seasons">
          {SEASON_ORDER.map((element) => (
            <span key={element} className="court-season">
              <span
                className="court-season__dot"
                style={{ background: ELEMENT_INFO[element].colour }}
                aria-hidden="true"
              />
              {ELEMENT_INFO[element].season[language]}:{" "}
              {ELEMENT_INFO[element].name[language]}
            </span>
          ))}
        </p>
      </section>
    </main>
  );
};

export default Court;
