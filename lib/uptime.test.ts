/**
 * lib/uptime.test.ts — tests for the winfetch "Uptime" date math,
 * including month-end and leap-year edge cases.
 */
import { describe, expect, it } from "vitest";
import { formatUptime, uptimeBetween } from "./uptime";

/** Shorthand: a UTC date at noon (noon keeps any local-time display honest). */
const on = (iso: string) => new Date(`${iso}T12:00:00Z`);

describe("uptimeBetween", () => {
  it("matches the design mockup for the real start date", () => {
    expect(uptimeBetween("2023-10-01", on("2026-10-29"))).toEqual({ years: 3, months: 0, days: 28 });
  });

  it("is all zeros on the start date and before it", () => {
    expect(uptimeBetween("2023-10-01", on("2023-10-01"))).toEqual({ years: 0, months: 0, days: 0 });
    expect(uptimeBetween("2023-10-01", on("2023-09-15"))).toEqual({ years: 0, months: 0, days: 0 });
  });

  it("rolls days into months and months into years", () => {
    expect(uptimeBetween("2023-10-01", on("2024-09-30"))).toEqual({ years: 0, months: 11, days: 29 });
    expect(uptimeBetween("2023-10-01", on("2024-10-01"))).toEqual({ years: 1, months: 0, days: 0 });
  });

  describe("month ends", () => {
    it("counts Jan 31 → Feb 28 as one month (Feb has no 31st)", () => {
      expect(uptimeBetween("2023-01-31", on("2023-02-28"))).toEqual({ years: 0, months: 1, days: 0 });
    });

    it("never produces negative days when the start day is missing from a month", () => {
      // Naive field subtraction gives "1 month, -2 days" here.
      expect(uptimeBetween("2023-01-31", on("2023-03-01"))).toEqual({ years: 0, months: 1, days: 1 });
    });

    it("counts Jan 31 → Mar 31 as exactly two months", () => {
      expect(uptimeBetween("2023-01-31", on("2023-03-31"))).toEqual({ years: 0, months: 2, days: 0 });
    });

    it("handles a 30-day month after a 31st", () => {
      expect(uptimeBetween("2023-03-31", on("2023-04-30"))).toEqual({ years: 0, months: 1, days: 0 });
      expect(uptimeBetween("2023-03-31", on("2023-05-01"))).toEqual({ years: 0, months: 1, days: 1 });
    });
  });

  describe("leap years", () => {
    it("counts Feb 29 days in a leap year", () => {
      expect(uptimeBetween("2024-02-01", on("2024-02-29"))).toEqual({ years: 0, months: 0, days: 28 });
      expect(uptimeBetween("2024-02-28", on("2024-03-01"))).toEqual({ years: 0, months: 0, days: 2 });
    });

    it("treats Feb 29 → Feb 28 next year as a full year", () => {
      expect(uptimeBetween("2024-02-29", on("2025-02-28"))).toEqual({ years: 1, months: 0, days: 0 });
    });

    it("counts Feb 28 → Feb 29 across a leap year as a year and a day", () => {
      expect(uptimeBetween("2023-02-28", on("2024-02-29"))).toEqual({ years: 1, months: 0, days: 1 });
    });

    it("lands back on Feb 29 four years later", () => {
      expect(uptimeBetween("2024-02-29", on("2028-02-29"))).toEqual({ years: 4, months: 0, days: 0 });
    });
  });

  it("ignores the time of day", () => {
    expect(uptimeBetween("2023-10-01", new Date("2026-10-29T00:00:00Z"))).toEqual(
      uptimeBetween("2023-10-01", new Date("2026-10-29T23:59:59Z")),
    );
  });
});

describe("formatUptime", () => {
  it("writes the mockup's format", () => {
    expect(formatUptime({ years: 3, months: 0, days: 28 })).toBe("3 years, 0 months, 28 days");
  });

  it("uses singular words for exactly one", () => {
    expect(formatUptime({ years: 1, months: 1, days: 1 })).toBe("1 year, 1 month, 1 day");
  });
});
