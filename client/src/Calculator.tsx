import { useCallback, useEffect, useState } from "react";
import {
  appendDigit,
  calculate,
  checkHealth,
  formatDisplay,
  OPERATION_HINT,
  parseOperand,
  type Operation,
} from "./api";

type Health = "checking" | "ok" | "down";

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [pending, setPending] = useState<Operation | null>(null);
  const [waitingForNew, setWaitingForNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState<Health>("checking");

  useEffect(() => {
    let cancelled = false;
    checkHealth().then((ok) => {
      if (!cancelled) {
        setHealth(ok ? "ok" : "down");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const compute = useCallback(async (operation: Operation, a: number, b: number) => {
    return operation === "percentage"
      ? calculate({ operation: "percentage", value: a, percent: b })
      : calculate({ operation, a, b });
  }, []);

  const inputDigit = (digit: string) => {
    setError(null);
    setDisplay((current) => appendDigit(current, digit, waitingForNew));
    setWaitingForNew(false);
  };

  const clearAll = () => {
    setDisplay("0");
    setStored(null);
    setPending(null);
    setWaitingForNew(false);
    setError(null);
  };

  const backspace = () => {
    if (waitingForNew) {
      return;
    }
    setDisplay((current) => {
      const next = current.slice(0, -1);
      return next === "" || next === "-" ? "0" : next;
    });
  };

  const toggleSign = () => {
    setError(null);
    setDisplay((current) => {
      if (current === "0") {
        return current;
      }
      return current.startsWith("-") ? current.slice(1) : `-${current}`;
    });
  };

  const chooseOperation = async (operation: Operation) => {
    try {
      const current = parseOperand(display);

      if (pending !== null && stored !== null && !waitingForNew) {
        setBusy(true);
        try {
          const result = await compute(pending, stored, current);
          setDisplay(String(result));
          setStored(result);
          setPending(operation);
          setWaitingForNew(true);
          setError(null);
        } catch (computeError) {
          setError(computeError instanceof Error ? computeError.message : "Calculation failed");
        } finally {
          setBusy(false);
        }
        return;
      }

      setStored(current);
      setPending(operation);
      setWaitingForNew(true);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invalid input");
    }
  };

  const equals = async () => {
    if (pending === null || stored === null) {
      return;
    }
    try {
      const current = parseOperand(display);
      setBusy(true);
      try {
        const result = await compute(pending, stored, current);
        setDisplay(String(result));
        setStored(null);
        setPending(null);
        setWaitingForNew(true);
        setError(null);
      } catch (computeError) {
        setError(computeError instanceof Error ? computeError.message : "Calculation failed");
      } finally {
        setBusy(false);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invalid input");
    }
  };

  const squareRoot = async () => {
    try {
      const a = parseOperand(display);
      setBusy(true);
      setError(null);
      const result = await calculate({ operation: "sqrt", a });
      setDisplay(String(result));
      setStored(null);
      setPending(null);
      setWaitingForNew(true);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Calculation failed");
    } finally {
      setBusy(false);
    }
  };

  const hint =
    pending && stored !== null ? `${stored} ${OPERATION_HINT[pending]}` : "Ready";

  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">Calculator dashboard</p>
        <h1>Do the math, keep the context.</h1>
        <p className="lede">
          Arithmetic runs through a validated API so the UI stays a thin, honest
          client: enter numbers, pick an operation, read the result.
        </p>
        <p className={`health health-${health}`} role="status">
          API {health === "ok" ? "online" : health === "down" ? "unreachable" : "checking…"}
        </p>
      </header>

      <section className="panel" aria-label="Calculator">
        <div className="display" aria-live="polite">
          <span className="hint">{busy ? "Calculating…" : hint}</span>
          <span className="value" data-testid="display">
            {formatDisplay(display)}
          </span>
          {error ? (
            <span className="error" role="alert" data-testid="error">
              {error}
            </span>
          ) : (
            <span className="error placeholder">No errors</span>
          )}
        </div>

        <div className="keys" role="group" aria-label="Keypad">
          <button type="button" className="key util" onClick={clearAll}>
            C
          </button>
          <button type="button" className="key util" onClick={backspace} aria-label="Backspace">
            ⌫
          </button>
          <button type="button" className="key op" onClick={() => void chooseOperation("percentage")}>
            % of
          </button>
          <button type="button" className="key op" onClick={() => void chooseOperation("divide")}>
            ÷
          </button>

          <button type="button" className="key" onClick={() => inputDigit("7")}>
            7
          </button>
          <button type="button" className="key" onClick={() => inputDigit("8")}>
            8
          </button>
          <button type="button" className="key" onClick={() => inputDigit("9")}>
            9
          </button>
          <button type="button" className="key op" onClick={() => void chooseOperation("multiply")}>
            ×
          </button>

          <button type="button" className="key" onClick={() => inputDigit("4")}>
            4
          </button>
          <button type="button" className="key" onClick={() => inputDigit("5")}>
            5
          </button>
          <button type="button" className="key" onClick={() => inputDigit("6")}>
            6
          </button>
          <button type="button" className="key op" onClick={() => void chooseOperation("subtract")}>
            −
          </button>

          <button type="button" className="key" onClick={() => inputDigit("1")}>
            1
          </button>
          <button type="button" className="key" onClick={() => inputDigit("2")}>
            2
          </button>
          <button type="button" className="key" onClick={() => inputDigit("3")}>
            3
          </button>
          <button type="button" className="key op" onClick={() => void chooseOperation("add")}>
            +
          </button>

          <button type="button" className="key" onClick={toggleSign} aria-label="Toggle sign">
            ±
          </button>
          <button type="button" className="key" onClick={() => inputDigit("0")}>
            0
          </button>
          <button type="button" className="key" onClick={() => inputDigit(".")}>
            .
          </button>
          <button type="button" className="key op" onClick={() => void chooseOperation("power")}>
            xʸ
          </button>

          <button type="button" className="key op wide" onClick={() => void squareRoot()}>
            √
          </button>
          <button type="button" className="key equals wide" onClick={() => void equals()} disabled={busy}>
            =
          </button>
        </div>
      </section>
    </main>
  );
}
