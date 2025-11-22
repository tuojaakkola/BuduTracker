import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/db.js';
import { NotFoundError } from '../middleware/validation.js';
import type { CreateExpenseDTO, UpdateExpenseDTO } from '../types/dto/expense.dto.js';

export class ExpenseController {

  // CREATE expense
  static async createExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
     
      // Date must be handled separately, because it needs to be converted from string to Date.
      const { date, ...rest } = req.body;

      const expenseData: CreateExpenseDTO = {
        ...rest,
        date: new Date(date)
      };

      const expense = await prisma.expense.create({
        data: expenseData,
        include: {
          category: true,
        },
      });

      res.status(201).json(expense);
    } catch (error) {
      next(error);
    }
  }

  // GET all expenses (with optional month filter)
  static async getExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
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
            lte: endDate, // Less Than or Equal (<=)
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
      const formattedExpenses = expenses.map((expense) => ({
        ...expense,
        amount: Number(expense.amount.toFixed(2)),
      }));

      res.json(formattedExpenses);
    } catch (error) {
      next(error);
    }
  }

  // UPDATE expense
  static async updateExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id!); // validateId middleware ensures this exists
      
      const { date, ...rest } = req.body;

      // Check if expense exists
      const existingExpense = await prisma.expense.findUnique({
        where: { id },
      });

      if (!existingExpense) {
        throw new NotFoundError('Expense not found');
      }

      const updateData: UpdateExpenseDTO = {
        ...rest,
        ...(date && { date: new Date(date) })
      };
      
      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
        },
      });

      res.json(updatedExpense);
    } catch (error) {
      next(error);
    }
  }

  // DELETE expense
  static async deleteExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id!); // validateId middleware ensures this exists

      // Check if expense exists
      const expense = await prisma.expense.findUnique({
        where: { id },
      });

      if (!expense) {
        throw new NotFoundError('Expense not found');
      }

      await prisma.expense.delete({
        where: { id },
      });

      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
