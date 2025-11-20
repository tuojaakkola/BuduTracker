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
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// GET categories by type (income/expense)
router.get('/:type', async (req: Request, res: Response) => {
  try {
    const type = req.params.type;
    
    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ error: 'Type must be "income" or "expense"' });
      return;
    }

    const categories = await prisma.category.findMany({
      where: { type },
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

// CREATE new category
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type || !color || !icon) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (type !== 'income' && type !== 'expense') {
      res.status(400).json({ error: 'Type must be "income" or "expense"' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        type,
        color,
        icon,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating category' });
  }
});

// UPDATE category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, color, icon } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Missing ID' });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(icon && { icon }),
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error updating category' });
  }
});

// DELETE category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'Missing ID' });
      return;
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Check if category has any transactions
    const expenseCount = await prisma.expense.count({
      where: { categoryId: parseInt(id) },
    });
    
    const incomeCount = await prisma.income.count({
      where: { categoryId: parseInt(id) },
    });

    if (expenseCount > 0 || incomeCount > 0) {
      res.status(400).json({ 
        error: 'Cannot delete category with existing transactions',
        transactionCount: expenseCount + incomeCount 
      });
      return;
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
});

export default router;
