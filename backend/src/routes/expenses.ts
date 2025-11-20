import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// CREATE 
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, amount, categoryId, date } = req.body;

    if (!name || !amount || !categoryId || !date) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const parsedAmount = parseFloat(amount.toString().replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({ error: 'Invalid amount - must be a positive number' });
      return;
    }

    const expense = await prisma.expense.create({
      data: {
        name,
        amount: parsedAmount,
        categoryId: parseInt(categoryId),
        date: new Date(date),
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Error creating expense' });
  }
});

// GET 
router.get('/', async (req: Request, res: Response) => {
  try {
    const { month } = req.query;
    
    // Build WHERE clause dynamically
    let whereClause: any = {};
    
    if (month && typeof month === 'string') {
      const parts = month.split('-');
      const year = parts[0] as string;
      const monthNum = parts[1] as string;
      
      // First day of the month at 00:00:00
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      
      // Last day of the month at 23:59:59
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);
      
      whereClause = {
        date: {
          gte: startDate, // Greater Than or Equal (>=)
          lte: endDate,   // Less Than or Equal (<=)
        },
      };
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });
    
    // Format amounts to always have 2 decimals
    const formattedExpenses = expenses.map(expense => ({
      ...expense,
      amount: Number(expense.amount.toFixed(2))
    }));
    
    res.json(formattedExpenses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching expenses' });
  }
});

// UPDATE
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'Missing ID' });
      return;
    }
    
    const { name, amount, categoryId, date } = req.body;

    const existingExpense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingExpense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    // Validate amount if provided
    let parsedAmount: number | undefined;
    if (amount !== undefined) {
      parsedAmount = parseFloat(amount.toString().replace(',', '.'));
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({ error: 'Invalid amount - must be a positive number' });
        return;
      }
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(parsedAmount && { amount: parsedAmount }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(date && { date: new Date(date) }),
      },
      include: {
        category: true,
      },
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Error updating expense' });
  }
});

// DELETE
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'Missing ID' });
      return;
    }

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting expense' });
  }
});

export default router;
