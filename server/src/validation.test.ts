import {
  parseBinaryOperands,
  parsePercentageOperands,
  parseUnaryOperand,
  ValidationError,
} from "./validation.js";
import { describe, expect, it } from "vitest";

describe("validation", () => {
  it("parses binary operands", () => {
    expect(parseBinaryOperands({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it("rejects non-object bodies", () => {
    expect(() => parseBinaryOperands(null)).toThrow(ValidationError);
    expect(() => parseUnaryOperand("nope")).toThrow(ValidationError);
  });

  it("parses unary and percentage operands", () => {
    expect(parseUnaryOperand({ a: 9 })).toEqual({ a: 9 });
    expect(parsePercentageOperands({ value: 80, percent: 25 })).toEqual({
      value: 80,
      percent: 25,
    });
  });
});
