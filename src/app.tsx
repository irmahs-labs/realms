import { Suspense, useEffect } from "react";
import type { ReactNode } from "react";

import { RealmsIcon } from "./components/app-icons";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { RealmHeader } from "./components/realm-header";
import { Hub } from "./hub";
import { APP_NAME } from "./lib/brand";
import { useCopy, useLanguage } from "./lib/language";
import { Link, usePath, withoutTrailingSlashes } from "./lib/router";
import { findPage, preloadRealm } from "./realms";

const NOT_FOUND = {
  en: {
    all: "see all realms",
    sub: "That page does not exist, but the realms do.",
    title: "Nothing here",
  },
  fr: {
    all: "voir tous les royaumes",
    sub: "Cette page n’existe pas, mais les royaumes, si.",
    title: "Rien ici",
  },
};

const NotFound = () => {
  const t = useCopy(NOT_FOUND);

  return (
    <>
      <Header icon={<RealmsIcon />} name={APP_NAME} href="/" />
      <main className="page">
        <section className="panel empty">
          <span className="legend">404.txt</span>
          <h2 className="display page__title">{t.title}</h2>
          <p className="page__sub">{t.sub}</p>
          <Link href="/" className="btn btn--primary">
            {t.all}
          </Link>
        </section>
      </main>
    </>
  );
};

/** The page for `path`: the hub, a realm's page, or none. */
const PageAt = ({ path }: { path: string }): ReactNode => {
  const language = useLanguage();
  const found = path === "/" ? null : findPage(path);
  const realm = found?.realm;

  // Once a realm's page is open, its other pages load while the browser
  // is idle, so going to them doesn't wait the first time
  useEffect(() => {
    if (!realm) {
      return;
    }

    const id = window.setTimeout(() => preloadRealm(realm), 300);

    return () => window.clearTimeout(id);
  }, [realm]);

  if (path === "/") {
    return <Hub />;
  }

  if (!found) {
    return <NotFound />;
  }

  const { page } = found;
  const name = page.name[language];
  const title = page.slug ? `${name} · ${found.realm.name[language]}` : name;

  return (
    <>
      {/* React puts this in the head while the page is open. */}
      <title>{`${title} · ${APP_NAME}`}</title>
      {/* The header stays while the page under it changes */}
      <RealmHeader realm={found.realm.slug} here={page.slug} />
      <Suspense fallback={<main className="page" aria-busy="true" />}>
        <page.Screen name={name} />
      </Suspense>
    </>
  );
};

/** Every page, and the footer under it. */
export const App = () => {
  // "/book-of-shadows/" and "/book-of-shadows" are the same page.
  const path = withoutTrailingSlashes(usePath()) || "/";

  return (
    <>
      <PageAt path={path} />
      <Footer />
    </>
  );
};
