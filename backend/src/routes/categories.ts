import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// GET all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Virhe kategorioiden haussa' });
  }
});

// GET categories by type (income/expense)
router.get('/:type', async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ error: 'Tyyppi täytyy olla "income" tai "expense"' });
      return;
    }

    const categories = await prisma.category.findMany({
      where: { type },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Virhe kategorioiden haussa' });
  }
});

export default router;
