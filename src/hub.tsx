import { RealmsIcon } from "./components/app-icons";
import { Header } from "./components/header";
import { APP_NAME } from "./lib/brand";
import { Icon } from "./lib/icon";
import { useCopy, useLanguage } from "./lib/language";
import { Link } from "./lib/router";
import { REALMS } from "./realms";

const COPY = {
  en: { inside: "Inside", sub: "pick a realm and step through" },
  fr: { inside: "À l’intérieur", sub: "choisissez un royaume et entrez" },
};

/** The front page: one card per realm, naming the pages inside it. */
export const Hub = () => {
  const t = useCopy(COPY);
  const language = useLanguage();

  return (
    <>
      <Header icon={<RealmsIcon />} name={APP_NAME} href="/" />
      <main className="page">
        <p className="page__sub">{t.sub}</p>

        <ul className="realm-list">
          {REALMS.map((realm) => (
            <li key={realm.slug}>
              <Link href={`/${realm.slug}`} className="realm-card">
                <span className="legend">{realm.legend}</span>
                <realm.Icon />
                <h2 className="display realm-card__name">
                  {realm.name[language]}
                  <Icon name="arrow" size={20} />
                </h2>
                <p className="realm-card__blurb">{realm.blurb[language]}</p>
                {realm.pages.length > 1 ? (
                  <p className="realm-card__pages">
                    <span className="realm-card__inside">{t.inside}</span>
                    {realm.pages.slice(1).map((page) => (
                      <span key={page.slug} className="realm-card__page">
                        {page.name[language]}
                      </span>
                    ))}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};
