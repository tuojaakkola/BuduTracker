import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import expensesRouter from './routes/expenses.js';
import incomesRouter from './routes/incomes.js';
import categoriesRouter from './routes/categories.js';
import settingsRouter from './routes/settings.js';

const app: Express = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expensesRouter);
app.use('/api/incomes', incomesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/settings', settingsRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at:`);
  console.log(`   - Local: http://localhost:${PORT}`);
});