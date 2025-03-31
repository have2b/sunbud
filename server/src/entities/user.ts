export class User {
  constructor(
    public id: string,
    public email: string,
    public password_hash: string,
    public username: string
  ) {}
}
