import * as z from "zod/mini";

import { fetchParsed } from "../../lib/fetch-parsed";

/**
 * The witch quiz lives on Mini Games (minigames.irmahs.dev/quizzes), which
 * keeps a signed-in visitor's last result on their account. This server
 * asks it for theirs with their cookie (server/witch-quiz.ts) and passes the
 * answer on, so the Book of Shadows can show it on the profile. The answer
 * names each result in both languages: nothing here copies the quiz.
 */

/** Where the quiz is taken, and taken again. */
export const WITCH_QUIZ_URL =
  "https://minigames.irmahs.dev/quizzes/what-type-of-witch";

const words = z.object({ en: z.string(), fr: z.string() });

const rankedResult = z.object({
  about: words,
  id: z.string(),
  name: words,
  points: z.int(),
});

/** Mini Games' GET /api/quizzes/what-type-of-witch/result, as it answers. */
export const witchQuizAnswer = z.object({
  result: z.nullable(
    z.object({
      /** The witches that scored, most points first: the first is theirs. */
      ranked: z.array(rankedResult),
      /** When the quiz was finished, as an ISO date. */
      takenAt: z.string(),
    })
  ),
  signedIn: z.boolean(),
});

export type WitchQuizAnswer = z.infer<typeof witchQuizAnswer>;

/** The visitor's witch quiz result, or null when it can't be reached. */
export const fetchWitchQuiz = (): Promise<WitchQuizAnswer | null> =>
  fetchParsed("/api/book-of-shadows/witch-quiz", witchQuizAnswer);
