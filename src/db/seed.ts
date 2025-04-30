import { PrismaClient } from "@/generated/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();

async function seedCategories(count = 20) {
  const names = new Set<string>();
  const rows = [];
  while (names.size < count) {
    const name = faker.commerce.department();
    if (names.has(name)) continue;
    names.add(name);
    rows.push({
      name,
      description: faker.commerce.productDescription(),
      isPublish: faker.datatype.boolean(),
    });
  }
  await prisma.category.createMany({ data: rows });
  console.log(`✅ Seeded ${count} categories`);
  return count;
}

async function seedUsers(count = 100, batchSize = 20) {
  const usernames = new Set<string>();
  const emails = new Set<string>();
  const phones = new Set<string>();

  const userRows = [];
  while (userRows.length < count) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username();
    if (usernames.has(username)) continue;
    usernames.add(username);

    const email = faker.internet.email();
    if (emails.has(email)) continue;
    emails.add(email);

    const phone = faker.string.numeric(10);
    if (phones.has(phone)) continue;
    phones.add(phone);

    userRows.push({
      username,
      email,
      firstName,
      lastName,
      phone,
      avatarUrl: faker.image.avatar(),
      role: "USER" as const,
      otp: faker.string.numeric(6),
      isVerified: faker.datatype.boolean(),
    });
  }

  // Lower bcrypt work factor for faster hashing during seeding
  const passwordHashes = await Promise.all(
    userRows.map(() => bcrypt.hash("Password123!", 4)),
  );

  const rows = userRows.map((user, i) => ({
    ...user,
    passwordHash: passwordHashes[i],
  }));

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.user.createMany({ data: batch });
  }
  console.log(`✅ Seeded ${count} users (batch size: ${batchSize})`);
}

async function seedProducts(
  count = 500,
  batchSize = 100,
  categoryCount: number,
) {
  const names = new Set<string>();
  const rows = [];
  while (rows.length < count) {
    const name = faker.commerce.productName();
    if (names.has(name)) continue;
    names.add(name);

    rows.push({
      name,
      description: faker.commerce.productDescription(),
      categoryId: faker.number.int({ min: 1, max: categoryCount }),
      price: faker.commerce.price({ min: 10000, max: 1000000 }),
      quantity: faker.number.int({ min: 1, max: 100 }),
      imageUrl: faker.image.url(),
      isPublish: faker.datatype.boolean(),
    });
  }

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.product.createMany({ data: batch });
  }
  console.log(`✅ Seeded ${count} products (batch size: ${batchSize})`);
}

async function main() {
  try {
    console.log("⏳ Seeding database...");

    console.log("🗑️ Truncating tables and resetting sequences...");
    await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE;`;
    console.log("✅ Tables truncated");

    const categoryCount = await seedCategories(20);

    // Seed users and products in parallel
    await Promise.all([
      seedUsers(100, 20),
      seedProducts(500, 100, categoryCount),
    ]);

    console.log("🎉 All done!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

main();
