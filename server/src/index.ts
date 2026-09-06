import { createApp } from "./app.js";

const port = Number.parseInt(
  process.env.PORT ?? (process.env.NODE_ENV === "production" ? "8080" : "3001"),
  10,
);
const app = createApp();

app.listen(port, () => {
  console.log(`Calculator API listening on http://localhost:${port}`);
});
