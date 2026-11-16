// @vitest-environment node
import { once } from "node:events";
import type { AddressInfo } from "node:net";

import { serve } from "@hono/node-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { Brewers } from "../src/realms/book-of-shadows/potion-brewing/brewing";
import type { Hall, HallEntry } from "../src/realms/court-of-draconia/api";
import { createApp } from "./app";
import type { DraconoidFields } from "./draconoids";
import type { WhoIs } from "./session";
import type { AskWitchQuiz } from "./witch-quiz";

const ORIGIN = "http://localhost:5173";
const ANA = { id: "00000000-0000-4000-8000-00000000000a", name: "Ana Lopez" };
const BEN = { id: "00000000-0000-4000-8000-00000000000b", name: "Ben" };
const CY = { id: "00000000-0000-4000-8000-00000000000c", name: "Cy" };

/** Stands in for the account service: a cookie per test account. */
const ACCOUNTS = new Map([
  ["session=ana", ANA],
  ["session=ben", BEN],
  ["session=cy", CY],
]);

const whoIs: WhoIs = (cookie) =>
  Promise.resolve({
    account: (cookie && ACCOUNTS.get(cookie)) || null,
    setCookies: [],
  });

/** Stands in for the potion_brewing_brews table: who brewed what, in order. */
const brewLog: { potion: string; id: string; name: string }[] = [];
let latest: { name: string; potion: string; at: string } | null = null;

/** Stands in for potion_brewing_solo_brews: each player's own finds. */
const soloLog = new Map<string, Map<string, string>>();

const soloFindsOf = (userId: string) => {
  const finds = soloLog.get(userId) ?? new Map<string, string>();

  soloLog.set(userId, finds);

  return finds;
};

const brewersOf = (potion: string, userId: string | null): Brewers => {
  const rows = brewLog.filter((row) => row.potion === potion);

  return {
    at: "2026-10-22T10:00:00.000Z",
    by: rows[0]?.name ?? "",
    count: rows.length,
    last: null,
    yours: rows.some((row) => row.id === userId),
  };
};

const potions = {
  readBrewers: (potion: string) =>
    Promise.resolve(
      brewLog.flatMap((row) =>
        row.potion === potion
          ? [{ at: "2026-10-22T10:00:00.000Z", name: row.name }]
          : []
      )
    ),
  readBrews: (userId: string | null) =>
    Promise.resolve(
      new Map(
        [...new Set(brewLog.map((row) => row.potion))].map((potion) => [
          potion,
          brewersOf(potion, userId),
        ])
      )
    ),
  readLatest: () => Promise.resolve(latest),
  readSoloFinds: (userId: string) =>
    Promise.resolve(new Map(soloFindsOf(userId))),
  recordBrew: (potion: string, account: { id: string; name: string }) => {
    const isNew = !brewLog.some(
      (row) => row.potion === potion && row.id === account.id
    );

    if (isNew) {
      brewLog.push({ id: account.id, name: account.name, potion });
    }

    latest = { at: new Date().toISOString(), name: account.name, potion };

    const brewers = brewersOf(potion, account.id);

    return Promise.resolve({
      brewers,
      first: isNew && brewers.count === 1,
      isNew,
    });
  },
  recordSoloBrew: (userId: string, potion: string) => {
    const finds = soloFindsOf(userId);
    const isNew = !finds.has(potion);

    if (isNew) {
      finds.set(potion, "2026-10-22T12:00:00.000Z");
    }

    return Promise.resolve({ foundAt: finds.get(potion) ?? "", isNew });
  },
  resetSolo: (userId: string) => {
    soloLog.delete(userId);

    return Promise.resolve();
  },
};

/** Stands in for court_of_draconia_draconoids: each account's draconoid, by account id. */
const hallLog = new Map<string, HallEntry>();
let nextDraconoid = 1;

const draconoids = {
  readHall: (limit: number) =>
    Promise.resolve([...hallLog.values()].toReversed().slice(0, limit)),
  readMine: (userId: string) => Promise.resolve(hallLog.get(userId) ?? null),
  remove: (id: string) => {
    const found = [...hallLog].find(([, entry]) => entry.id === id);

    if (found) {
      hallLog.delete(found[0]);
    }

    return Promise.resolve(Boolean(found));
  },
  removeMine: (userId: string) => {
    hallLog.delete(userId);

    return Promise.resolve();
  },
  save: (account: { id: string; name: string }, fields: DraconoidFields) => {
    const before = hallLog.get(account.id);

    const entry: HallEntry = {
      at: before?.at ?? "2026-11-17T09:00:00.000Z",
      id: before?.id ?? String(nextDraconoid),
      owner: account.name,
      tier: before?.tier ?? "bronze",
      ...fields,
    };

    if (!before) {
      nextDraconoid += 1;
    }

    hallLog.set(account.id, entry);

    return Promise.resolve(entry);
  },
};

