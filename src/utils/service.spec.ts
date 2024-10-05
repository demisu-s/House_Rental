import { describe, it, expect } from "vitest";
import { capitalizeFirstLetter } from "./service";

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a string", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });

  it("should return an empty string when input is null", () => {
    expect(capitalizeFirstLetter(null)).toBe("");
  });

  it("should return an empty string when input is an empty string", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("should return an empty string when input is a string with only whitespace", () => {
    expect(capitalizeFirstLetter("   ")).toBe("");
  });

  it("should handle uppercase letters correctly", () => {
    expect(capitalizeFirstLetter("HELLO")).toBe("HELLO");
  });
});
