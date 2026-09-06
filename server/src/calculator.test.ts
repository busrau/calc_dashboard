import { describe, expect, it } from "vitest";
import {
  add,
  divide,
  multiply,
  percentage,
  power,
  sqrt,
  subtract,
} from "./calculator.js";
import { ValidationError } from "./validation.js";

describe("calculator", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("subtracts two numbers", () => {
    expect(subtract(10, 4)).toBe(6);
  });

  it("multiplies two numbers", () => {
    expect(multiply(3, 7)).toBe(21);
  });

  it("divides two numbers", () => {
    expect(divide(9, 3)).toBe(3);
  });

  it("rejects division by zero", () => {
    expect(() => divide(9, 0)).toThrow(ValidationError);
    expect(() => divide(9, 0)).toThrow("Division by zero");
  });

  it("raises a number to a power", () => {
    expect(power(2, 10)).toBe(1024);
  });

  it("rejects non-finite exponentiation", () => {
    expect(() => power(10, 1000)).toThrow("non-finite");
  });

  it("takes a square root", () => {
    expect(sqrt(81)).toBe(9);
  });

  it("rejects square root of a negative number", () => {
    expect(() => sqrt(-1)).toThrow("negative");
  });

  it("computes a percentage of a value", () => {
    expect(percentage(80, 25)).toBe(20);
  });
});
