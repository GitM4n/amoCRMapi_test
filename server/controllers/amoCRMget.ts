import { Request, Response } from 'express';
import AmoCrmService from '../services/amoCRMservice';

export const getLeads = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const leads = await AmoCrmService.getLeads(query);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Не удалось получить сделки' });
  }
};
