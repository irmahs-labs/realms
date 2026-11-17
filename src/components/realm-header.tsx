import { useRef } from "react";

import { APP_NAME } from "../lib/brand";
import { Icon } from "../lib/icon";
import { useCopy, useLanguage } from "../lib/language";
import { Link } from "../lib/router";
import { REALMS, pathOf, realmOf } from "../realms";
import { Header } from "./header";

const COPY = {
  en: {
    all: "all realms",
    close: "Close the menu",
    menu: "Menu",
    pages: (realm: string) => `${realm}: its pages`,
    realms: "Every realm and its pages",
  },
  fr: {
    all: "tous les royaumes",
    close: "Fermer le menu",
    menu: "Menu",
    pages: (realm: string) => `${realm} : ses pages`,
    realms: "Tous les royaumes et leurs pages",
  },
};

/**
 * A phone's menu: a ☰ button in the header that opens a drawer from the
 * left with every realm and its pages, the one open in lime. A native
 * dialog, so Escape closes it and the focus stays inside while it's open.
 */
const RealmMenu = ({ realm, here }: { realm: string; here: string }) => {
  const t = useCopy(COPY);
  const language = useLanguage();
  const drawer = useRef<HTMLDialogElement>(null);
  const close = () => drawer.current?.close();

  return (
    <>
      <button
        type="button"
        className="icon-btn realm-menu-button"
        aria-label={t.menu}
        aria-haspopup="dialog"
        onClick={() => drawer.current?.showModal()}
      >
        <Icon name="menu" size={22} />
      </button>
      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- the backdrop press is a mouse shortcut; Escape closes the dialog natively */}
      <dialog
        ref={drawer}
        className="realm-drawer"
        aria-label={t.realms}
        // A press on the backdrop, outside the drawer itself, closes it
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <nav className="realm-drawer__body" aria-label={t.realms}>
          <button
            type="button"
            className="icon-btn realm-drawer__close"
            aria-label={t.close}
            onClick={close}
          >
            <Icon name="close" size={20} />
          </button>
          <Link href="/" className="realm-drawer__link" onClick={close}>
            <Icon name="back" size={16} />
            {t.all}
          </Link>
          {REALMS.map((entry) => (
            <section key={entry.slug} className="realm-drawer__realm">
              <h2 className="realm-drawer__title">{entry.name[language]}</h2>
              <ul className="realm-drawer__pages">
                {entry.pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={pathOf(entry, page)}
                      className="realm-drawer__link"
                      aria-current={
                        entry.slug === realm && page.slug === here
                          ? "page"
                          : undefined
                      }
                      onClick={close}
                    >
                      {page.name[language]}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </dialog>
    </>
  );
};

/**
 * Every realm page's header: the realm's icon and name, "Realms · by Irma
 * HS" under it, and the shared pills, nothing more. Under it, a quiet way
 * back to every realm, then the realm's pages as tabs, the open one lifted
 * in lime. On a phone the
 * tabs give way to the menu.
 */
export const RealmHeader = ({
  realm,
  here,
}: {
  realm: string;
  here: string;
}) => {
  const t = useCopy(COPY);
  const language = useLanguage();
  const entry = realmOf(realm);
  const name = entry.name[language];

  return (
    <>
      <Header
        icon={<entry.Icon />}
        name={name}
        href={`/${entry.slug}`}
        app={APP_NAME}
        lead={<RealmMenu realm={realm} here={here} />}
      />
      <nav className="realm-tabs" aria-label={t.pages(name)}>
        <Link href="/" className="realm-tabs__back">
          <Icon name="back" size={16} />
          {t.all}
        </Link>
        {entry.pages.map((page) => (
          <Link
            key={page.slug}
            href={pathOf(entry, page)}
            className="realm-tab"
            aria-current={page.slug === here ? "page" : undefined}
          >
            {page.name[language]}
          </Link>
        ))}
      </nav>
    </>
  );
};
