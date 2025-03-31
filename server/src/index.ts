import { Hono } from "hono";
import { AuthController } from "./controllers/auth-controller";
import { AuthRepository } from "./repositories/auth-repository";
import { AuthRoutes } from "./routes/auth-routes";
import { AuthService } from "./services/auth-service";

import { sql } from "bun";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");
app.use(logger());

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authRoutes = new AuthRoutes(authController);

app.route("/auth", authRoutes.getRouter());

app.get("/db-name", async (c) => {
  const db = await sql`SELECT CURRENT_CATALOG;`;
  return c.json(db);
});

export default {
  port: 5000,
  fetch: app.fetch,
};
