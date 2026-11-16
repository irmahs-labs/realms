import { useId, useState } from "react";

import { CourtOfDraconiaIcon } from "../../components/app-icons";
import { Header } from "../../components/header";
import { RealmNav } from "../../components/realm-nav";
import { signInUrl } from "../../lib/account";
import { useLanguage } from "../../lib/language";
import { Link } from "../../lib/router";
import { serverWords } from "../../lib/server-words";
import { useConfirm } from "../../lib/use-confirm";
import type { PageProps } from "../../realms";
import type { HallEntry } from "./api";
import { DraconoidCard } from "./draconoid-card";
import { letGoMine, saveMine } from "./hall-api";
import {
  AFFINITY_INFO,
  ELEMENT_INFO,
  POWERS,
  ROLE_INFO,
  TIER_INFO,
  TIER_REACH,
  ULTIMATES,
  bentElement,
} from "./magic";
import {
  AFFINITIES,
  ELEMENTS,
  FIRST_TIER,
  MAX_NAME,
  ROLES,
  isValidName,
  tidyName,
} from "./rules";
import type { Affinity, Draconoid, Element, Role } from "./rules";
import { useHall } from "./use-hall";

const COPY = {
  en: {
    affinity: "Affinity",
    base: (element: string, base: string) =>
      `Base form, shared by every ${element.toLowerCase()} draconoid: ${base}.`,
    element: "Element",
    letGo: "let your draconoid go",
    letGoSure: "sure? press again",
    mirror: "its mirror:",
    name: "Name",
    nameHint: "Up to 30 letters, with spaces, hyphens or apostrophes.",
    newName: "Your draconoid",
    noServer:
      "The hall can’t be reached right now, so your draconoid can’t be saved.",
    powers: "Powers",
    role: "Role",
    save: "save your draconoid",
    saved: "Saved. Everyone can meet your draconoid in the hall.",
    saving: "saving…",
    signIn: "sign in to save your draconoid",
    skills: "Skills",
    sub: "half human, half dragon: choose your magic",
    tierHint: "Every draconoid starts at bronze; rising comes later.",
    ultimates: "Your duo ultimates",
    ultimatesLead: (them: string) => `With a ${them} draconoid you unleash:`,
    viewHall: "see the hall",
  },
  fr: {
    affinity: "Affinité",
    base: (element: string, base: string) =>
      `Forme de base, commune à tout draconoïde de l’élément ${element} : ${base}.`,
    element: "Élément",
    letGo: "libérer votre draconoïde",
    letGoSure: "sûr ? appuyez encore",
    mirror: "son reflet :",
    name: "Nom",
    nameHint:
      "Jusqu’à 30 lettres, avec des espaces, des traits d’union ou des apostrophes.",
    newName: "Votre draconoïde",
    noServer:
      "La salle est injoignable pour le moment : votre draconoïde ne peut pas être enregistré.",
    powers: "Pouvoirs",
    role: "Rôle",
    save: "enregistrer votre draconoïde",
    saved:
      "Enregistré. Tout le monde peut rencontrer votre draconoïde dans la salle.",
    saving: "enregistrement…",
    signIn: "se connecter pour enregistrer",
    skills: "Sorts",
    sub: "mi-humain, mi-dragon : choisissez votre magie",
    tierHint:
      "Chaque draconoïde commence au bronze ; la suite viendra plus tard.",
    ultimates: "Vos ultimes en duo",
    ultimatesLead: (them: string) =>
      `Avec un draconoïde ${them}, vous déchaînez :`,
    viewHall: "voir la salle",
  },
};

const OTHER: Readonly<Record<Affinity, Affinity>> = {
  dark: "light",
  light: "dark",
};

interface Choice {
  name: string;
  element: Element;
  affinity: Affinity;
  role: Role;
}

const FIRST_CHOICE: Choice = {
  affinity: "light",
  element: "earth",
  name: "",
  role: "wayfarer",
};

/** One row of pressed-or-not buttons, Cute Matcha's picker. */
const Picker = <T extends string>({
  label,
  options,
  value,
  nameOf,
  onPick,
  grid = false,
}: {
  grid?: boolean;
  label: string;
  options: readonly T[];
  value: T;
  nameOf: (option: T) => string;
  onPick: (option: T) => void;
}) => (
  <fieldset className="draco-form__set">
    <legend className="field-label">{label}</legend>
    <div
      className={`picker draco-form__picker${grid ? " draco-form__picker--grid" : ""}`}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="picker__option"
          aria-pressed={option === value}
          onClick={() => onPick(option)}
        >
          {nameOf(option)}
        </button>
      ))}
    </div>
  </fieldset>
);

