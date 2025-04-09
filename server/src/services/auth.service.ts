import { sign } from "hono/jwt";
import { omit } from "lodash";
import { EXPIRATION_TIME } from "../../constants";
import { AuthRepository } from "../repositories/auth.repository";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.dto";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.authRepository.findByEmailOrUsername(
      request.emailOrUsername
    );

    if (
      !user ||
      !(await Bun.password.verify(
        request.password,
        user.passwordHash,
        "argon2id"
      ))
    ) {
      return new LoginResponse(false, undefined, "Invalid credentials");
    }
    const token = await sign(
      {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 10,
      },
      process.env.AUTH_SECRET!
    );

    return new LoginResponse(true, {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      username: user.username,
      avatarUrl: user.avatarUrl ?? "",
      expiresIn: EXPIRATION_TIME,
      token,
      role: user.role,
    });
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.authRepository.findByEmailOrUsername(
      request.username
    );

    if (user) {
      return new RegisterResponse(false, {}, "User already exists");
    }

    const res = await this.authRepository.register(request);
    if (res === null) {
      return new RegisterResponse(false, {}, "Failed to register user");
    }

    return new RegisterResponse(true, omit(res, ["passwordHash"]));
  }
}
