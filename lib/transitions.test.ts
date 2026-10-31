/**
 * lib/transitions.test.ts — tests for picking the page-change direction.
 */
import { describe, expect, it } from "vitest";
import { NAV_BACK, NAV_FORWARD, directionFor } from "./transitions";

describe("directionFor", () => {
  it("goes forward from the home page into a case study", () => {
    expect(directionFor("/", "/work/trellis")).toEqual([NAV_FORWARD]);
  });

  it("goes back from a case study to a home-page section", () => {
    expect(directionFor("/work/trellis", "/#work")).toEqual([NAV_BACK]);
    expect(directionFor("/work/trellis", "/")).toEqual([NAV_BACK]);
  });

  it("does not animate links to a section on the same page", () => {
    expect(directionFor("/", "/#experience")).toBeUndefined();
    expect(directionFor("/work/trellis", "/work/trellis#results")).toBeUndefined();
  });
});
