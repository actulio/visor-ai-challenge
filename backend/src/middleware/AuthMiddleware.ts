import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

const authService = new AuthService();

const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: 'No token provided' });

  const [, token] = authHeader.split(' ');

  try {
    authService.verifyToken(token);
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).send('Invalid token');
  }
};

export default AuthMiddleware;
