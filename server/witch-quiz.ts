import { fetchParsed } from "../src/lib/fetch-parsed";
import { witchQuizAnswer } from "../src/realms/book-of-shadows/witch-quiz-api";
import type { WitchQuizAnswer } from "../src/realms/book-of-shadows/witch-quiz-api";

/** Asks for a visitor's witch quiz result with their cookie; null when it can't. */
export type AskWitchQuiz = (
  cookie: string | undefined
) => Promise<WitchQuizAnswer | null>;

/** How long Mini Games has to answer before the profile goes on without it. */
const TIMEOUT_MS = 3000;

/**
 * Asks Mini Games for the visitor's last witch quiz result, from the server
 * as it reaches Mini Games (http://minigames:3000 on the shared `proxy`
 * network), with the visitor's own cookie: Mini Games asks the account
 * service who that is, as this server does. Unset (as locally, where Mini
 * Games isn't running), it is never asked.
 */
export const askWitchQuiz =
  (minigamesUrl: string | undefined): AskWitchQuiz =>
  async (cookie) => {
    if (!minigamesUrl) {
      return null;
    }

    return await fetchParsed(
      `${minigamesUrl}/api/quizzes/what-type-of-witch/result`,
      witchQuizAnswer,
      {
        headers: cookie ? { cookie } : {},
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }
    );
  };
