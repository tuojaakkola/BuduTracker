import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/db.js';
import type { UpdateSettingsDTO } from '../types/dto/settings.dto.js';

export class SettingsController {
  // GET settings
  static async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      next(error);
    }
  }

  // UPDATE settings
  static async updateSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settingsData: UpdateSettingsDTO = req.body;
      
      // Always use ID 1 for settings (singleton pattern)
      const settings = await prisma.settings.upsert({
        where: { id: 1 },
        update: settingsData,
        create: {
          id: 1,
          budgetEnabled: settingsData.budgetEnabled ?? false,
          budgetAmount: settingsData.budgetAmount ?? 0,
        },
      });
      
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }
}
