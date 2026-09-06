export class ValidationError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function parseFiniteNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ValidationError(`${field} must be a finite number`);
  }
  return value;
}

export function parseBinaryOperands(body: unknown): { a: number; b: number } {
  if (body === null || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object");
  }

  const { a, b } = body as Record<string, unknown>;
  return {
    a: parseFiniteNumber(a, "a"),
    b: parseFiniteNumber(b, "b"),
  };
}

export function parseUnaryOperand(body: unknown): { a: number } {
  if (body === null || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object");
  }

  const { a } = body as Record<string, unknown>;
  return { a: parseFiniteNumber(a, "a") };
}

export function parsePercentageOperands(body: unknown): {
  value: number;
  percent: number;
} {
  if (body === null || typeof body !== "object") {
    throw new ValidationError("Request body must be a JSON object");
  }

  const { value, percent } = body as Record<string, unknown>;
  return {
    value: parseFiniteNumber(value, "value"),
    percent: parseFiniteNumber(percent, "percent"),
  };
}
