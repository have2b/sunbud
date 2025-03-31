import { Context } from "hono";
import { AuthService } from "../services/auth-service";

export class AuthController {
  constructor(private authService: AuthService) {}
  async login(c: Context) {
    const body = await c.req.json();
    const token = await this.authService.login(body);
    return c.json({ token });
  }
}
