import { sql } from "bun";
import { IRoleRepository } from "../interfaces/role-interface";

export class RoleRepository implements IRoleRepository {
  async getRoleNameById(roleId: number): Promise<string> {
    const roleName = await sql`
        SELECT name FROM roles WHERE id = ${roleId}
      `;
    return roleName[0].name;
  }
}
