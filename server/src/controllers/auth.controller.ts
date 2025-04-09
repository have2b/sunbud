import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { omit } from "lodash";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}
  async login(c: Context) {
    const body = await c.req.json();
    const result = await this.authService.login(body);

    const isProduction = process.env.NODE_ENV === "production";

    setCookie(c, "jwt", result.data?.token!, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return c.json({ ...result, data: omit(result.data, ["token"]) });
  }

  async register(c: Context) {
    const body = await c.req.json();
    const result = await this.authService.register(body);

    return c.json(result);
  }
}
