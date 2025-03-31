export class User {
  constructor(
    public id: number,
    public role_id: number,
    public username: string,
    public email: string,
    public password_hash: string,
    public first_name: string,
    public last_name: string,
    public created_at: Date,
    public updated_at: Date,
    public avatar_url: string
  ) {}
}
