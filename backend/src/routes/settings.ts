import express from 'express';
import { SettingsController } from '../controllers/settingsController.js';
import { validateUpdateSettings } from '../middleware/validation.js';

const router = express.Router();

// GET settings
router.get('/', SettingsController.getSettings);

// PUT settings
router.put('/', validateUpdateSettings, SettingsController.updateSettings);

export default router;
