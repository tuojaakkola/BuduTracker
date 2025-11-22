import type { Request, Response, NextFunction } from 'express';
import prisma from '../lib/db.js';
import { NotFoundError, ValidationError } from '../middleware/validation.js';
import type { CreateCategoryDTO, UpdateCategoryDTO, CategoryTypeDTO } from '../types/dto/category.dto.js';

export class CategoryController {
  // GET all categories
  static async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  // GET categories by type (income/expense)
  static async getCategoriesByType(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const type = req.params.type as CategoryTypeDTO['type'];

      if (type !== 'income' && type !== 'expense') {
        throw new ValidationError('Type must be "income" or "expense"');
      }

      const categories = await prisma.category.findMany({
        where: { type },
        orderBy: { name: 'asc' },
      });
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  // CREATE
  static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryData: CreateCategoryDTO = req.body;

      const category = await prisma.category.create({
        data: categoryData,
      });

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  // UPDATE
  static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id!);

      const updateData: UpdateCategoryDTO = req.body;

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: updateData,
      });

      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  // DELETE
  static async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id!);

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundError('Category not found');
      }

      // Check if category has any transactions
      const expenseCount = await prisma.expense.count({
        where: { categoryId: id },
      });
      
      const incomeCount = await prisma.income.count({
        where: { categoryId: id },
      });

      if (expenseCount > 0 || incomeCount > 0) {
        throw new ValidationError(`Cannot delete category with existing transactions (${expenseCount + incomeCount} transactions found)`);
      }

      await prisma.category.delete({
        where: { id },
      });

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
