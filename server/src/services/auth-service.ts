import { sign } from "hono/jwt";
import { EXPIRATION_TIME } from "../../constants";
import { AuthRepository } from "../repositories/auth-repository";
import { RoleRepository } from "../repositories/role-repository";
import { LoginRequest, LoginResponse } from "./dtos/login-dto";

export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private roleRepository: RoleRepository
  ) {}

  async login(request: LoginRequest): Promise<LoginResponse> {
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
    const token = await sign(
      {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 10,
      },
      process.env.AUTH_SECRET!
    );

    return new LoginResponse(true, {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      avatar_url: user.avatar_url,
      expires_in: EXPIRATION_TIME,
      token,
      role: await this.roleRepository.getRoleNameById(user.role_id),
    });
  }
}
