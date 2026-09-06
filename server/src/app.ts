import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRouter } from "./routes.js";
import { ValidationError } from "./validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "16kb" }));
  app.use(createRouter());

  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/v1") || req.path === "/health") {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, "index.html"), (error) => {
      if (error) {
        next();
      }
    });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ValidationError) {
      res.status(error.status).json({ error: error.message });
      return;
    }

    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
