import { sign } from "hono/jwt";
import { AuthRepository } from "../repositories/auth-repository";
import { LoginDto } from "./dtos/login-dto";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async login(request: LoginDto): Promise<string> {
    const user = await this.authRepository.findByEmailOrUsername(
      request.emailOrUsername
    );

    if (
      !user ||
      !(await Bun.password.verify(
        request.password,
        user.password_hash,
        "argon2id"
      ))
    ) {
      throw new Error("Invalid credentials");
    }
    return await sign(
      {
        id: user.id,
        role: user.role_id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
      },
      process.env.AUTH_SECRET!
    );
  }
}
