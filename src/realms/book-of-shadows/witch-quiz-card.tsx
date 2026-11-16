import { useEffect, useState } from "react";

import { signInUrl } from "../../lib/account";
import { LOCALES, useLanguage } from "../../lib/language";
import { tr } from "./french";
import { WITCH_QUIZ_URL, fetchWitchQuiz } from "./witch-quiz-api";
import type { WitchQuizAnswer } from "./witch-quiz-api";

/** How many other witches the card names after yours. */
const ALSO = 2;

/** The visitor's witch quiz result, from Mini Games, while the page is open. */
const useWitchQuiz = () => {
  // undefined while asking, null when it can't be reached
  const [answer, setAnswer] = useState<WitchQuizAnswer | null | undefined>();

  useEffect(() => {
    let current = true;

    const load = async () => {
      const fetched = await fetchWitchQuiz();

      if (current) {
        setAnswer(fetched);
      }
    };

    void load();

    return () => {
      current = false;
    };
  }, []);

  return answer;
};

const TakeQuiz = ({ again = false }: { again?: boolean }) => (
  <a href={WITCH_QUIZ_URL} className={again ? "btn" : "btn btn--primary"}>
    {again
      ? tr("retake the quiz", "refaire le quiz")
      : tr("take the quiz", "faire le quiz")}
  </a>
);

/**
 * The witch quiz on the profile: the witch type from the visitor's last go
 * at Mini Games' quiz, kept on their account, or the way to take it. Signed
 * out, or taken signed out, it stays on Mini Games, in that browser.
 */
export const WitchQuizCard = () => {
  const language = useLanguage();
  const answer = useWitchQuiz();
  const [first, ...others] = answer?.result?.ranked ?? [];

  const body = () => {
    if (answer === undefined) {
      return <p className="hint" aria-busy="true" />;
    }

    if (answer === null) {
      return (
        <>
          <p className="page__sub">
            {tr(
              "Your witch quiz result can't be reached right now.",
              "Votre résultat au quiz est injoignable pour le moment."
            )}
          </p>
          <div className="result__actions">
            <TakeQuiz />
          </div>
        </>
      );
    }

    if (!answer.signedIn) {
      return (
        <>
          <p className="page__sub">
            {tr(
              "Take the witch quiz on Mini Games while signed in, and your witch type shows here.",
              "Faites le quiz des sorcières sur Mini Games avec votre compte, et votre type de sorcière s’affiche ici."
            )}
          </p>
          <div className="result__actions">
            <a href={signInUrl()} className="btn btn--primary">
              {tr("sign in", "se connecter")}
            </a>
            <a href={WITCH_QUIZ_URL} className="btn">
              {tr("take the quiz", "faire le quiz")}
            </a>
          </div>
        </>
      );
    }

    if (!first || !answer.result) {
      return (
        <>
          <p className="page__sub">
            {tr(
              "Take the witch quiz on Mini Games and your witch type shows here. Took it before signing in? Open your result there and put it on your Book of Shadows.",
              "Faites le quiz des sorcières sur Mini Games et votre type de sorcière s’affiche ici. Déjà fait sans votre compte ? Ouvrez votre résultat là-bas et ajoutez-le à votre Livre des ombres."
            )}
          </p>
          <div className="result__actions">
            <TakeQuiz />
          </div>
        </>
      );
    }

    const takenAt = new Date(answer.result.takenAt);
    const also = others.slice(0, ALSO).map((other) => other.name[language]);

    return (
      <>
        <p className="witch-card__about">{first.about[language]}</p>
        {also.length > 0 ? (
          <p className="hint">
            {tr("With a little of: ", "Avec un peu de : ")}
            {also.join(", ")}.
          </p>
        ) : null}
        {Number.isNaN(takenAt.getTime()) ? null : (
          <p className="hint">
            {tr("Taken on ", "Fait le ")}
            {takenAt.toLocaleDateString(LOCALES[language], {
              dateStyle: "long",
            })}
            {tr(", on Mini Games.", ", sur Mini Games.")}
          </p>
        )}
        <div className="result__actions">
          <TakeQuiz again />
        </div>
      </>
    );
  };

  return (
    <section
      aria-labelledby="witch-quiz-title"
      className="panel panel--book witch-quiz"
    >
      <span className="legend">which-witch.txt</span>
      <p className="kicker">{tr("The witch quiz", "Le quiz des sorcières")}</p>
      <h2 id="witch-quiz-title" className="display page__title">
        {first
          ? first.name[language]
          : tr(
              "What type of witch are you?",
              "Quel type de sorcière êtes-vous ?"
            )}
      </h2>
      {body()}
    </section>
  );
};
