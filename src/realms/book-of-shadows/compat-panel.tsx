import type { Match } from "./compat";
import { tr } from "./french";
import { Meter } from "./meter";

/** "Sam Smith" → "Sam"; no name → "". */
export const firstNameOf = (name: string): string =>
  name.trim().split(/\s+/u)[0] ?? "";

interface MatchPanelProps {
  /** The panel's filename: "chart-match.csv". */
  legend: string;
  /** What is being compared: "Your charts". */
  title: string;
  match: Match;
  /** The other person's first name, if they have one. */
  name: string;
}

/** How two people match one way: a score, a verdict, and every reason. */
export const MatchPanel = ({ legend, title, match, name }: MatchPanelProps) => (
  <section
    aria-labelledby={`${legend}-title`}
    className="panel panel--book match"
  >
    <span className="legend">{legend}</span>
    <p className="kicker">
      {tr("You and ", "Vous et ")}
      {name || tr("them", "l’autre")}
    </p>
    <h2 id={`${legend}-title`} className="display book__title">
      {title}
    </h2>
    <div className="match__meter">
      <span className="display match__score">{match.score}%</span>
      <Meter percent={match.score} />
    </div>
    <p className="match__verdict">{match.verdict}</p>
    <ul className="match__reasons">
      {match.reasons.map((reason) => (
        <li
          key={reason.title}
          className={`match__reason match__reason--${reason.tone}`}
        >
          <span aria-hidden="true" className="match__tone">
            {{ good: "♥", hard: "✕", mixed: "~" }[reason.tone]}
          </span>
          <span>
            <strong>{reason.title}.</strong> {reason.text}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

interface SummaryRow {
  label: string;
  match: Match;
  onOpen: () => void;
}

/** The three scores side by side, each scrolling to its own panel. */
export const MatchSummary = ({
  name,
  rows,
}: {
  name: string;
  rows: readonly SummaryRow[] | null;
}) => (
  <section aria-labelledby="summary-title" className="panel panel--book match">
    <span className="legend">compatibility.txt</span>
    <p className="kicker">
      {tr("You and ", "Vous et ")}
      {name || tr("them", "l’autre")}
    </p>
    <h2 id="summary-title" className="display book__title">
      {tr("How you match", "Votre compatibilité")}
    </h2>
    {rows ? (
      <ul className="match__summary">
        {rows.map(({ label, match, onOpen }) => (
          <li key={label}>
            <button type="button" className="match__row" onClick={onOpen}>
              <span className="match__label">{label}</span>
              <Meter percent={match.score} />
              <span className="display match__row-score">{match.score}%</span>
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="page__sub">
        {tr(
          "Fill in their birth date, and their birth time and place if you know them, to see how the two of you match.",
          "Renseignez sa date de naissance, et son heure et son lieu de naissance si vous les connaissez, pour voir votre compatibilité."
        )}
      </p>
    )}
  </section>
);
