// Data Transfer Objects for Expense endpoints

export interface CreateExpenseDTO {
  name: string;
  amount: number;
  categoryId: number;
  date: Date;
}

export interface UpdateExpenseDTO {
  name?: string;
  amount?: number;
  categoryId?: number;
  date?: Date;
}
