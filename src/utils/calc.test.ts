import { normalizeValue, denormalizeValue, findPercentage } from "./calc";

test("normalizes the given number between a max and min limit", () => {
  expect(normalizeValue(15, 4, 50)).toBe(23.91304347826087);
});

test("denormalizes the given number between a max and min limit", () => {
  expect(denormalizeValue(15, 0, 1)).toBe(0.15);
});

test("find percentage of a given number", () => {
  expect(findPercentage(50, 80)).toBe(62.5);
});
