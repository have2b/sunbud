import { sql } from "bun";
import { User } from "../entities/user";
import { IAuthRepository } from "../interfaces/auth-interface";

export class AuthRepository implements IAuthRepository {
  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const user = await sql`
      SELECT * FROM users WHERE email = ${emailOrUsername} OR username = ${emailOrUsername}
    `;
    return user[0] || null;
  }
}
