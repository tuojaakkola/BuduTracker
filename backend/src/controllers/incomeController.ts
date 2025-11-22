import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/db.js';
import { NotFoundError } from '../middleware/validation.js';
import type { CreateIncomeDTO, UpdateIncomeDTO } from '../types/dto/income.dto.js';

export class IncomeController {
  // CREATE
  static async createIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Date must be handled separately, because it needs to be converted from string to Date.
      const { date, ...rest } = req.body;

      const incomeData: CreateIncomeDTO = {
        ...rest,
        date: new Date(date)
      };

      const income = await prisma.income.create({
        data: incomeData,
        include: {
          category: true,
        },
      });

      res.status(201).json(income);
    } catch (error) {
      next(error);
    }
  }

  // GET all incomes (with optional month filter)
  static async getIncomes(req: Request, res: Response, next: NextFunction): Promise<void> {
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
            gte: startDate,
            lte: endDate,
          },
        };
      }

      const incomes = await prisma.income.findMany({
        where: whereClause,
        include: {
          category: true,
        },
        orderBy: { date: 'desc' },
      });

      // Format amounts to always have 2 decimals
      const formattedIncomes = incomes.map(income => ({
        ...income,
        amount: Number(income.amount.toFixed(2))
      }));

      res.json(formattedIncomes);
    } catch (error) {
      next(error);
    }
  }

  // UPDATE income
  static async updateIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id!);
      const { date, ...rest } = req.body;

      const existingIncome = await prisma.income.findUnique({
        where: { id },
      });

      if (!existingIncome) {
        throw new NotFoundError('Income not found');
      }

      const updateData: UpdateIncomeDTO = {
        ...rest,
        ...(date && { date: new Date(date) })
      };

      const updatedIncome = await prisma.income.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
        },
      });

      res.json(updatedIncome);
    } catch (error) {
      next(error);
    }
  }

  // DELETE income
  static async deleteIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id!);

      // Check if income exists
      const income = await prisma.income.findUnique({
        where: { id },
      });

      if (!income) {
        throw new NotFoundError('Income not found');
      }

      await prisma.income.delete({
        where: { id },
      });

      res.json({ message: 'Income deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

