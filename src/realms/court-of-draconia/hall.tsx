import { useState } from "react";

import { signInUrl } from "../../lib/account";
import { useLanguage } from "../../lib/language";
import { Link } from "../../lib/router";
import { serverWords } from "../../lib/server-words";
import { useConfirm } from "../../lib/use-confirm";
import type { HallEntry } from "./api";
import { DraconoidCard } from "./draconoid-card";
import { takeDown } from "./hall-api";
import { AFFINITY_INFO, ELEMENT_INFO, ULTIMATES, bentElement } from "./magic";
import { AFFINITIES, ELEMENTS, duoOf } from "./rules";
import type { Affinity, Element } from "./rules";
import { useHall } from "./use-hall";

const COPY = {
  en: {
    affinityFilter: "Affinity",
    all: "All",
    become: "become a draconoid",
    count: (n: number) => (n === 1 ? "1 draconoid" : `${n} draconoids`),
    duo: "Duo ultimate",
    duoWith: (theirs: string) => `unleash with ${theirs}`,
    elementFilter: "Element",
    empty: "No draconoid here yet.",
    emptyFiltered: "No draconoid matches these.",
    loading: "Opening the hall…",
    noServer: "The hall can’t be reached right now.",
    signIn: "sign in to bring your draconoid",
    sub: "everyone’s draconoids, newest first",
    takeDown: "take down",
    takeDownSure: "sure? press again",
    together: (yours: string, theirs: string, light: string, dark: string) =>
      `${yours} and ${theirs}: ${light} with ${dark}.`,
    unleash:
      "Pick someone of the other affinity to unleash a duo ultimate with them.",
  },
  fr: {
    affinityFilter: "Affinité",
    all: "Tous",
    become: "devenir draconoïde",
    count: (n: number) => (n === 1 ? "1 draconoïde" : `${n} draconoïdes`),
    duo: "Ultime en duo",
    duoWith: (theirs: string) => `déchaîner avec ${theirs}`,
    elementFilter: "Élément",
    empty: "Aucun draconoïde ici pour l’instant.",
    emptyFiltered: "Aucun draconoïde ne correspond.",
    loading: "Ouverture de la salle…",
    noServer: "La salle est injoignable pour le moment.",
    signIn: "se connecter pour amener votre draconoïde",
    sub: "les draconoïdes de tout le monde, les plus récents d’abord",
    takeDown: "retirer",
    takeDownSure: "sûr ? appuyez encore",
    together: (yours: string, theirs: string, light: string, dark: string) =>
      `${yours} et ${theirs} : ${light} avec ${dark}.`,
    unleash:
      "Choisissez quelqu’un de l’autre affinité pour déchaîner un ultime en duo.",
  },
};

type Filter<T> = T | "all";

/** One filter of the hall: "all", then each of its options. */
const FilterPicker = <T extends string>({
  label,
  all,
  options,
  value,
  nameOf,
  onPick,
}: {
  label: string;
  all: string;
  options: readonly T[];
  value: Filter<T>;
  nameOf: (option: T) => string;
  onPick: (option: Filter<T>) => void;
}) => (
  <fieldset className="draco-form__set">
    <legend className="sr-only">{label}</legend>
    <div className="picker">
      {(["all", ...options] as const).map((option) => (
        <button
          key={option}
          type="button"
          className="picker__option"
          aria-pressed={value === option}
          onClick={() => onPick(option)}
        >
          {option === "all" ? all : nameOf(option)}
        </button>
      ))}
    </div>
  </fieldset>
);

/** The ultimate your draconoid and another unleash, once one is picked. */
const DuoResult = ({
  mine,
  theirs,
}: {
  mine: HallEntry;
  theirs: HallEntry;
}) => {
  const language = useLanguage();
  const t = COPY[language];
  const duo = duoOf(mine, theirs);

  if (!duo) {
    return null;
  }

  const ultimate = ULTIMATES[duo.light][duo.dark];

  const [light, dark] =
    mine.affinity === "light" ? [mine, theirs] : [theirs, mine];

  return (
    <section
      id="hall-duo-panel"
      className="panel hall-duo"
      aria-live="polite"
      aria-labelledby="hall-duo"
    >
      <span className="legend">ultimate.exe</span>
      <p className="kicker">{t.duo}</p>
      <h2 id="hall-duo" className="display hall-duo__name">
        {ultimate.name[language]}
      </h2>
      <p>{ultimate.effect[language]}</p>
      <p className="hint">
        {t.together(
          mine.name,
          theirs.name,
          bentElement(light.element, "light", language).toLowerCase(),
          bentElement(dark.element, "dark", language).toLowerCase()
        )}
      </p>
    </section>
  );
};

