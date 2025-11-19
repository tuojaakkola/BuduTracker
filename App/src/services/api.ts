import { Expense, Income, Category } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL;  

// CATEGORIES 

// Get all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    
    if (!response.ok) {
      throw new Error('Virhe kategorioiden haussa');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetchCategories:', error);
    throw error;
  }
};

// Get categories by type
export const fetchCategoriesByType = async (type: 'income' | 'expense'): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories/${type}`);
    
    if (!response.ok) {
      throw new Error('Virhe kategorioiden haussa');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetchCategoriesByType:', error);
    throw error;
  }
};

//  EXPENSES 

// Get all expenses
export const fetchExpenses = async (month?: string): Promise<Expense[]> => {
  try {
    const url = month 
      ? `${API_URL}/expenses?month=${month}` 
      : `${API_URL}/expenses`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Virhe menojen haussa');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetchExpenses:', error);
    throw error;
  }
};

// Add new expense
export const createExpense = async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
  try {
    const response = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) {
      throw new Error('Virhe menon luonnissa');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error createExpense:', error);
    throw error;
  }
};

// Update expense
export const updateExpense = async (id: number, expense: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Expense> => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) {
      throw new Error('Virhe menon päivityksessä');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updateExpense:', error);
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Virhe menon poistossa');
    }
  } catch (error) {
    console.error('Error deleteExpense:', error);
    throw error;
  }
};

// INCOMES 

// Get all incomes  
export const fetchIncomes = async (month?: string): Promise<Income[]> => {
  try {
    const url = month 
      ? `${API_URL}/incomes?month=${month}` 
      : `${API_URL}/incomes`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Virhe tulojen haussa');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetchIncomes:', error);
    throw error;
  }
};

// Add new income
export const createIncome = async (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>): Promise<Income> => {
  try {
    const response = await fetch(`${API_URL}/incomes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(income),
    });
    
    if (!response.ok) {
      throw new Error('Virhe tulon luonnissa');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error createIncome:', error);
    throw error;
  }
};

// Update income
export const updateIncome = async (id: number, income: Partial<Omit<Income, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Income> => {
  try {
    const response = await fetch(`${API_URL}/incomes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(income),
    });
    
    if (!response.ok) {
      throw new Error('Virhe tulon päivityksessä');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updateIncome:', error);
    throw error;
  }
};

// Delete income
export const deleteIncome = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/incomes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Virhe tulon poistossa');
    }
  } catch (error) {
    console.error('Error deleteIncome:', error);
    throw error;
  }
};
