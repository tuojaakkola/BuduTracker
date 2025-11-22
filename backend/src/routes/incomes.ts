import express from 'express';
import { IncomeController } from '../controllers/incomeController.js';
import { validateCreateIncome, validateUpdateIncome, validateId } from '../middleware/validation.js';

const router = express.Router();

// CREATE
router.post('/', validateCreateIncome, IncomeController.createIncome);

// GET 
router.get('/', IncomeController.getIncomes);

// UPDATE 
router.put('/:id', validateId, validateUpdateIncome, IncomeController.updateIncome);

// DELETE 
router.delete('/:id', validateId, IncomeController.deleteIncome);

export default router;