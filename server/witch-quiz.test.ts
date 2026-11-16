// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import { askWitchQuiz } from "./witch-quiz";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("askWitchQuiz", () => {
  it("asks Mini Games with the visitor's own cookie", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ result: null, signedIn: true }));

    vi.stubGlobal("fetch", fetchMock);

    expect(await askWitchQuiz("http://minigames:3000")("session=ana")).toEqual({
      result: null,
      signedIn: true,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "http://minigames:3000/api/quizzes/what-type-of-witch/result",
      expect.objectContaining({ headers: { cookie: "session=ana" } })
    );
  });

  it("gives up on a refusal, an answer it can't read, or no address", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(new Response("no", { status: 500 }))
        .mockResolvedValueOnce(Response.json({ nonsense: true }))
        .mockRejectedValueOnce(new Error("down"))
    );

    const ask = askWitchQuiz("http://minigames:3000");

    expect(await ask("session=ana")).toBeNull();
    expect(await ask("session=ana")).toBeNull();
    expect(await ask("session=ana")).toBeNull();
    expect(await askWitchQuiz(undefined)("session=ana")).toBeNull();
  });
});
