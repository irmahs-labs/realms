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
  [
    "Draconoids are only made from the site itself.",
    "Les draconoïdes ne sont créés que depuis le site lui-même.",
  ],
  [
    "Sign in to make your draconoid.",
    "Connectez-vous pour créer votre draconoïde.",
  ],
  [
    "That's a lot of changes. Try again in a minute.",
    "Ça fait beaucoup de changements. Réessayez dans une minute.",
  ],
  [
    "A name is 1 to 30 letters, with spaces, hyphens or apostrophes between them.",
    "Un nom fait 1 à 30 lettres, avec des espaces, des traits d’union ou des apostrophes entre elles.",
  ],
  [
    "Draconoids are only let go from the site itself.",
    "Les draconoïdes ne sont libérés que depuis le site lui-même.",
  ],
  [
    "Sign in to let your draconoid go.",
    "Connectez-vous pour libérer votre draconoïde.",
  ],
  [
    "Draconoids are only taken down from the site itself.",
    "Les draconoïdes ne sont retirés que depuis le site lui-même.",
  ],
  [
    "Sign in to take a draconoid down.",
    "Connectez-vous pour retirer un draconoïde.",
  ],
  [
    "Only an admin can take a draconoid down.",
    "Seul un admin peut retirer un draconoïde.",
  ],
  ["There is no such draconoid.", "Ce draconoïde n’existe pas."],
  // The hall's own, when the server didn't say
  ["Your draconoid wasn't saved.", "Votre draconoïde n’a pas été enregistré."],
  ["Your draconoid wasn't let go.", "Votre draconoïde n’a pas été libéré."],
  ["That draconoid wasn't taken down.", "Ce draconoïde n’a pas été retiré."],
  [
    "The hall's answer made no sense.",
    "La réponse de la salle n’avait aucun sens.",
  ],
  [
    "The hall can't be reached right now.",
    "La salle est injoignable pour le moment.",
  ],
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