/** Everyone's draconoids, and what yours unleashes with each. */
const Hall = () => {
  const language = useLanguage();
  const t = COPY[language];
  const { account, hall, reload } = useHall();
  const confirm = useConfirm();
  const [element, setElement] = useState<Filter<Element>>("all");
  const [affinity, setAffinity] = useState<Filter<Affinity>>("all");
  const [partner, setPartner] = useState<HallEntry | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const mine = hall?.mine ?? null;

  const shown = (hall?.draconoids ?? []).filter(
    (draconoid) =>
      (element === "all" || draconoid.element === element) &&
      (affinity === "all" || draconoid.affinity === affinity)
  );

  // On a phone the ultimate opens above the card pressed, out of sight:
  // it is brought into view once drawn.
  const unleashWith = (draconoid: HallEntry) => {
    setPartner(draconoid);
    window.requestAnimationFrame(() =>
      document
        .querySelector("#hall-duo-panel")
        ?.scrollIntoView({ block: "start" })
    );
  };

  const remove = async (id: string) => {
    const result = await takeDown(id);

    if (result.ok) {
      setPartner((current) => (current?.id === id ? null : current));
      await reload();
    } else {
      setMessage(serverWords(result.message, language));
    }
  };

  const body = () => {
    if (hall === undefined) {
      return (
        <p className="hint" aria-busy="true">
          {t.loading}
        </p>
      );
    }

    if (hall === null) {
      return <p className="hint">{t.noServer}</p>;
    }

    if (shown.length === 0) {
      return (
        <p className="hint">
          {hall.draconoids.length === 0 ? t.empty : t.emptyFiltered}
        </p>
      );
    }

    return (
      <ul className="hall-list">
        {shown.map((draconoid) => {
          const yours = draconoid.id === mine?.id;
          const canDuo = Boolean(mine && !yours && duoOf(mine, draconoid));

          return (
            <li key={draconoid.id}>
              <DraconoidCard
                draconoid={draconoid}
                owner={yours ? undefined : draconoid.owner}
                yours={yours}
              >
                {canDuo ? (
                  <button
                    type="button"
                    className="btn"
                    aria-pressed={partner?.id === draconoid.id}
                    onClick={() => unleashWith(draconoid)}
                  >
                    {t.duoWith(draconoid.name)}
                  </button>
                ) : null}
                {hall.admin && !yours ? (
                  <button
                    type="button"
                    className="btn btn--quiet"
                    onClick={() =>
                      confirm.press(draconoid.id, () => remove(draconoid.id))
                    }
                  >
                    {confirm.armed === draconoid.id
                      ? t.takeDownSure
                      : t.takeDown}
                  </button>
                ) : null}
              </DraconoidCard>
            </li>
          );
        })}
      </ul>
    );
  };

  const invite = () => {
    if (mine) {
      return <p className="hint">{t.unleash}</p>;
    }

    if (account === null) {
      return (
        <a href={signInUrl()} className="btn btn--primary hall-invite">
          {t.signIn}
        </a>
      );
    }

    return hall ? (
      <Link
        href="/court-of-draconia/draconoid"
        className="btn btn--primary hall-invite"
      >
        {t.become}
      </Link>
    ) : null;
  };

  return (
    <main className="page">
      <p className="page__sub">{t.sub}</p>
      {invite()}

      {mine && partner ? <DuoResult mine={mine} theirs={partner} /> : null}

      <section className="panel hall-panel" aria-labelledby="hall-count">
        <span className="legend">hall.csv</span>
        <h2 id="hall-count" className="display court-panel__title">
          {t.count(shown.length)}
        </h2>
        <div className="hall-filters">
          <FilterPicker
            label={t.elementFilter}
            all={t.all}
            options={ELEMENTS}
            value={element}
            nameOf={(option) => ELEMENT_INFO[option].name[language]}
            onPick={setElement}
          />
          <FilterPicker
            label={t.affinityFilter}
            all={t.all}
            options={AFFINITIES}
            value={affinity}
            nameOf={(option) => AFFINITY_INFO[option].name[language]}
            onPick={setAffinity}
          />
        </div>
        {message ? (
          <p className="hint" aria-live="polite">
            {message}
          </p>
        ) : null}
        {body()}
      </section>
    </main>
  );
};

export default Hall;
