import { User } from "../db/schema";
import { RegisterParams } from "../types/auth.dto";

export interface IAuthRepository {
  findByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
  register(params: RegisterParams): Promise<User | null>;
}
