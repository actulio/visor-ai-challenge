import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { IAuthService } from '../interfaces/IAuthService';

const SALT_ROUNDS = 10;

class AuthService implements IAuthService {
  public async register(email: string, name: string, password: string) {
    const userExists = await UserModel.findOne({ email });
    if (userExists) throw new Error('Email already in use');

    const hashedPassword = await this.hashPassword(password);
    const user = await UserModel.create({ email, name, password: hashedPassword });
    return { id: user.id, email, name };
  }

  public async login(email: string, password: string) {
    const user = await this.verifyUser(email, password);
    if (!user) throw new Error('Incorrect email or password');
    const token = jwt.sign(
      { user_id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '24h',
      }
    );
    return { id: user.id, name: user.name, email: user.email, token };
  }

  public verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  private async verifyUser(email: string, password: string) {
    const user = await UserModel.findOne({ email: email });
    if (!user) throw new Error('Email not found');

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
}

export default AuthService;
