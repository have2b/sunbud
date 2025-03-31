import { Hono } from "hono";
import { AuthController } from "../controllers/auth-controller";

export class AuthRoutes {
  constructor(private authController: AuthController) {}

  getRouter() {
    const router = new Hono();
    router.post("/login", (c) => this.authController.login(c));
    return router;
  }
}
