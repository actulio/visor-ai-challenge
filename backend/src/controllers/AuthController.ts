import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

const authService = new AuthService();

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const user = await authService.register(email, name, password);
    res.status(201).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ error: error?.message || error });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const loggedData = await authService.login(email, password);
    res.status(200).json(loggedData);
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ error: error?.message || error });
  }
}
