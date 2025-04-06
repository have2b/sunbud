import { Hono } from "hono";
import { AuthController } from "./controllers/auth-controller";
import { AuthRepository } from "./repositories/auth-repository";
import { AuthRoutes } from "./routes/auth-routes";
import { AuthService } from "./services/auth-service";

import { sql } from "bun";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { logger } from "hono/logger";
import { RoleRepository } from "./repositories/role-repository";

const app = new Hono().basePath("/api");
app.use(logger());

app.use("*", async (c, next) => {
  console.log("Origin Header:", c.req.header("origin"));
  await next();
});

app.use(
  "*",
  cors({
    origin: [`${process.env.CLIENT_URL}`],
    credentials: true,
  })
);

const authRepository = new AuthRepository();
const roleRepository = new RoleRepository();
const authService = new AuthService(authRepository, roleRepository);
const authController = new AuthController(authService);
const authRoutes = new AuthRoutes(authController);

app.route("/auth", authRoutes.getRouter());

app.use("/*", jwt({ secret: process.env.AUTH_SECRET!, cookie: "jwt" }));

app.get("/db-name", async (c) => {
  const db = await sql`SELECT CURRENT_CATALOG;`;
  return c.json(db);
});

export default {
  port: 5000,
  fetch: app.fetch,
};
