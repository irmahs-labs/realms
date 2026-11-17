import { Link } from "../../lib/router";
import { tr } from "./french";

/** Where the birth date is filled in: the birth chart page. */
export const BIRTH_DETAILS_PATH = "/book-of-shadows/birth-chart";

interface NeedsBirthProps {
  legend?: string;
  title?: string;
  text?: string;
  /** Extra panel classes: "panel--wide" beside another panel. */
  className?: string;
  /** False on the birth chart page, where the fields are just above. */
  link?: boolean;
}

/** What a page that reads the birth date shows without one. */
export const NeedsBirth = ({
  legend = "locked.txt",
  title,
  text,
  className = "",
  link = true,
}: NeedsBirthProps) => (
  <section className={`panel panel--book empty ${className}`}>
    <span className="legend">{legend}</span>
    <h2 className="display page__title">
      {title ?? tr("This page is still blank", "Cette page est encore vierge")}
    </h2>
    <p className="page__sub">
      {text ??
        tr(
          "It needs your birth date, on the birth chart page.",
          "Il lui faut votre date de naissance, sur la page du thème astral."
        )}
    </p>
    {link ? (
      <Link href={BIRTH_DETAILS_PATH} className="btn btn--primary">
        {tr("Fill in your birth details", "Remplir vos informations")}
      </Link>
    ) : null}
  </section>
);
