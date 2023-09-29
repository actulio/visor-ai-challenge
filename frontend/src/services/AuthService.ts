import axios from 'axios';
import { VITE_APP_BACKEND_URL } from '../config';
import { DataOrError, createErrorObject } from '../utils/error';
import { User } from '../interfaces/user';

export class AuthService {
  private http;

  constructor() {
    this.http = axios.create({ baseURL: VITE_APP_BACKEND_URL });
    this.http.interceptors.request.use((req) => {
      req.url = req.url?.replace(/\/$/, '');
      return req;
    });
  }

  public async login(email: string, password: string): DataOrError<User & { token: string }> {
    try {
      const result = await this.http.post('login', { email, password });
      return { data: result.data };
    } catch (error) {
      return createErrorObject(error);
    }
  }
  public async register(name: string, email: string, password: string): DataOrError<User> {
    try {
      const result = await this.http.post('register', { name, email, password });
      return { data: result.data };
    } catch (error) {
      return createErrorObject(error);
    }
  }
}
