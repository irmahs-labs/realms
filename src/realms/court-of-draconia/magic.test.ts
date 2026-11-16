import { describe, expect, it } from "vitest";

import { LANGUAGES } from "../../lib/language";
import {
  AFFINITY_INFO,
  COURT,
  ELEMENT_INFO,
  POWERS,
  ROLE_INFO,
  ULTIMATES,
  bentElement,
} from "./magic";
import type { Words } from "./magic";
import { AFFINITIES, ELEMENTS, ROLES } from "./rules";

/** Every line, from every table, to check none is missing a language. */
const allWords = (): Words[] => [
  ...Object.values(ELEMENT_INFO).flatMap((e) => [e.name, e.base, e.season]),
  ...Object.values(AFFINITY_INFO).flatMap((a) => [a.name, a.of, a.about]),
  ...Object.values(POWERS).flatMap((pairs) =>
    pairs.flatMap((p) => [p.light, p.dark, p.mirror])
  ),
  ...Object.values(ROLE_INFO).flatMap((r) => [r.name, r.focus, ...r.skills]),
  ...ELEMENTS.flatMap((light) =>
    ELEMENTS.flatMap((dark) => [
      ULTIMATES[light][dark].name,
      ULTIMATES[light][dark].effect,
    ])
  ),
  ...COURT.flatMap((c) => [
    c.title,
    c.species,
    c.creature,
    c.origin,
    c.nameMeaning,
    ...(c.season ? [c.season] : []),
    ...(c.titleMeaning ? [c.titleMeaning] : []),
  ]),
];

describe("the Elemental Magic System", () => {
  it("says everything in every language", () => {
    for (const words of allWords()) {
      for (const language of LANGUAGES) {
        expect(words[language].trim()).not.toBe("");
      }
    }
  });

  it("gives each element three mirrored light and dark powers, all different", () => {
    const names = ELEMENTS.flatMap((element) => {
      expect(POWERS[element]).toHaveLength(3);

      return POWERS[element].flatMap((p) => [p.light.en, p.dark.en]);
    });

    expect(new Set(names).size).toBe(24);
  });

  it("has sixteen different ultimates, one for each light and dark element", () => {
    const names = ELEMENTS.flatMap((light) =>
      ELEMENTS.map((dark) => ULTIMATES[light][dark].name.en)
    );

    expect(new Set(names).size).toBe(16);
    expect(ULTIMATES.fire.earth.name.en).toBe("Meteor");
    expect(ULTIMATES.earth.fire.name.en).toBe("Volcano");
  });

  it("gives every role three skills", () => {
    for (const role of ROLES) {
      expect(ROLE_INFO[role].skills).toHaveLength(3);
    }
  });

  it("seats one Court member for each of the six elements, light and dark included", () => {
    expect(COURT.map((member) => member.wields).toSorted()).toEqual(
      [...ELEMENTS, ...AFFINITIES].toSorted()
    );
  });

  it("names an element as its affinity bends it, in each language", () => {
    expect(bentElement("fire", "dark", "en")).toBe("Dark fire");
    expect(bentElement("water", "light", "fr")).toBe("Eau de lumière");
    expect(bentElement("fire", "dark", "fr")).toBe("Feu d’ombre");
  });
});
