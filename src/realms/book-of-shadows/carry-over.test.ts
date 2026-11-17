// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";

import { carriedBook, encodeBook, openBook } from "./carry-over";
import { STORAGE_KEY, defaultState, loadState } from "./profile";

const withProfile = (name: string, birthDate = "") => ({
  ...defaultState(),
  profile: { ...defaultState().profile, birthDate, name },
});

/**
 * A book already saved in this browser, as localStorage holds it: JSON text.
 * The fields it leaves out come back as their defaults when it's read.
 */
const storeBook = (json: string) => localStorage.setItem(STORAGE_KEY, json);

afterEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("carriedBook", () => {
  it("reads back what encodeBook wrote, accents and all", () => {
    const book = withProfile("Zoé Ðặng", "1994-03-21");

    expect(carriedBook(encodeBook(book))).toEqual(book);
  });

  it("fills in what an older book lacks, as a saved one would be", () => {
    // An older Mini Games book, as plain ASCII JSON in base64url.
    const older = btoa(JSON.stringify({ profile: { name: "Ana" } })).replace(
      /[=]+$/u,
      ""
    );

    const carried = carriedBook(`#book=${older}`);

    expect(carried?.profile.name).toBe("Ana");
    expect(carried?.southern).toBe(false);
  });

  it("finds nothing in any other fragment, or in a damaged one", () => {
    expect(carriedBook("")).toBeNull();
    expect(carriedBook("#moon")).toBeNull();
    expect(carriedBook("#book=not*base64")).toBeNull();
    expect(carriedBook(`#book=${btoa("[1, 2")}`)).toBeNull();
  });
});

describe("openBook", () => {
  it("keeps a book carried over from Mini Games, and clears the address", () => {
    const book = withProfile("Ana", "1990-01-02");
    window.history.replaceState(
      null,
      "",
      `/book-of-shadows${encodeBook(book)}`
    );

    expect(openBook()).toEqual(book);
    expect(loadState()).toEqual(book);
    expect(window.location.hash).toBe("");
    expect(window.location.pathname).toBe("/book-of-shadows");
  });

  it("never writes over a book already filled in here", () => {
    storeBook('{"profile":{"name":"Ben"}}');
    window.history.replaceState(
      null,
      "",
      `/book-of-shadows${encodeBook(withProfile("Ana"))}`
    );

    expect(openBook().profile.name).toBe("Ben");
    expect(loadState().profile.name).toBe("Ben");
    expect(window.location.hash).toBe("");
  });

  it("takes a carried book over a blank one saved by a first visit", () => {
    storeBook("{}");
    window.history.replaceState(
      null,
      "",
      `/book-of-shadows${encodeBook(withProfile("Ana"))}`
    );

    expect(openBook().profile.name).toBe("Ana");
  });

  it("opens the book saved here when nothing is carried", () => {
    storeBook('{"profile":{"name":"Cy"}}');

    expect(openBook().profile.name).toBe("Cy");
  });
});
