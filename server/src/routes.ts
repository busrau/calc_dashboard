import { Router } from "express";
import * as calc from "./calculator.js";
import {
  parseBinaryOperands,
  parsePercentageOperands,
  parseUnaryOperand,
} from "./validation.js";

function result(value: number) {
  return { result: value };
}

export function createRouter(): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  router.post("/v1/add", (req, res, next) => {
    try {
      const { a, b } = parseBinaryOperands(req.body);
      res.json(result(calc.add(a, b)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/subtract", (req, res, next) => {
    try {
      const { a, b } = parseBinaryOperands(req.body);
      res.json(result(calc.subtract(a, b)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/multiply", (req, res, next) => {
    try {
      const { a, b } = parseBinaryOperands(req.body);
      res.json(result(calc.multiply(a, b)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/divide", (req, res, next) => {
    try {
      const { a, b } = parseBinaryOperands(req.body);
      res.json(result(calc.divide(a, b)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/power", (req, res, next) => {
    try {
      const { a, b } = parseBinaryOperands(req.body);
      res.json(result(calc.power(a, b)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/sqrt", (req, res, next) => {
    try {
      const { a } = parseUnaryOperand(req.body);
      res.json(result(calc.sqrt(a)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/v1/percentage", (req, res, next) => {
    try {
      const { value, percent } = parsePercentageOperands(req.body);
      res.json(result(calc.percentage(value, percent)));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
