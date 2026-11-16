// @vitest-environment node
// Runs against a real Postgres with the migrations applied, given in
// TEST_DATABASE_URL: the Database workflow sets it, and so can you after
// `npm run db:up`. Without it these tests are skipped.
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { connect } from "./db";
import {
  readHall,
  readMine,
  removeDraconoid,
  removeMine,
  saveDraconoid,
} from "./draconoids";

const url = process.env.TEST_DATABASE_URL;
const pool = connect(url ?? "postgres://unused");

const ana = { id: "00000000-0000-4000-8000-00000000000a", name: "Ana L." };
const ben = { id: "00000000-0000-4000-8000-00000000000b", name: "Ben" };

const kaela = {
  affinity: "dark",
  element: "fire",
  name: "Kaela",
  role: "seer",
} as const;

describe.skipIf(!url)("the Court of Draconia's hall in Postgres", () => {
  beforeEach(async () => {
    await pool.query("truncate court_of_draconia_draconoids restart identity");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("starts empty", async () => {
    expect(await readHall(pool, 10)).toEqual([]);
    expect(await readMine(pool, ana.id)).toBeNull();
  });

  it("makes a draconoid at bronze, under its maker's short name", async () => {
    const saved = await saveDraconoid(pool, ana, kaela);

    expect(saved).toMatchObject({
      ...kaela,
      id: "1",
      owner: "Ana L.",
      tier: "bronze",
    });
    expect(await readMine(pool, ana.id)).toEqual(saved);
  });

  it("remakes the same draconoid, keeping its number, tier and first day", async () => {
    const first = await saveDraconoid(pool, ana, kaela);
    await pool.query("update court_of_draconia_draconoids set tier = 'silver'");

    const again = await saveDraconoid(pool, ana, {
      ...kaela,
      affinity: "light",
      name: "Kaela Dawn",
    });

    expect(again).toMatchObject({
      affinity: "light",
      at: first.at,
      id: first.id,
      name: "Kaela Dawn",
      tier: "silver",
    });
    expect(await readHall(pool, 10)).toHaveLength(1);
  });

  it("lists the newest first, up to the limit", async () => {
    await saveDraconoid(pool, ana, kaela);
    await saveDraconoid(pool, ben, { ...kaela, name: "Wren" });

    const newest = await readHall(pool, 10);

    expect(newest.map((d) => d.name)).toEqual(["Wren", "Kaela"]);
    expect(await readHall(pool, 1)).toHaveLength(1);
  });

  it("lets a draconoid go, by its maker or by its number", async () => {
    const wren = await saveDraconoid(pool, ben, { ...kaela, name: "Wren" });
    await saveDraconoid(pool, ana, kaela);

    await removeMine(pool, ana.id);
    expect(await readMine(pool, ana.id)).toBeNull();

    expect(await removeDraconoid(pool, wren.id)).toBe(true);
    expect(await removeDraconoid(pool, wren.id)).toBe(false);
    expect(await readHall(pool, 10)).toEqual([]);
  });

  it("refuses what the hall can't hold, even past the server's own checks", async () => {
    await expect(
      saveDraconoid(pool, ana, { ...kaela, name: "" })
    ).rejects.toThrow();
    await expect(
      // SAFETY: an element the page never offers, to check the table refuses it
      saveDraconoid(pool, ana, { ...kaela, element: "aether" as "fire" })
    ).rejects.toThrow();
  });
});
