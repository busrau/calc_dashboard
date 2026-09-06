export type BinaryOperation = "add" | "subtract" | "multiply" | "divide" | "power";
export type Operation = BinaryOperation | "percentage";

export type CalculateRequest =
  | { operation: BinaryOperation; a: number; b: number }
  | { operation: "sqrt"; a: number }
  | { operation: "percentage"; value: number; percent: number };

export type CalculateResponse = { result: number };

const PATHS: Record<CalculateRequest["operation"], string> = {
  add: "/v1/add",
  subtract: "/v1/subtract",
  multiply: "/v1/multiply",
  divide: "/v1/divide",
  power: "/v1/power",
  sqrt: "/v1/sqrt",
  percentage: "/v1/percentage",
};

function bodyFor(request: CalculateRequest): Record<string, number> {
  if (request.operation === "percentage") {
    return { value: request.value, percent: request.percent };
  }
  if (request.operation === "sqrt") {
    return { a: request.a };
  }
  return { a: request.a, b: request.b };
}

export async function calculate(request: CalculateRequest): Promise<number> {
  const response = await fetch(PATHS[request.operation], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyFor(request)),
  });

  const payload = (await response.json()) as CalculateResponse & { error?: string };

  if (!response.ok) {
    throw new Error(payload.error ?? "Calculation failed");
  }

  if (typeof payload.result !== "number" || !Number.isFinite(payload.result)) {
    throw new Error("The server returned an invalid result");
  }

  return payload.result;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch("/health");
    const payload = (await response.json()) as { status?: string };
    return response.ok && payload.status === "ok";
  } catch {
    return false;
  }
}

export function formatDisplay(value: string): string {
  if (value === "" || value === "-") {
    return "0";
  }
  return value;
}

export function appendDigit(current: string, digit: string, waitingForNew: boolean): string {
  if (waitingForNew) {
    return digit === "." ? "0." : digit;
  }

  if (digit === ".") {
    return current.includes(".") ? current : `${current || "0"}.`;
  }

  if (current === "0" || current === "") {
    return digit;
  }

  if (current === "-0") {
    return `-${digit}`;
  }

  return `${current}${digit}`;
}

export function parseOperand(display: string): number {
  const value = Number(display);
  if (!Number.isFinite(value)) {
    throw new Error("Enter a valid number");
  }
  return value;
}

export const OPERATION_HINT: Record<Operation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
  power: "^",
  percentage: "% of",
};
