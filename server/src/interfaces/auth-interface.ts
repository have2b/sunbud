import { User } from "../entities/user";

export interface IAuthRepository {
  findByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
}
