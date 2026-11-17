import { MatchPanel, MatchSummary } from "./compat-panel";
import { tr } from "./french";
import { NeedsBirth } from "./needs-birth";
import { Avatar, BirthDetails } from "./profile-tab";
import { useBook } from "./use-book";

/** The three ways you match someone, in order, and how each is named. */
const MATCHES = [
  {
    kind: "chart",
    label: ["Birth chart", "Thème astral"],
    legend: "chart-match.csv",
    title: ["Your charts, side by side", "Vos thèmes, côte à côte"],
  },
  {
    kind: "numbers",
    label: ["Numerology", "Numérologie"],
    legend: "numbers-match.csv",
    title: ["Your numbers together", "Vos nombres ensemble"],
  },
  {
    kind: "lunar-zodiac",
    label: ["Lunar Zodiac", "Zodiaque lunaire"],
    legend: "animals-match.csv",
    title: ["Your animals together", "Vos animaux ensemble"],
  },
] as const;

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
      <Avatar
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
            MATCHES.map(({ kind, label }) => ({
              href: `#match-${kind}`,
              label: tr(label[0], label[1]),
              match: matches[kind],
            }))
          }
        />
      ) : (
        <NeedsBirth
          legend="compatibility.txt"
          title={tr("How do you match?", "Êtes-vous compatibles ?")}
          text={tr(
            "To compare the two of you, the book needs your birth date too, on the birth chart page.",
            "Pour vous comparer, le livre a aussi besoin de votre date de naissance, sur la page du thème astral."
          )}
        />
      )}
      {matches
        ? MATCHES.map(({ kind, legend, title }) => (
            <div key={kind} id={`match-${kind}`} className="match__anchor">
              <MatchPanel
                legend={legend}
                title={tr(title[0], title[1])}
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
