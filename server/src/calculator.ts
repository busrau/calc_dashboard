import { ValidationError } from "./validation.js";

function ensureFinite(result: number, operation: string): number {
  if (!Number.isFinite(result)) {
    throw new ValidationError(`${operation} produced a non-finite result`);
  }
  return result;
}

export function add(a: number, b: number): number {
  return ensureFinite(a + b, "Addition");
}

export function subtract(a: number, b: number): number {
  return ensureFinite(a - b, "Subtraction");
}

export function multiply(a: number, b: number): number {
  return ensureFinite(a * b, "Multiplication");
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new ValidationError("Division by zero");
  }
  return ensureFinite(a / b, "Division");
}

export function power(a: number, b: number): number {
  return ensureFinite(a ** b, "Exponentiation");
}

export function sqrt(a: number): number {
  if (a < 0) {
    throw new ValidationError("Cannot take square root of a negative number");
  }
  return ensureFinite(Math.sqrt(a), "Square root");
}

export function percentage(value: number, percent: number): number {
  return ensureFinite((value * percent) / 100, "Percentage");
}
