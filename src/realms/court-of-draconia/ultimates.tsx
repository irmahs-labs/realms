import { useState } from "react";

import { CourtOfDraconiaIcon } from "../../components/app-icons";
import { Header } from "../../components/header";
import { RealmNav } from "../../components/realm-nav";
import { useLanguage } from "../../lib/language";
import type { PageProps } from "../../realms";
import { ELEMENT_INFO, ULTIMATES, bentElement } from "./magic";
import { ELEMENTS } from "./rules";
import type { Element } from "./rules";
import { useHall } from "./use-hall";

const COPY = {
  en: {
    caption:
      "Duo ultimates: a light draconoid’s element down the side, a dark one’s across the top. Order matters: light fire with dark earth is not dark fire with light earth.",
    corner: "Light ↓ · Dark →",
    same: "Same element",
    sub: "a light draconoid and a dark one together unleash a natural catastrophe",
    yours: (bent: string, where: string) =>
      `Your draconoid is ${bent.toLowerCase()}: yours are in its ${where}.`,
    yoursColumn: "column",
    yoursRow: "row",
  },
  fr: {
    caption:
      "Ultimes en duo : l’élément d’un draconoïde de lumière sur le côté, celui d’un draconoïde d’ombre en haut. L’ordre compte : le feu de lumière avec la terre d’ombre n’est pas le feu d’ombre avec la terre de lumière.",
    corner: "Lumière ↓ · Ombre →",
    same: "Même élément",
    sub: "un draconoïde de lumière et un draconoïde d’ombre déchaînent ensemble une catastrophe naturelle",
    yours: (bent: string, where: string) =>
      `Votre draconoïde est ${bent.toLowerCase()} : les vôtres sont dans sa ${where}.`,
    yoursColumn: "colonne",
    yoursRow: "ligne",
  },
};

interface Cell {
  light: Element;
  dark: Element;
}

/** All sixteen duo ultimates, and what the one picked does. */
const Ultimates = ({ name }: PageProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const { hall } = useHall();
  const mine = hall?.mine ?? null;
  const [chosen, setChosen] = useState<Cell | null>(null);

  // Until one is chosen, it opens on one of the visitor's own, once their
  // draconoid is known, and on Meteor otherwise.
  const picked: Cell =
    chosen ??
    (mine?.affinity === "light"
      ? { dark: "earth", light: mine.element }
      : { dark: mine?.element ?? "earth", light: "fire" });

  const ultimate = ULTIMATES[picked.light][picked.dark];

  const isMine = (cell: Cell) =>
    mine !== null &&
    (mine.affinity === "light"
      ? cell.light === mine.element
      : cell.dark === mine.element);

  return (
    <>
      <Header
        icon={<CourtOfDraconiaIcon />}
        name={name}
        href="/court-of-draconia/ultimates"
      >
        <RealmNav realm="court-of-draconia" here="ultimates" />
      </Header>
      <main className="page">
        <p className="page__sub">{t.sub}</p>
        {mine ? (
          <p className="hint">
            {t.yours(
              bentElement(mine.element, mine.affinity, language),
              mine.affinity === "light" ? t.yoursRow : t.yoursColumn
            )}
          </p>
        ) : null}

        <div className="layout">
          <section className="panel panel--wide ultimates-panel">
            <span className="legend">ultimates.csv</span>
            <p className="ultimates__caption" aria-hidden="true">
              {t.caption}
            </p>
            <div className="ultimates-scroll">
              <table className="ultimates">
                <caption className="sr-only">{t.caption}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="ultimates__corner">
                      {t.corner}
                    </th>
                    {ELEMENTS.map((dark) => (
                      <th key={dark} scope="col">
                        <span
                          className="ultimates__bar"
                          style={{ background: ELEMENT_INFO[dark].colour }}
                          aria-hidden="true"
                        />
                        {bentElement(dark, "dark", language)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ELEMENTS.map((light) => (
                    <tr key={light}>
                      <th scope="row">
                        <span
                          className="ultimates__bar ultimates__bar--side"
                          style={{ background: ELEMENT_INFO[light].colour }}
                          aria-hidden="true"
                        />
                        {bentElement(light, "light", language)}
                      </th>
                      {ELEMENTS.map((dark) => {
                        const cell = { dark, light };

                        const classes = [
                          "ultimates__cell",
                          light === dark ? "ultimates__cell--same" : "",
                          isMine(cell) ? "ultimates__cell--mine" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <td key={dark} className={classes}>
                            <button
                              type="button"
                              className="ultimates__pick"
                              aria-pressed={
                                picked.light === light && picked.dark === dark
                              }
                              onClick={() => setChosen(cell)}
                            >
                              {ULTIMATES[light][dark].name[language]}
                              {light === dark ? (
                                <span className="sr-only"> ({t.same})</span>
                              ) : null}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            className="panel panel--narrow ultimates-picked"
            aria-live="polite"
            aria-labelledby="ultimate-name"
          >
            <span className="legend">ultimate.exe</span>
            <p className="kicker">
              {bentElement(picked.light, "light", language)} +{" "}
              {bentElement(picked.dark, "dark", language).toLowerCase()}
            </p>
            <h2 id="ultimate-name" className="display ultimates-picked__name">
              {ultimate.name[language]}
            </h2>
            <p>{ultimate.effect[language]}</p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Ultimates;
