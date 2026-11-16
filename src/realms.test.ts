import { describe, expect, it } from "vitest";

import { REALMS, findPage, pathOf, realmOf } from "./realms";

describe("realms", () => {
  it("gives every realm a first page at its own address", () => {
    for (const realm of REALMS) {
      const [home] = realm.pages;

      expect(home?.slug).toBe("");
      expect(home && pathOf(realm, home)).toBe(`/${realm.slug}`);
    }
  });

  it("finds each page of the Book of Shadows", () => {
    expect(findPage("/book-of-shadows")?.page.slug).toBe("");
    expect(findPage("/book-of-shadows/potion-brewing")?.page.name.en).toBe(
      "Potion Brewing"
    );
    expect(findPage("/book-of-shadows/spell-creator")?.realm.slug).toBe(
      "book-of-shadows"
    );
  });

  it("finds nothing at an address no realm has", () => {
    expect(findPage("/booster-potion")).toBeNull();
    expect(findPage("/book-of-shadows/nowhere")).toBeNull();
    expect(findPage("/")).toBeNull();
  });

  it("gives every page an address of its own", () => {
    const paths = REALMS.flatMap((realm) =>
      realm.pages.map((page) => pathOf(realm, page))
    );

    expect(new Set(paths).size).toBe(paths.length);
  });

  it("refuses a realm that does not exist", () => {
    expect(() => realmOf("atlantis")).toThrow();
  });
});
