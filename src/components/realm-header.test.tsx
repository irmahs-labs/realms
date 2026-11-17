// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RealmHeader } from "./realm-header";

// The account pill asks who is signed in: nobody, here
vi.stubGlobal(
  "fetch",
  vi.fn().mockResolvedValue(Response.json({ account: null }))
);

// React's flag for act(), as a test runner sets it
Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);

afterEach(() => {
  document.body.innerHTML = "";
});

/** The header as the page draws it, to look through. */
const drawn = (realm: string, here: string) => {
  const page = document.createElement("div");

  document.body.append(page);
  act(() => createRoot(page).render(<RealmHeader realm={realm} here={here} />));

  return page;
};

const hrefs = (links: NodeListOf<Element>) =>
  [...links].map((link) => link.getAttribute("href"));

describe("RealmHeader", () => {
  it("keeps the header to the realm's name and the shared pills", () => {
    const page = drawn("book-of-shadows", "");

    // Only the phone's menu, a dialog inside it, links back to every realm
    const back = [...page.querySelectorAll("header a[href='/']")].filter(
      (link) => !link.closest("dialog")
    );

    expect(back).toEqual([]);
  });

  it("names the realm, and marks the open page among its tabs", () => {
    const page = drawn("book-of-shadows", "potion-brewing");

    expect(page.querySelector("h1")?.textContent).toBe("Book of Shadows");
    // A way back to every realm first, then the realm's pages
    expect(hrefs(page.querySelectorAll(".realm-tabs a"))).toEqual([
      "/",
      "/book-of-shadows",
      "/book-of-shadows/birth-chart",
      "/book-of-shadows/moon",
      "/book-of-shadows/sky",
      "/book-of-shadows/tarot",
      "/book-of-shadows/potion-brewing",
      "/book-of-shadows/spell-creator",
      "/book-of-shadows/compatibility",
    ]);
    expect(
      page.querySelector('.realm-tabs [aria-current="page"]')?.textContent
    ).toBe("Potion Brewing");
  });

  it("lists every realm and its pages in the phone's menu", () => {
    const page = drawn("court-of-draconia", "hall");
    const menu = hrefs(page.querySelectorAll(".realm-drawer a"));

    expect(menu).toContain("/book-of-shadows/spell-creator");
    expect(menu).toContain("/");
    expect(
      page
        .querySelector('.realm-drawer [aria-current="page"]')
        ?.getAttribute("href")
    ).toBe("/court-of-draconia/hall");
  });
});