/** Stands in for Mini Games: Ben took the witch quiz signed in, Cy didn't. */
const witchQuiz: AskWitchQuiz = (cookie) => {
  if (cookie === "session=down") {
    return Promise.resolve(null);
  }

  const result =
    cookie === "session=ben"
      ? {
          ranked: [
            {
              about: { en: "Code is a spell.", fr: "Le code est un sort." },
              id: "tech",
              name: { en: "Tech witch", fr: "Sorcière tech" },
              points: 41,
            },
          ],
          takenAt: "2026-11-16T10:00:00.000Z",
        }
      : null;

  return Promise.resolve({ result, signedIn: Boolean(cookie) });
};

const { app } = createApp({
  appOrigin: ORIGIN,
  draconoids,
  // Ana is on Alma Housila's list in the account service's APP_ACCESS.
  isAdmin: (cookie) => Promise.resolve(cookie === "session=ana"),
  potions,
  whoIs,
  witchQuiz,
});

const server = serve({ fetch: app.fetch, port: 0 });

let base = "";

beforeAll(async () => {
  if (!server.listening) {
    await once(server, "listening");
  }

  // SAFETY: a server listening on a TCP port reports an AddressInfo, never a
  // pipe name.
  const { port } = server.address() as AddressInfo;

  base = `127.0.0.1:${port}`;
});

afterAll(() => {
  server.close();
});

describe("/api", () => {
  it("names the signed-in player by first name and initial", async () => {
    const response = await fetch(`http://${base}/api/me`, {
      headers: { cookie: "session=ana" },
    });

    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({ account: { name: "Ana L." } });
  });
});

/** The classic ginger shot: Ember's Embrace. */
const GINGER_SHOT = [
  { name: "Apple" },
  { name: "Lime" },
  { form: "fresh", name: "Ginger" },
  { name: "Cayenne" },
];

const MYSTERY = [{ name: "Kale" }, { name: "Mango" }];

/** What a page might send, sense or not: a test sends some of each. */
type Sent = readonly { name: string; form?: string }[] | string;

const brewAs = (cookie: string, ingredients: Sent, origin = ORIGIN) =>
  fetch(`http://${base}/api/potions/brew`, {
    body: JSON.stringify({ ingredients }),
    headers: { "content-type": "application/json", cookie, origin },
    method: "POST",
  });

const statusOf = async (response: Promise<Response>) => {
  const { status } = await response;

  return status;
};

const bodyOf = async (response: Promise<Response>) => {
  const answer = await response;

  return answer.json();
};

describe("/api/potions", () => {
  it("shows everyone the book, every page locked until someone brews it", async () => {
    const book = await bodyOf(fetch(`http://${base}/api/potions`));

    expect(book.latest).toBeNull();
    expect(book.pages).toHaveLength(115);
    expect(book.pages[0]).toEqual({
      clue: expect.any(String),
      state: "locked",
    });
  });

  it("takes brews only from the site itself, and only signed in", async () => {
    const elsewhere = "https://evil.irmahs.dev";

    expect(await statusOf(brewAs("session=ana", GINGER_SHOT, elsewhere))).toBe(
      403
    );
    expect(await statusOf(brewAs("", GINGER_SHOT))).toBe(401);
  });

  it("refuses a cauldron that cannot be", async () => {
    const powderedGinger = [
      { name: "Lemon" },
      { form: "powder", name: "Ginger" },
    ];

    const newt = [{ name: "Newt" }, { name: "Lemon" }];

    expect(await statusOf(brewAs("session=ana", powderedGinger))).toBe(400);
    expect(await statusOf(brewAs("session=ana", newt))).toBe(400);
    expect(await statusOf(brewAs("session=ana", "soup"))).toBe(400);
  });

  it("hints at a mystery and writes nothing down", async () => {
    const answer = await bodyOf(brewAs("session=ana", MYSTERY));

    expect(answer).toMatchObject({ size: 2, type: "mystery" });
    expect(brewLog).toEqual([]);
  });

  it("puts the first brewer's name on the page, and counts the rest", async () => {
    expect(await bodyOf(brewAs("session=ana", GINGER_SHOT))).toMatchObject({
      first: true,
      isNew: true,
      page: { by: "Ana L.", name: "Ember's Embrace", others: 0, yours: true },
      type: "potion",
    });

    expect(await bodyOf(brewAs("session=ben", GINGER_SHOT))).toMatchObject({
      first: false,
      isNew: true,
      page: { by: "Ana L.", others: 1, yours: true },
    });

    expect(await bodyOf(brewAs("session=ben", GINGER_SHOT))).toMatchObject({
      first: false,
      isNew: false,
    });

    const book = await bodyOf(
      fetch(`http://${base}/api/potions`, {
        headers: { cookie: "session=ben" },
      })
    );

    expect(book.pages[0]).toMatchObject({
      by: "Ana L.",
      // Fruit, then spices, each alphabetically.
      ingredients: ["Apple", "Lime", "Cayenne", "Fresh ginger"],
      state: "found",
      yours: true,
    });
    expect(book.latest).toMatchObject({
      name: "Ben",
      potion: "Ember's Embrace",
    });
  });

  it("names everyone who brewed a potion, first first", async () => {
    const query = new URLSearchParams({ potion: "Ember's Embrace" });

    const { brewers } = await bodyOf(
      fetch(`http://${base}/api/potions/brewers?${query}`)
    );

    expect(brewers.map((brewer: { name: string }) => brewer.name)).toEqual([
      "Ana L.",
      "Ben",
    ]);
    expect(
      await statusOf(fetch(`http://${base}/api/potions/brewers?potion=Soup`))
    ).toBe(404);
  });

  it("lets nobody try every mix in a hurry", async () => {
    const statuses: number[] = [];

    for (let i = 0; i < 31; i += 1) {
      // One after another, as a player would.
      // oxlint-disable-next-line no-await-in-loop
      statuses.push(await statusOf(brewAs("session=cy", MYSTERY)));
    }

    expect(statuses.slice(0, 30).every((status) => status === 200)).toBe(true);
    expect(statuses[30]).toBe(429);
  });
});

