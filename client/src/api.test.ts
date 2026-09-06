import { describe, expect, it } from "vitest";
import { appendDigit, formatDisplay, parseOperand } from "./api";

describe("display helpers", () => {
  it("formats empty input as zero", () => {
    expect(formatDisplay("")).toBe("0");
  });

  it("replaces the display when waiting for a new operand", () => {
    expect(appendDigit("12", "3", true)).toBe("3");
    expect(appendDigit("12", ".", true)).toBe("0.");
  });

  it("prevents a second decimal point", () => {
    expect(appendDigit("1.2", ".", false)).toBe("1.2");
  });

  it("replaces a leading zero", () => {
    expect(appendDigit("0", "7", false)).toBe("7");
  });

  it("parses a finite operand", () => {
    expect(parseOperand("12.5")).toBe(12.5);
  });

  it("rejects invalid operands", () => {
    expect(() => parseOperand(".")).toThrow("valid number");
  });
});
