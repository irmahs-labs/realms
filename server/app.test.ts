// @vitest-environment node
import { once } from "node:events";
import type { AddressInfo } from "node:net";

import { serve } from "@hono/node-server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { Brewers } from "../src/realms/book-of-shadows/potion-brewing/brewing";
import { createApp } from "./app";
import type { WhoIs } from "./session";

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

const { app } = createApp({ appOrigin: ORIGIN, potions, whoIs });

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