const soloBrewAs = (cookie: string, ingredients: Sent, origin = ORIGIN) =>
  fetch(`http://${base}/api/potions/solo/brew`, {
    body: JSON.stringify({ ingredients }),
    headers: { "content-type": "application/json", cookie, origin },
    method: "POST",
  });

const soloBookOf = (cookie: string) =>
  fetch(`http://${base}/api/potions/solo`, { headers: { cookie } });

const startOver = (cookie: string, origin = ORIGIN) =>
  fetch(`http://${base}/api/potions/solo`, {
    headers: { cookie, origin },
    method: "DELETE",
  });

/** Autumn Hearth, a jujube and dried ginger tea. */
const JUJUBE_TEA = [{ name: "Jujube" }, { form: "dried", name: "Ginger" }];

describe("/api/potions/solo", () => {
  it("keeps a book only for someone signed in", async () => {
    expect(await statusOf(soloBookOf(""))).toBe(401);
    expect(await statusOf(soloBrewAs("", JUJUBE_TEA))).toBe(401);
    expect(await statusOf(startOver(""))).toBe(401);
  });

  it("starts every player's own book empty", async () => {
    const { pages } = await bodyOf(soloBookOf("session=ana"));

    expect(pages).toHaveLength(115);
    expect(
      pages.every((page: { state: string }) => page.state === "locked")
    ).toBe(true);
  });

  it("puts a solo brew in the player's own book, and nowhere else", async () => {
    const before = brewLog.length;

    expect(await bodyOf(soloBrewAs("session=ana", JUJUBE_TEA))).toMatchObject({
      isNew: true,
      page: { foundAt: expect.any(String), name: "Autumn Hearth" },
      type: "potion",
    });
    expect(await bodyOf(soloBrewAs("session=ana", JUJUBE_TEA))).toMatchObject({
      isNew: false,
    });

    const own = await bodyOf(soloBookOf("session=ana"));
    const bens = await bodyOf(soloBookOf("session=ben"));

    expect(
      own.pages.filter((page: { state: string }) => page.state === "found")
    ).toHaveLength(1);
    expect(
      bens.pages.filter((page: { state: string }) => page.state === "found")
    ).toHaveLength(0);
    expect(brewLog).toHaveLength(before);
  });

  it("hints at the potions the player has still to find", async () => {
    // Ana found Ember's Embrace in the shared book, not in her own.
    const answer = await bodyOf(
      soloBrewAs("session=ana", [
        { name: "Apple" },
        { name: "Lime" },
        { form: "fresh", name: "Ginger" },
        { form: "fresh", name: "Mint" },
      ])
    );

    expect(answer).toMatchObject({
      closest: { missing: ["spice"], name: "Ember's Embrace", shared: 3 },
      type: "mystery",
    });
  });

  it("starts over only from the site itself", async () => {
    expect(
      await statusOf(startOver("session=ana", "https://evil.irmahs.dev"))
    ).toBe(403);
    expect(await statusOf(startOver("session=ana"))).toBe(204);

    const { pages } = await bodyOf(soloBookOf("session=ana"));

    expect(
      pages.every((page: { state: string }) => page.state === "locked")
    ).toBe(true);
  });
});

/** A draconoid as a page might send it, sense or not. */
interface SentDraconoid {
  affinity: string;
  element: string;
  name: string;
  role: string;
  tier?: string;
}

