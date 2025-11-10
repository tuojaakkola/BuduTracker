import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// CREATE - Luo uusi tulo
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, amount, category, date } = req.body;

    if (!name || !amount || !category || !date) {
      res.status(400).json({ error: 'Puuttuvia kenttiä' });
      return;
    }

    const income = await prisma.income.create({
      data: {
        name,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
      },
    });

    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ error: 'Virhe tulon luonnissa' });
  }
});

// GET - Hae kaikki tulot
router.get('/', async (req: Request, res: Response) => {
  try {
    const incomes = await prisma.income.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ error: 'Virhe tulojen haussa' });
  }
});

// UPDATE - Päivitä tulo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'ID puuttuu' });
      return;
    }
    
    const { name, amount, category, date } = req.body;

    const existingIncome = await prisma.income.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingIncome) {
      res.status(404).json({ error: 'Tuloa ei löytynyt' });
      return;
    }

    const updatedIncome = await prisma.income.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
      },
    });

    res.json(updatedIncome);
  } catch (error) {
    res.status(500).json({ error: 'Virhe tulon päivityksessä' });
  }
});

// DELETE - Poista tulo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'ID puuttuu' });
      return;
    }

    const income = await prisma.income.findUnique({
      where: { id: parseInt(id) },
    });

    if (!income) {
      res.status(404).json({ error: 'Tuloa ei löytynyt' });
      return;
    }

    await prisma.income.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Tulo poistettu onnistuneesti' });
  } catch (error) {
    res.status(500).json({ error: 'Virhe tulon poistossa' });
  }
});

export default router;