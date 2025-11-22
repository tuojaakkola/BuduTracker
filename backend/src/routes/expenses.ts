import express from 'express';
import { ExpenseController } from '../controllers/expenseController.js';
import { validateCreateExpense, validateUpdateExpense, validateId } from '../middleware/validation.js';

const router = express.Router();

// CREATE expense
router.post('/', validateCreateExpense, ExpenseController.createExpense);

// GET all expenses (with optional month filter)
router.get('/', ExpenseController.getExpenses);

// UPDATE expense
router.put('/:id', validateId, validateUpdateExpense, ExpenseController.updateExpense);

// DELETE expense
router.delete('/:id', validateId, ExpenseController.deleteExpense);

export default router;