const KAELA: SentDraconoid = {
  affinity: "dark",
  element: "fire",
  name: "  Kaela   Ember ",
  role: "seer",
};

const saveAs = (cookie: string, sent: SentDraconoid, origin = ORIGIN) =>
  fetch(`http://${base}/api/court-of-draconia/me`, {
    body: JSON.stringify(sent),
    headers: { "content-type": "application/json", cookie, origin },
    method: "PUT",
  });

const hallAs = (cookie = ""): Promise<Hall> =>
  bodyOf(
    fetch(`http://${base}/api/court-of-draconia/hall`, {
      headers: cookie ? { cookie } : {},
    })
  );

const mineOf = async (cookie: string): Promise<HallEntry | null> => {
  const { mine } = await hallAs(cookie);

  return mine;
};

const takeDown = (cookie: string, id: string, origin = ORIGIN) =>
  fetch(`http://${base}/api/court-of-draconia/draconoids/${id}`, {
    headers: { cookie, origin },
    method: "DELETE",
  });

describe("/api/court-of-draconia", () => {
  it("makes a draconoid at bronze, its name tidied, and shows it in the hall", async () => {
    const saved = await bodyOf(saveAs("session=ben", KAELA));

    expect(saved).toMatchObject({
      affinity: "dark",
      element: "fire",
      name: "Kaela Ember",
      owner: "Ben",
      role: "seer",
      tier: "bronze",
    });

    const seen = await hallAs();
    expect(seen.mine).toBeNull();
    expect(seen.admin).toBe(false);
    expect(seen.draconoids.map((d) => d.name)).toContain("Kaela Ember");
    expect(JSON.stringify(seen)).not.toContain(BEN.id);

    const mine = await mineOf("session=ben");
    expect(mine?.name).toBe("Kaela Ember");
  });

  it("never takes a tier from the page", async () => {
    const saved = await bodyOf(
      saveAs("session=cy", { ...KAELA, name: "Wren", tier: "multichrome" })
    );

    expect(saved.tier).toBe("bronze");
  });

  it("refuses the signed out, other sites and names the hall can't show", async () => {
    expect(await statusOf(saveAs("", KAELA))).toBe(401);
    expect(
      await statusOf(saveAs("session=ben", KAELA, "https://evil.irmahs.dev"))
    ).toBe(403);

    const refused = await Promise.all(
      ["", "Kaela2", "www.example.com", "A".repeat(31)].map((name) =>
        statusOf(saveAs("session=ben", { ...KAELA, name }))
      )
    );

    expect(refused).toEqual([400, 400, 400, 400]);
    expect(
      await statusOf(saveAs("session=ben", { ...KAELA, element: "aether" }))
    ).toBe(400);
  });

  it("lets only an admin take someone's draconoid down", async () => {
    await saveAs("session=cy", { ...KAELA, name: "Wren" });
    const wren = await mineOf("session=cy");
    const id = wren?.id ?? "";
    const asAna = await hallAs("session=ana");

    expect(await statusOf(takeDown("session=ben", id))).toBe(403);
    expect(asAna.admin).toBe(true);
    expect(await statusOf(takeDown("session=ana", id))).toBe(204);
    expect(await mineOf("session=cy")).toBeNull();
    expect(await statusOf(takeDown("session=ana", id))).toBe(404);
    expect(await statusOf(takeDown("session=ana", "1;drop"))).toBe(404);
  });

  it("lets a draconoid go when its maker asks", async () => {
    await saveAs("session=ben", KAELA);

    const status = await statusOf(
      fetch(`http://${base}/api/court-of-draconia/me`, {
        headers: { cookie: "session=ben", origin: ORIGIN },
        method: "DELETE",
      })
    );

    expect(status).toBe(204);
    expect(await mineOf("session=ben")).toBeNull();
  });
});

/** The Book of Shadows' witch quiz result, asked as `cookie`. */
const askWitchQuizAs = (cookie: string) =>
  fetch(`http://${base}/api/book-of-shadows/witch-quiz`, {
    headers: { cookie },
  });

describe("/api/book-of-shadows/witch-quiz", () => {
  it("passes on the witch type Mini Games keeps for the visitor", async () => {
    expect(await bodyOf(askWitchQuizAs("session=ben"))).toMatchObject({
      result: { ranked: [{ id: "tech", name: { en: "Tech witch" } }] },
      signedIn: true,
    });
    expect(await bodyOf(askWitchQuizAs("session=cy"))).toEqual({
      result: null,
      signedIn: true,
    });
    expect(await bodyOf(askWitchQuizAs(""))).toEqual({
      result: null,
      signedIn: false,
    });
  });

  it("says so when Mini Games can't be reached", async () => {
    expect(await statusOf(askWitchQuizAs("session=down"))).toBe(502);
  });
});
