import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { omit } from "lodash";
import { AuthService } from "../services/auth-service";

export class AuthController {
  constructor(private authService: AuthService) {}
  async login(c: Context) {
    const body = await c.req.json();
    const result = await this.authService.login(body);
    setCookie(c, "jwt", result.data?.token!, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return c.json({ ...result, data: omit(result.data, ["token"]) });
  }
}
