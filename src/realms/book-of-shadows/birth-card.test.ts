import { describe, expect, it } from "vitest";

import { birthCards, birthNumber } from "./birth-card";

describe("birth cards", () => {
  it("adds the month, the day and the year, then the digits", () => {
    // 7 + 15 + 1990 = 2012, 2 + 0 + 1 + 2 = 5
    expect(birthNumber({ date: 15, month: 7, year: 1990 })).toBe(5);
    // 3 + 26 + 1985 = 2014, 7
    expect(birthNumber({ date: 26, month: 3, year: 1985 })).toBe(7);
  });

  it("gives one card for a single digit, two for a number of two", () => {
    expect(
      birthCards({ date: 15, month: 7, year: 1990 }).map((card) => card.name)
    ).toEqual(["The Hierophant"]);

    // 11 + 25 + 1980 = 2016, 9; 12 + 31 + 1999 = 2042, 8; 9 + 1 + 2000 = 2010, 3
    // 10 + 7 + 2001 = 2018, 11 → Justice, then 1 + 1 = 2, The High Priestess
    expect(
      birthCards({ date: 7, month: 10, year: 2001 }).map((card) => card.name)
    ).toEqual(["Justice", "The High Priestess"]);
  });

  it("counts 22 as The Fool", () => {
    // 12 + 9 + 1 = 22, with the year 1
    expect(birthCards({ date: 9, month: 12, year: 1 })[0]?.name).toBe(
      "The Fool"
    );
  });
});
