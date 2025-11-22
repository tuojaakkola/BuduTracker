import type { Request, Response, NextFunction } from 'express';
import type { CreateIncomeDTO, UpdateIncomeDTO } from '../types/dto/income.dto.js';
import type { CreateExpenseDTO, UpdateExpenseDTO} from '../types/dto/expense.dto.js';
import type { CreateCategoryDTO, UpdateCategoryDTO, } from '../types/dto/category.dto.js';
import type { UpdateSettingsDTO } from '../types/dto/settings.dto.js';

// ERROR CLASSES
export class ValidationError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// ERROR HANDLER
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof ValidationError || err instanceof NotFoundError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Prisma errors
  if ('code' in err) {
    const prisma = err as any;

    if (prisma.code === 'P2002') {
      res.status(409).json({ error: 'Resource already exists' });
      return;
    }
    if (prisma.code === 'P2025') {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    if (prisma.code === 'P2003') {
      res.status(400).json({ error: 'Invalid related reference' });
      return;
    }
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// HELPER FUNCTIONS
const parseAmount = (value: any): number => {
  const parsed = parseFloat(value?.toString().replace(',', '.'));
  if (isNaN(parsed) || parsed <= 0) {
    throw new ValidationError('Invalid amount - must be a positive number');
  }
  return parsed;
};

const parseDate = (value: any): Date => {
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    throw new ValidationError('Invalid date format');
  }
  return parsed;
};

const parseId = (value: any): number => {
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    throw new ValidationError('Invalid ID');
  }
  return parsed;
};


// COMMON VALIDATORS
export const validateId = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.params.id = String(parseId(req.params.id));
    next();
  } catch (e) {
    next(e);
  }
};

// EXPENSE VALIDATION
export const validateCreateExpense = (
  req: Request<{}, {}, CreateExpenseDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, amount, categoryId, date } = req.body;

    if (!name || !amount || !categoryId || !date) {
      throw new ValidationError('Missing required fields');
    }

    req.body.amount = parseAmount(amount);
    req.body.categoryId = parseId(categoryId);
    req.body.date = parseDate(date);

    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateExpense = (
  req: Request<{}, {}, UpdateExpenseDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.amount !== undefined) {
      req.body.amount = parseAmount(req.body.amount);
    }
    if (req.body.categoryId !== undefined) {
      req.body.categoryId = parseId(req.body.categoryId);
    }
    if (req.body.date !== undefined) {
      req.body.date = parseDate(req.body.date);
    }

    next();
  } catch (e) {
    next(e);
  }
};


// INCOME VALIDATION
export const validateCreateIncome = (
  req: Request<{}, {}, CreateIncomeDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, amount, categoryId, date } = req.body;

    if (!name || !amount || !categoryId || !date) {
      throw new ValidationError('Missing required fields');
    }

    req.body.amount = parseAmount(amount);
    req.body.categoryId = parseId(categoryId);
    req.body.date = parseDate(date);

    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateIncome = (
  req: Request<{}, {}, UpdateIncomeDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.amount !== undefined) {
      req.body.amount = parseAmount(req.body.amount);
    }
    if (req.body.categoryId !== undefined) {
      req.body.categoryId = parseId(req.body.categoryId);
    }
    if (req.body.date !== undefined) {
      req.body.date = parseDate(req.body.date);
    }

    next();
  } catch (e) {
    next(e);
  }
};


// CATEGORY VALIDATION
export const validateCreateCategory = (
  req: Request<{}, {}, CreateCategoryDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, type, color, icon } = req.body;

    if (!name || !type || !color || !icon) {
      throw new ValidationError('Missing required fields');
    }

    if (type !== 'income' && type !== 'expense') {
      throw new ValidationError('Type must be income or expense');
    }

    next();
  } catch (e) {
    next(e);
  }
};

export const validateUpdateCategory = (
  req: Request<{}, {}, UpdateCategoryDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name && !req.body.color && !req.body.icon) {
      throw new ValidationError('At least one field must be provided');
    }
    next();
  } catch (e) {
    next(e);
  }
};

// SETTINGS VALIDATION
export const validateUpdateSettings = (
  req: Request<{}, {}, UpdateSettingsDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { budgetEnabled, budgetAmount } = req.body;

    if (budgetAmount !== undefined && budgetAmount !== null) {
      // For settings, allow zero as a valid budget amount (user may set 0 to disable budget)
      const parsed = parseFloat(budgetAmount?.toString().replace(',', '.'));
      if (isNaN(parsed) || parsed < 0) {
        throw new ValidationError('Invalid budgetAmount - must be a non-negative number');
      }
      req.body.budgetAmount = parsed;
    }

    if (budgetEnabled !== undefined && typeof budgetEnabled !== 'boolean') {
      throw new ValidationError('budgetEnabled must be a boolean');
    }

    next();
  } catch (e) {
    next(e);
  }
};
