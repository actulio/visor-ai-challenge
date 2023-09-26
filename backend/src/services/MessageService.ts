import OpenAI from 'openai';
import { MessageModel } from '../models/message';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

class MessageService {
  public async saveMessage(message: string, userId: string, isResponse: boolean) {
    await MessageModel.create({ body: message, userId, isResponse, date: new Date() });
  }

  public async requestResponseFromPrompt(prompt: string) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      max_tokens: 64,
    });
    console.log('Chat Usage: ', chatCompletion.usage);
    return chatCompletion.choices[0].message.content;
  }

  public async getMessages() {}
}

export default MessageService;
