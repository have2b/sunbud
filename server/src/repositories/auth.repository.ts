import { eq, or } from "drizzle-orm";
import { db } from "../db";
import { roleEnum, User, users } from "../db/schema";
import { IAuthRepository } from "../interfaces/auth.interface";
import { RegisterParams } from "../types/auth.dto";

export class AuthRepository implements IAuthRepository {
  async register(params: RegisterParams): Promise<User | null> {
    try {
      // Hash the password
      params.password = await Bun.password.hash(params.password);

      const [user] = await db
        .insert(users)
        .values({
          username: params.username,
          email: params.email,
          passwordHash: params.password,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone,
          role: roleEnum.enumValues[0],
        })
        .returning();

      return user;
    } catch (error) {
      console.error("Registration failed:", error);
      return null;
    }
  }
  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    try {
      const user = await db.query.users.findFirst({
        where: or(
          eq(users.email, emailOrUsername),
          eq(users.username, emailOrUsername)
        ),
      });
      return user || null;
    } catch (error) {
      console.error("Find user by email or username failed:", error);
      return null;
    }
  }
}
