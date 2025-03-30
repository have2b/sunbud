import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default {
  port: 5000,
  fetch: app.fetch,
};
