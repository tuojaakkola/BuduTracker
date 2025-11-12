// Types for Expense and Income objects

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: number;
  name: string;
  amount: number;
  categoryId: number;
  category?: Category;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: number;
  name: string;
  amount: number;
  categoryId: number;
  category?: Category;
  date: string;
  createdAt: string;
  updatedAt: string;
}
