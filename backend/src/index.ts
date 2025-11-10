import 'dotenv/config';
import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import expensesRouter from './routes/expenses.js';
import incomesRouter from './routes/incomes.js';

const app: Express = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expensesRouter);
app.use('/api/incomes', incomesRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server käynnissä osoitteessa http://localhost:${PORT}`);
});