import { bookStateSchema, loadState, saveState } from "./profile";
import type { BookState } from "./profile";

/**
 * The Book of Shadows moved here from Mini Games, and a browser keeps each
 * site's localStorage apart, so a visitor's book can't simply be read. Mini
 * Games' old page sends it instead, in the address's fragment, which never
 * reaches any server: realms.irmahs.dev/book-of-shadows#book=<data>, the data
 * being the book's JSON, UTF-8, in base64url (encodeBook).
 */
const PREFIX = "#book=";

const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCodePoint(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/[=]+$/u, "");

const fromBase64Url = (text: string): Uint8Array =>
  Uint8Array.from(
    atob(text.replaceAll("-", "+").replaceAll("_", "/")),
    (char) => char.codePointAt(0) ?? 0
  );

/** A book as Mini Games sends it: the fragment, "#book=" and all. */
export const encodeBook = (state: BookState): string =>
  `${PREFIX}${toBase64Url(new TextEncoder().encode(JSON.stringify(state)))}`;

/**
 * The book in a fragment, read through the same schema as a saved one, or
 * null when the fragment carries none or one that can't be read.
 */
export const carriedBook = (hash: string): BookState | null => {
  if (!hash.startsWith(PREFIX)) {
    return null;
  }

  try {
    const json = new TextDecoder().decode(
      fromBase64Url(hash.slice(PREFIX.length))
    );

    const result = bookStateSchema.safeParse(JSON.parse(json));

    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

/** Whether a book has anything of the visitor's own in it yet. */
const isBlank = (state: BookState) =>
  !(state.profile.name.trim() || state.profile.birthDate);

/**
 * The book to open: one carried over from Mini Games, when this browser's
 * book here is still blank, kept from then on; otherwise the one saved here.
 * A book already filled in here is never written over. The fragment is taken
 * off the address either way, so a reload or a shared link carries nothing.
 */
export const openBook = (): BookState => {
  const carried = carriedBook(window.location.hash);
  const here = loadState();

  if (window.location.hash.startsWith(PREFIX)) {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search
    );
  }

  if (!carried || !isBlank(here)) {
    return here;
  }

  saveState(carried);

  return carried;
};
