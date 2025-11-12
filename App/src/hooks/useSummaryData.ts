import { useEffect, useState } from "react";
import { fetchExpenses, fetchIncomes } from "../services/api";
import { Expense, Income } from "../types";

export const useSummaryData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [expensesData, incomesData] = await Promise.all([
        fetchExpenses(),
        fetchIncomes(),
      ]);

      setExpenses(expensesData);
      setIncomes(incomesData);
    } catch (err) {
      setError("Virhe tietojen lataamisessa. Yritä uudelleen.");
      console.error("Virhe loadData:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Count totals
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalIncomes = incomes.reduce((sum, income) => sum + income.amount, 0);

  return {
    expenses,
    incomes,
    totalExpenses,
    totalIncomes,
    loading,
    error,
    loadData, // expose loadData for manual refresh
  };
};