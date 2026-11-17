import { navigate } from "../../lib/router";
import { MatchPanel, MatchSummary } from "./compat-panel";
import { tr } from "./french";
import { NeedsBirth } from "./needs-birth";
import { BirthDetails, WitchCard } from "./profile-tab";
import { BOOK_PATHS, useBook } from "./use-book";

/** The three ways you match someone, and how each is named. */
const MATCHES = {
  chart: {
    label: ["Birth chart", "Thème astral"],
    legend: "chart-match.csv",
    title: ["Your charts, side by side", "Vos thèmes, côte à côte"],
  },
  "lunar-zodiac": {
    label: ["Lunar Zodiac", "Zodiaque lunaire"],
    legend: "animals-match.csv",
    title: ["Your animals together", "Vos animaux ensemble"],
  },
  numbers: {
    label: ["Numerology", "Numérologie"],
    legend: "numbers-match.csv",
    title: ["Your numbers together", "Vos nombres ensemble"],
  },
} as const;

type MatchKind = keyof typeof MATCHES;

const MATCH_KINDS: readonly MatchKind[] = ["chart", "numbers", "lunar-zodiac"];

const scrollTo = (kind: MatchKind) => () =>
  document.querySelector(`#match-${kind}`)?.scrollIntoView({ block: "start" });

/**
 * The compatibility calculator: someone else's birth details, and how the
 * two of you match, by your charts, your numbers and your animals.
 */
const Compatibility = () => {
  const {
    birth,
    clearer,
    editor,
    matches,
    state,
    theirBirth,
    theirChart,
    theirName,
    thisYear,
  } = useBook();

  return (
    <main className="page">
      <BirthDetails
        who="partner"
        profile={state.partner}
        onChange={editor("partner")}
        onClear={clearer("partner")}
      />
      <WitchCard
        who="partner"
        profile={state.partner}
        birth={theirBirth}
        chart={theirChart}
        thisYear={thisYear}
      />
      {birth ? (
        <MatchSummary
          name={theirName}
          rows={
            matches &&
            MATCH_KINDS.map((kind) => ({
              label: tr(MATCHES[kind].label[0], MATCHES[kind].label[1]),
              match: matches[kind],
              onOpen: scrollTo(kind),
            }))
          }
        />
      ) : (
        <NeedsBirth
          legend="compatibility.txt"
          title={tr("How do you match?", "Êtes-vous compatibles ?")}
          text={tr(
            "To compare the two of you, the book needs your birth date too, on your profile.",
            "Pour vous comparer, le livre a aussi besoin de votre date de naissance, dans votre profil."
          )}
          onOpen={() => navigate(BOOK_PATHS.profile)}
        />
      )}
      {matches
        ? MATCH_KINDS.map((kind) => (
            <div key={kind} id={`match-${kind}`} className="match__anchor">
              <MatchPanel
                legend={MATCHES[kind].legend}
                title={tr(MATCHES[kind].title[0], MATCHES[kind].title[1])}
                match={matches[kind]}
                name={theirName}
              />
            </div>
          ))
        : null}
    </main>
  );
};

export default Compatibility;
