import { Icon } from "../lib/icon";
import { useCopy, useLanguage } from "../lib/language";
import { Link } from "../lib/router";
import { pathOf, realmOf } from "../realms";

const COPY = {
  en: { all: "all realms" },
  fr: { all: "tous les royaumes" },
};

/**
 * The buttons in the middle of a realm page's header: back a step (to every
 * realm from the realm's first page, to the realm from the others), then the
 * realm's other pages.
 */
export const RealmNav = ({ realm, here }: { realm: string; here: string }) => {
  const t = useCopy(COPY);
  const language = useLanguage();
  const entry = realmOf(realm);
  const [home] = entry.pages;
  const atHome = here === home?.slug;

  return (
    <>
      <Link href={atHome ? "/" : `/${entry.slug}`} className="btn">
        <Icon name="back" size={16} />
        {atHome ? t.all : entry.name[language]}
      </Link>
      {entry.pages
        .filter((page) => page !== home && page.slug !== here)
        .map((page) => (
          <Link key={page.slug} href={pathOf(entry, page)} className="btn">
            {page.name[language]}
          </Link>
        ))}
    </>
  );
};
