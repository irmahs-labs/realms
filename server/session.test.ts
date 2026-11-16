import { describe, expect, it } from "vitest";

import { shortName } from "./session";

describe("shortName", () => {
  it("keeps the first name and the initial of every name after it", () => {
    expect(shortName("Irma Houversing")).toBe("Irma H.");
    expect(shortName("Irma Houversing Sor")).toBe("Irma HS.");
    expect(shortName("  ben   carter ")).toBe("ben C.");
    expect(shortName("Cher")).toBe("Cher");
    expect(shortName("   ")).toBe("Player");
  });
});