/** What the draconoid can do: its element's base form and powers, its role's skills, its ultimates. */
const Powers = ({ draconoid }: { draconoid: Draconoid }) => {
  const language = useLanguage();
  const t = COPY[language];
  const { element, affinity, role, tier } = draconoid;
  const info = ELEMENT_INFO[element];
  const them = OTHER[affinity];

  return (
    <div className="draco-powers">
      <h3 className="display draco-powers__title">{t.powers}</h3>
      <p>{t.base(info.name[language], info.base[language])}</p>
      <ul className="draco-powers__list">
        {POWERS[element].map((pair) => (
          <li key={pair.light.en}>
            <strong>{pair[affinity][language]}</strong>{" "}
            <span className="draco-powers__mirror">
              ({t.mirror} {pair[them][language]}, {pair.mirror[language]})
            </span>
          </li>
        ))}
      </ul>

      <h3 className="display draco-powers__title">
        {t.skills}: {ROLE_INFO[role].name[language]} ·{" "}
        {ROLE_INFO[role].focus[language]}
      </h3>
      <ul className="draco-powers__list">
        {ROLE_INFO[role].skills.map((skill) => (
          <li key={skill.en}>{skill[language]}</li>
        ))}
      </ul>
      <p className="hint">
        {TIER_INFO[tier].name[language]}: {TIER_REACH[tier][language]}
      </p>

      <h3 className="display draco-powers__title">{t.ultimates}</h3>
      <p>{t.ultimatesLead(AFFINITY_INFO[them].of[language])}</p>
      <ul className="draco-powers__list">
        {ELEMENTS.map((partner) => {
          const ultimate =
            affinity === "light"
              ? ULTIMATES[element][partner]
              : ULTIMATES[partner][element];

          return (
            <li key={partner}>
              <strong>{ultimate.name[language]}</strong>{" "}
              <span className="draco-powers__mirror">
                ({bentElement(partner, them, language)})
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/** Makes or remakes the visitor's draconoid, with a live card of what it is. */
const DraconoidMaker = ({ name }: PageProps) => {
  const language = useLanguage();
  const t = COPY[language];
  const { account, hall, reload } = useHall();
  const confirm = useConfirm();
  const nameField = useId();
  // Null until the visitor changes something: until then the form shows
  // their draconoid as it is, or a first one.
  const [edits, setEdits] = useState<Choice | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState<HallEntry | null>(null);
  const mine = hall?.mine ?? null;

  const choice: Choice =
    edits ??
    (mine
      ? {
          affinity: mine.affinity,
          element: mine.element,
          name: mine.name,
          role: mine.role,
        }
      : FIRST_CHOICE);

  const tidy = tidyName(choice.name);
  const nameOk = isValidName(tidy);

  const draconoid: Draconoid = {
    ...choice,
    name: tidy || t.newName,
    tier: mine?.tier ?? FIRST_TIER,
  };

  const pick = (fields: Partial<Choice>) => {
    setEdits({ ...choice, ...fields });
    setSaved(null);
    setMessage(null);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    const result = await saveMine({ ...choice, name: tidy });
    setSaving(false);

    if (result.ok) {
      setSaved(result.value);
      setEdits(null);
      await reload();
    } else {
      setMessage(serverWords(result.message, language));
    }
  };

  const letGo = async () => {
    const result = await letGoMine();

    if (result.ok) {
      setEdits(null);
      setSaved(null);
      await reload();
    } else {
      setMessage(serverWords(result.message, language));
    }
  };

  const action = () => {
    if (account === null) {
      return (
        <a href={signInUrl()} className="btn btn--primary">
          {t.signIn}
        </a>
      );
    }

    return (
      <button
        type="submit"
        className="btn btn--primary"
        disabled={!nameOk || saving || account === undefined || !hall}
      >
        {saving ? t.saving : t.save}
      </button>
    );
  };

  return (
    <>
      <Header
        icon={<CourtOfDraconiaIcon />}
        name={name}
        href="/court-of-draconia/draconoid"
      >
        <RealmNav realm="court-of-draconia" here="draconoid" />
      </Header>
      <main className="page">
        <p className="page__sub">{t.sub}</p>
        {hall === null ? <p className="hint">{t.noServer}</p> : null}

        <div className="layout">
          <section
            className="panel panel--wide draco-form"
            aria-label={t.newName}
          >
            <span className="legend">draconoid.cfg</span>
            <form
              className="draco-form__fields"
              onSubmit={(event) => {
                event.preventDefault();
                void save();
              }}
            >
              <div className="stack">
                <label className="field-label" htmlFor={nameField}>
                  {t.name}
                </label>
                <input
                  id={nameField}
                  className="field"
                  value={choice.name}
                  maxLength={MAX_NAME}
                  autoComplete="off"
                  aria-describedby={`${nameField}-hint`}
                  onChange={(event) => pick({ name: event.target.value })}
                />
                <p id={`${nameField}-hint`} className="hint">
                  {t.nameHint}
                </p>
              </div>
              <Picker
                label={t.element}
                options={ELEMENTS}
                value={choice.element}
                nameOf={(element) => ELEMENT_INFO[element].name[language]}
                onPick={(element) => pick({ element })}
              />
              <Picker
                label={t.affinity}
                options={AFFINITIES}
                value={choice.affinity}
                nameOf={(affinity) => AFFINITY_INFO[affinity].name[language]}
                onPick={(affinity) => pick({ affinity })}
              />
              <p className="hint">
                {AFFINITY_INFO[choice.affinity].about[language]}
              </p>
              <Picker
                label={t.role}
                grid
                options={ROLES}
                value={choice.role}
                nameOf={(role) => ROLE_INFO[role].name[language]}
                onPick={(role) => pick({ role })}
              />
              <p className="hint">{t.tierHint}</p>

              <div className="draco-form__actions">
                {action()}
                {mine ? (
                  <button
                    type="button"
                    className="btn btn--quiet"
                    onClick={() => confirm.press("let-go", letGo)}
                  >
                    {confirm.armed === "let-go" ? t.letGoSure : t.letGo}
                  </button>
                ) : null}
              </div>
              <p className="hint" aria-live="polite">
                {saved ? (
                  <>
                    {t.saved}{" "}
                    <Link href="/court-of-draconia/hall">{t.viewHall}</Link>
                  </>
                ) : (
                  message
                )}
              </p>
            </form>
          </section>

          <section
            className="panel panel--narrow draco-preview"
            aria-live="polite"
          >
            <span className="legend">preview.png</span>
            <DraconoidCard draconoid={draconoid} size="large" />
            <Powers draconoid={draconoid} />
          </section>
        </div>
      </main>
    </>
  );
};

export default DraconoidMaker;
