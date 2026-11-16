import { describe, expect, it } from "vitest";

import { duoOf, isValidName, tidyName } from "./rules";

describe("tidyName", () => {
  it("drops spaces at the ends and makes every run one", () => {
    expect(tidyName("  Kaela   of  the   Reeds ")).toBe("Kaela of the Reeds");
  });
});

describe("isValidName", () => {
  it("takes letters from any script, with spaces, hyphens and apostrophes", () => {
    for (const name of [
      "Kaela",
      "Žarko",
      "Ljósa",
      "Anne-Sophie",
      "D’Arcy",
      "春林",
      "Himani",
    ]) {
      expect(isValidName(name)).toBe(true);
    }
  });

  it("refuses empty or long names, digits, links and signs", () => {
    for (const name of [
      "",
      "A".repeat(31),
      "Kaela2",
      "www.example.com",
      "St. Ember",
      "@kaela",
      "-Kaela",
      "<b>",
      "x_y",
    ]) {
      expect(isValidName(name)).toBe(false);
    }
  });

  it("allows exactly 30 characters", () => {
    expect(isValidName("A".repeat(30))).toBe(true);
  });
});

describe("duoOf", () => {
  const lightFire = { affinity: "light", element: "fire" } as const;
  const darkEarth = { affinity: "dark", element: "earth" } as const;

  it("puts the light draconoid's element first, whoever asks", () => {
    expect(duoOf(lightFire, darkEarth)).toEqual({
      dark: "earth",
      light: "fire",
    });
    expect(duoOf(darkEarth, lightFire)).toEqual({
      dark: "earth",
      light: "fire",
    });
  });

  it("keeps order meaningful: light fire with dark earth is not dark fire with light earth", () => {
    const darkFire = { affinity: "dark", element: "fire" } as const;
    const lightEarth = { affinity: "light", element: "earth" } as const;

    expect(duoOf(darkFire, lightEarth)).toEqual({
      dark: "fire",
      light: "earth",
    });
  });

  it("unleashes nothing between two of the same affinity", () => {
    expect(duoOf(lightFire, { affinity: "light", element: "air" })).toBeNull();
    expect(duoOf(darkEarth, darkEarth)).toBeNull();
  });
});
