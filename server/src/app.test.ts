import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";

const app = createApp();

describe("calculator API", () => {
  it("reports health", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("adds", async () => {
    const response = await request(app).post("/v1/add").send({ a: 2, b: 3 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 5 });
  });

  it("subtracts", async () => {
    const response = await request(app).post("/v1/subtract").send({ a: 10, b: 4 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 6 });
  });

  it("multiplies", async () => {
    const response = await request(app).post("/v1/multiply").send({ a: 3, b: 7 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 21 });
  });

  it("divides", async () => {
    const response = await request(app).post("/v1/divide").send({ a: 9, b: 3 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 3 });
  });

  it("returns 400 for division by zero", async () => {
    const response = await request(app).post("/v1/divide").send({ a: 9, b: 0 });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/zero/i);
  });

  it("computes power", async () => {
    const response = await request(app).post("/v1/power").send({ a: 2, b: 10 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 1024 });
  });

  it("computes square root", async () => {
    const response = await request(app).post("/v1/sqrt").send({ a: 81 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 9 });
  });

  it("computes percentage", async () => {
    const response = await request(app)
      .post("/v1/percentage")
      .send({ value: 80, percent: 25 });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ result: 20 });
  });

  it("rejects missing operands", async () => {
    const response = await request(app).post("/v1/add").send({ a: 1 });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/b must be a finite number/);
  });

  it("rejects non-numeric operands", async () => {
    const response = await request(app).post("/v1/add").send({ a: "2", b: 3 });
    expect(response.status).toBe(400);
  });
});
