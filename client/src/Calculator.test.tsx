import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Calculator } from "./Calculator";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetch(handler: (url: string, init?: RequestInit) => unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const body = handler(url, init);
      return {
        ok: true,
        json: async () => body,
      };
    }),
  );
}

describe("Calculator", () => {
  it("adds two numbers through the API", async () => {
    const user = userEvent.setup();
    mockFetch((url) => {
      if (url.endsWith("/health")) {
        return { status: "ok" };
      }
      return { result: 5 };
    });

    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(await screen.findByTestId("display")).toHaveTextContent("5");
    expect(fetch).toHaveBeenCalledWith(
      "/v1/add",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ a: 2, b: 3 }),
      }),
    );
  });

  it("shows API validation errors", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/health")) {
          return { ok: true, json: async () => ({ status: "ok" }) };
        }
        return {
          ok: false,
          json: async () => ({ error: "Division by zero" }),
        };
      }),
    );

    render(<Calculator />);

    await user.click(screen.getByRole("button", { name: "9" }));
    await user.click(screen.getByRole("button", { name: "÷" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(await screen.findByTestId("error")).toHaveTextContent("Division by zero");
  });

  it("requests a square root for the current value", async () => {
    const user = userEvent.setup();
    mockFetch((url) => {
      if (url.endsWith("/health")) {
        return { status: "ok" };
      }
      return { result: 9 };
    });

    render(<Calculator />);
    await user.click(screen.getByRole("button", { name: "8" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "√" }));

    expect(await screen.findByTestId("display")).toHaveTextContent("9");
    expect(fetch).toHaveBeenCalledWith(
      "/v1/sqrt",
      expect.objectContaining({
        body: JSON.stringify({ a: 81 }),
      }),
    );
  });
});
