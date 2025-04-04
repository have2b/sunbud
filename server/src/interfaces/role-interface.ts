export interface IRoleRepository {
  getRoleNameById(roleId: number): Promise<string>;
}
