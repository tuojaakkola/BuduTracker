export interface CreateCategoryDTO {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  color?: string;
  icon?: string;
}

export interface CategoryTypeDTO {
  type: 'income' | 'expense';
}
