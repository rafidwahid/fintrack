import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Define the type for bank data (flexible for both array of strings and objects)
type BankData = string | { name: string };

async function seed() {
  // Resolve the path to your JSON file
  const filePath = path.join(__dirname, '../data/banks.json');

  // Read and parse the JSON file
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const banks: BankData[] = JSON.parse(rawData);

  // Loop through each bank and upsert into the database
  for (const bank of banks) {
    const bankName = typeof bank === 'string' ? bank : bank.name;

    await prisma.bank.upsert({
      where: { name: bankName }, // Unique identifier to check for duplicates
      update: {}, // No fields to update since we're only handling name
      create: {
        name: bankName,
      },
    });
  }
}

seed()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
