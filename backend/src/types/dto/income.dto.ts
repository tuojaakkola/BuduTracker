export interface CreateIncomeDTO {
  name: string;
  amount: number;
  categoryId: number;
  date: Date;
}

export interface UpdateIncomeDTO {
  name?: string;
  amount?: number;
  categoryId?: number;
  date?: Date;
}

export interface IncomeQueryDTO {
  month?: string;
}
