import { testProperty, testRentData, testSellData } from "@/test/testData";
import { describe, it, expect } from "vitest";
import { filterDataByTypeAndSearch, getPropertyData } from "./helper";

describe("getPropertyData", () => {
  it("returns the property with the matching id", () => {
    const properties = [testProperty];

    const result = getPropertyData(1, properties);

    expect(result).toEqual(testProperty);
  });

  it("returns undefined if no property with the matching id is found", () => {
    const properties = [testProperty];

    const result = getPropertyData(2, properties);

    expect(result).toBeUndefined();
  });
});

describe("filterDataByTypeAndSearch", () => {
  it("filters data by type and search query", () => {
    const data = [testSellData, testRentData];

    const result = filterDataByTypeAndSearch(data, "Apartment", "Alaska");

    expect(result).toEqual([testRentData]);
  });

  it("returns all data if filterByType is empty", () => {
    const data = [testSellData, testRentData];

    const result = filterDataByTypeAndSearch(data, "", "");

    expect(result).toEqual(data);
  });

  it("returns an empty array if no data matches the filter", () => {
    const data = [testSellData, testRentData];

    const result = filterDataByTypeAndSearch(data, "rent", "test");

    expect(result).toEqual([]);
  });
});
