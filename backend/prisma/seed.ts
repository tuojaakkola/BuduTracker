import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


//"npm run seed" to run this file and seed the database with example data

async function main() {
  // Delete existing data
  await prisma.expense.deleteMany({});
  await prisma.income.deleteMany({});
  console.log('Vanha data poistettu.');

  // Create example data
  const exampleExpenses = [
    {
      name: 'Ruokaostokset',
      amount: 50,
      category: 'Ruoka',
      date: new Date('2023-01-01'),
    },
    {
      name: 'Bussilippu',
      amount: 3,
      category: 'Liikenne',
      date: new Date('2023-01-02'),
    },
    {
      name: 'Elokuvalippu',
      amount: 12,
      category: 'Viihde',
      date: new Date('2023-01-03'), 
    },
  ];

  //Create example income data
  const exampleIncomes = [
    {
      name: 'Palkka',
      amount: 2500,
      category: 'Tulot',
      date: new Date('2023-01-01'),
    },
    {
      name: 'Sijoitustuotto',
      amount: 300,
      category: 'Tulot',
      date: new Date('2023-01-15'),
    },
    {
      name: 'Veronpalautus',
      amount: 500,
      category: 'Tulot',
      date: new Date('2023-02-01'),
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
