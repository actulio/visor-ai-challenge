import { User } from '../../interfaces/IAuthService';

export class UserBuilder {
  private user: User = {
    email: '',
    name: '',
    password: '',
  };

  static New(): UserBuilder {
    return new UserBuilder();
  }

  public build(): User {
    return this.user;
  }

  public withPassword() {
    this.user.password = 'password';
    return this;
  }

  public withName() {
    this.user.name = 'name';
    return this;
  }

  public withEmail() {
    this.user.email = 'email@email.com';
    return this;
  }

  public withRandomEmail() {
    const randomHandle = (Math.random() + 1).toString(36).substring(7);
    this.user.email = `${randomHandle}@email.com`;
    return this;
  }
}
