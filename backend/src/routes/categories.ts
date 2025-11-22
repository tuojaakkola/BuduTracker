import express from 'express';
import { CategoryController } from '../controllers/categoryController.js';
import { validateCreateCategory, validateUpdateCategory, validateId } from '../middleware/validation.js';

const router = express.Router();

// GET all categories
router.get('/', CategoryController.getAllCategories);

// GET categories by type (income/expense)
router.get('/:type', CategoryController.getCategoriesByType);

// CREATE new category
router.post('/', validateCreateCategory, CategoryController.createCategory);

// UPDATE category
router.put('/:id', validateId, validateUpdateCategory, CategoryController.updateCategory);

// DELETE category
router.delete('/:id', validateId, CategoryController.deleteCategory);

export default router;
