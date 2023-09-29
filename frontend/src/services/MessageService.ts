import axios from 'axios';
import { VITE_APP_BACKEND_URL } from '../config';
import { DataOrError, createErrorObject } from '../utils/error';
import { getLocalStorage } from '../utils/storage';
import { Message } from '../interfaces/message';

export class MessageService {
  private http;

  constructor() {
    this.http = axios.create({
      baseURL: VITE_APP_BACKEND_URL,
      headers: { Authorization: `Bearer ${getLocalStorage('token')}` },
    });
    this.http.interceptors.request.use((req) => {
      req.url = req.url?.replace(/\/$/, '');
      return req;
    });
  }

  public async getMessages(
    userId: string,
    page: number
  ): DataOrError<{ total: number; messages: Message[] }> {
    try {
      const result = await this.http.get(`messages/${userId}/?page=${page}`);
      return { data: result.data };
    } catch (error) {
      return createErrorObject(error);
    }
  }

  public async getResponseFromPrompt(
    userId: string,
    prompt: string
  ): DataOrError<{ response: string }> {
    try {
      const result = await this.http.post(`prompt/${userId}/`, { prompt });
      return { data: result.data };
    } catch (error) {
      console.log(error);
      return createErrorObject(error);
    }
  }
}
