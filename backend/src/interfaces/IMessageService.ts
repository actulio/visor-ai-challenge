export type Message = {
  body: string;
  userId: string;
  date: Date;
  isResponse: boolean;
};

export interface IMessageService {
  saveMessage(message: string, userId: string, isResponse: boolean): Promise<void>;
  requestResponseFromPrompt(prompt: string): Promise<string | null>;
  getMessages(
    userId: string,
    pageNumber: number,
    limit: number
  ): Promise<{ total: number; messages: Message[] }>;
}
