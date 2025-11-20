import express from 'express';
import type { Request, Response } from 'express';
import prisma from '../lib/db.js';

const router = express.Router();

// GET settings
router.get('/', async (req: Request, res: Response) => {
  try {
    // Always use ID 1 for settings (singleton pattern)
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        budgetEnabled: false,
        budgetAmount: 0,
      },
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Error fetching settings' });
  }
});

// PUT settings
router.put('/', async (req: Request, res: Response) => {
  try {
    const { budgetEnabled, budgetAmount } = req.body;
    
    // Validate budgetAmount if provided
    let parsedAmount = 0;
    if (budgetAmount !== undefined && budgetAmount !== null) {
      parsedAmount = parseFloat(budgetAmount.toString());
      if (isNaN(parsedAmount) || parsedAmount < 0) {
        res.status(400).json({ error: 'Invalid budget amount' });
        return;
      }
    }
    
    // Always use ID 1 for settings (singleton pattern)
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: {
        ...(budgetEnabled !== undefined && { budgetEnabled }),
        ...(budgetAmount !== undefined && { budgetAmount: parsedAmount }),
      },
      create: {
        id: 1,
        budgetEnabled: budgetEnabled ?? false,
        budgetAmount: parsedAmount,
      },
    });
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Error updating settings' });
  }
});

export default router;
