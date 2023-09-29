export type User = {
  name: string;
  email: string;
  password: string;
};

export interface IAuthService {
  register(
    email: string,
    name: string,
    password: string
  ): Promise<Omit<User, 'password'> & { id: string }>;
  login(
    email: string,
    password: string
  ): Promise<Omit<User, 'password'> & { id: string; token: string }>;
}
