import { Request, Response } from 'express';
import MessageService from '../services/MessageService';
import { MessageModel } from '../models/message';

const messageService = new MessageService();

export async function getMessages(req: Request, res: Response) {
  try {
    const userId = req.params.user_id;
    const query = req.query as { page: string; limit: string };
    const pageNumber = parseInt(query.page) || 0;
    const limit = parseInt(query.limit) || 3;
    const total = await MessageModel.countDocuments();
    const messages = await MessageModel.find({ userId })
      .sort({ date: -1 })
      .skip(pageNumber * limit)
      .limit(limit)
      .exec();

    res.status(200).json({ total, messages });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error?.message || error });
  }
}

export async function requestResponse(req: Request, res: Response) {
  try {
    const { prompt } = req.body;
    const { user_id } = req.params;
    await messageService.saveMessage(prompt, user_id, false);
    const response = await messageService.requestResponseFromPrompt(prompt);
    if (!response) {
      return res.status(400).json({ error: 'Could not get response from message server' });
    }
    await messageService.saveMessage(response, user_id, true);
    res.status(200).json({ response });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error?.message || error });
  }
}
