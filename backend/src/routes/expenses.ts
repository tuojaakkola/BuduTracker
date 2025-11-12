import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// CREATE 
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, amount, categoryId, date } = req.body;

    if (!name || !amount || !categoryId || !date) {
      res.status(400).json({ error: 'Puuttuvia kenttiä' });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        name,
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        date: new Date(date),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Virhe menon luonnissa' });
  }
});

// GET 
router.get('/', async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Virhe menojen haussa' });
  }
});

// UPDATE
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'ID puuttuu' });
      return;
    }
    
    const { name, amount, categoryId, date } = req.body;

    const existingExpense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingExpense) {
      res.status(404).json({ error: 'Menoa ei löytynyt' });
      return;
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(date && { date: new Date(date) }),
      },
      include: {
        category: true,
      },
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Virhe menon päivityksessä' });
  }
});

// DELETE
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'ID puuttuu' });
      return;
    }

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      res.status(404).json({ error: 'Menoa ei löytynyt' });
      return;
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Meno poistettu onnistuneesti' });
  } catch (error) {
    res.status(500).json({ error: 'Virhe menon poistossa' });
  }
});

export default router;
