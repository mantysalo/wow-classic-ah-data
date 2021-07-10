import { calculateMarketValue } from "./calculateMarketValue";

describe("calculateMarketValue", () => {
  it("should return 14.5", () => {
    const testData = [5, 13, 13, 15, 15, 15, 16, 17, 17, 19, 20, 20, 20, 20, 20, 20, 21, 21, 29, 45, 45, 46, 47, 100];
    expect(calculateMarketValue(testData)).toBe(14.5);
  });
});
