import type { Language } from "./language";

/**
 * The server's refusals are English sentences (server/app.ts). This is
 * each of them in French, for a visitor reading
 * the site in French; a sentence it doesn't know shows as the server wrote it.
 */
const FRENCH = new Map([
  [
    "Brews are only taken from the site itself.",
    "Les préparations ne sont acceptées que depuis le site lui-même.",
  ],
  ["Sign in to brew.", "Connectez-vous pour préparer une potion."],
  [
    "The cauldron needs a moment. Try again in a minute.",
    "Le chaudron a besoin d’un moment. Réessayez dans une minute.",
  ],
  ["That brew was not understood.", "Cette préparation n’a pas été comprise."],
  ["There is no potion by that name.", "Aucune potion ne porte ce nom."],
  [
    "Sign in to keep your own grimoire.",
    "Connectez-vous pour tenir votre propre grimoire.",
  ],
  [
    "Only the site itself can start a grimoire over.",
    "Seul le site lui-même peut recommencer un grimoire.",
  ],
  ["Sign in to start over.", "Connectez-vous pour recommencer."],
  // The cauldron's own, when the server didn't say
  ["The brew didn't go through.", "La préparation n’est pas passée."],
  [
    "The cauldron's answer made no sense.",
    "La réponse du chaudron n’avait aucun sens.",
  ],
  [
    "The cauldron can't be reached right now.",
    "Le chaudron est injoignable pour le moment.",
  ],
  [
    "Your grimoire could not be started over. Try again.",
    "Votre grimoire n’a pas pu être recommencé. Réessayez.",
  ],
]);

/** A sentence from the server, in the page's language. */
export const serverWords = (message: string, language: Language): string => {
  if (language === "en") {
    return message;
  }

  return FRENCH.get(message) ?? message;
};
