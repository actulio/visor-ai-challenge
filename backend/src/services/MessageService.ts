import OpenAI from 'openai';
import { MessageModel } from '../models/message';
import { IMessageService } from '../interfaces/IMessageService';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class MessageService implements IMessageService {
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

  public async getMessages(userId: string, pageNumber: number, limit: number) {
    const total = await MessageModel.countDocuments({ userId });
    const messages = await MessageModel.find({ userId })
      .sort({ date: -1 })
      .skip(pageNumber * limit)
      .limit(limit)
      .exec();
    return { total, messages };
  }
}

export default MessageService;
