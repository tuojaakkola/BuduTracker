import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//"npm run seed" to run this file and seed the database with example data

async function main() {
  // Delete existing data
  await prisma.expense.deleteMany({});
  await prisma.income.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('Vanha data poistettu.');

  // Create categories
  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: { name: 'Ruoka', type: 'expense', icon: 'food', color: '#ef4444' },
    }),
    prisma.category.create({
      data: { name: 'Liikenne', type: 'expense', icon: 'car', color: '#f59e0b' },
    }),
    prisma.category.create({
      data: { name: 'Viihde', type: 'expense', icon: 'movie', color: '#8b5cf6' },
    }),
    prisma.category.create({
      data: { name: 'Asuminen', type: 'expense', icon: 'home', color: '#3b82f6' },
    }),
    prisma.category.create({
      data: { name: 'Terveys', type: 'expense', icon: 'medical-bag', color: '#10b981' },
    }),
  ]);

  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: { name: 'Palkka', type: 'income', icon: 'briefcase', color: '#10b981' },
    }),
    prisma.category.create({
      data: { name: 'Sijoitukset', type: 'income', icon: 'chart-line', color: '#f59e0b' },
    }),
    prisma.category.create({
      data: { name: 'Muut tulot', type: 'income', icon: 'cash-multiple', color: '#3b82f6' },
    }),
  ]);

  // Create example expenses
  const exampleExpenses = [
    {
      name: 'Ruokaostokset',
      amount: 50,
      categoryId: expenseCategories[0].id, 
      date: new Date('2025-01-01'),
    },
    {
      name: 'Bussilippu',
      amount: 3,
      categoryId: expenseCategories[1].id, 
      date: new Date('2025-01-02'),
    },
    {
      name: 'Elokuvalippu',
      amount: 12,
      categoryId: expenseCategories[2].id, 
      date: new Date('2025-01-03'),
    },
  ];

  // Create example incomes
  const exampleIncomes = [
    {
      name: 'Kuukausipalkka',
      amount: 2500,
      categoryId: incomeCategories[0].id,
      date: new Date('2025-01-01'),
    },
    {
      name: 'Osinkotuotto',
      amount: 300,
      categoryId: incomeCategories[1].id,
      date: new Date('2025-01-15'),
    },
    {
      name: 'Veronpalautus',
      amount: 500,
      categoryId: incomeCategories[2].id, 
      date: new Date('2025-02-01'),
    },
  ];

  // Insert example data into the database
  await prisma.expense.createMany({
    data: exampleExpenses,
  });

  await prisma.income.createMany({
    data: exampleIncomes,
  });

  console.log('Esimerkkidata luotu.');
  console.log(`Luotu ${expenseCategories.length} menokategoriaa`);
  console.log(`Luotu ${incomeCategories.length} tulokategoriaa`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
